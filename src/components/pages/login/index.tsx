/* eslint-disable @next/next/no-img-element */
import Breadcrumb from '@/components/Breadcrumb'
import Link from 'next/link'
import { TextField } from '@/components/inputs/textField'
import { useForm } from 'react-hook-form'
import { LoginReq } from '@/types/auth'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { ButtonSubmit } from '@/components/button/btnSubmit'
import { toast } from 'react-toastify'
import router from 'next/router'
import { useMutation, useQueryClient } from 'react-query'
import authenApi from '@/services/authenticate.queries'
import React from 'react'
import SocialPage from './social'
import { graphQLClient, COOKIE_KEY } from '@/services/graphql'
import Cookies from 'js-cookie'
import {
  __getDataLocal,
  __RemoveItemLocal,
  __CreateDataLocal,
} from '@/helper/local_helper/localStogare'
import useCart from '@/hooks/useCart'
import productApi from '@/services/product'
import { compareApi } from '@/services'

const LoginPage = () => {
  const { onUserCreateCart } = useCart()
  const queryClient = useQueryClient()
  const { control, handleSubmit } = useForm<LoginReq>({
    mode: 'all',
    resolver: yupResolver(schemaValidate),
  })

  const { mutate: mutateAddFavorite } = useMutation({
    mutationFn: async (data: any) => {
      return await productApi.addProductsToWishlist(data)
    },
    onSuccess: (response: any) => {
      if (!!response?.addProductsToWishlist?.wishlist) {
        queryClient.invalidateQueries(['getWishlists'])
      }
    },
    onError: () => { },
  })

  const assignCompareListToCustomer = () => {
    const getID = __getDataLocal({ key: 'compare-product', type: 'string' })
    if (!!getID) {
      mutateAssignCompare({ uid: getID })
    } else {
      CreateCompare([])
    }
  }

  const { mutate: CreateCompare } = useMutation({
    mutationFn: async (data: any) => {
      return await compareApi.createCompare({
        input: {
          products: data,
        },
      })
    },
    onSuccess: async (response: any) => {
      if (!!response?.createCompareList) {
        __CreateDataLocal({
          type: 'string',
          key: 'compare-product',
          data: response?.createCompareList?.uid,
        })
        // await queryClient.invalidateQueries(['getCompare'])
      }
    },
    onError: () => { },
  })

  const { mutate: mutateAssignCompare } = useMutation({
    mutationFn: async (data: any) => {
      return await compareApi.assignCompareToCustomer(data)
    },
    onSuccess: async (response: any) => {
      if (!!response?.assignCompareListToCustomer) {
        __CreateDataLocal({
          type: 'string',
          key: 'compare-product',
          data: response?.assignCompareListToCustomer?.compare_list?.uid,
        })
        // await queryClient.invalidateQueries(['getCompare'])
      }
    },
    onError: () => { },
  })

  const handleBindApi = () => {
    const getFavorite = __getDataLocal({ key: 'favorite-product', type: 'array' }) || []
    if (getFavorite?.length > 0) {
      const wishlistItems = getFavorite?.map((item: any) => ({
        selected_options: item.defaultData[0].selected_options,
        parent_sku: item.defaultData[0].parent_sku,
        sku: item.defaultData[0].sku,
        quantity: item.defaultData[0].quantity,
      }))
      const param = {
        wishlistId: '0',
        wishlistItems: wishlistItems,
      }
      mutateAddFavorite(param)
      __RemoveItemLocal({ key: 'favorite-product' })
    }

    assignCompareListToCustomer()
  }

  const { isLoading, mutate } = useMutation({
    mutationFn: async (data: LoginReq) => {
      return await authenApi.SignIn({
        email: data?.email,
        password: data?.password,
      })
    },
    onSuccess: async (response: any) => {
      if (!!response?.generateCustomerToken) {
        // Set token
        const token = response?.generateCustomerToken?.token
        addCookieToken(token)

        // Create and merge cart user
        onUserCreateCart()

        // Show toast and redirect
        toast.success('Đăng nhập thành công')
        router.push('/')

        // Handle favorite product and compare product
        handleBindApi()
      }
    },
    onError: () => { },
  })

  const addCookieToken = (token: string) => {
    Cookies.set(COOKIE_KEY?.ACCESS_TOKEN, token)
    graphQLClient.setHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      accept: 'application/json',
    })
  }

  const onSubmitHandler = handleSubmit((value) => {
    mutate(value)
  })

  return (
    <div className="home-style3 login-pg-1">
      <Breadcrumb
        items={[
          {
            title: 'Trang chủ',
            href: '/',
          },
          {
            title: 'Đăng nhập',
            href: '/login',
          },
        ]}
      />

      <section className="tc-login box-wr bg-white mt-3 mb-3">
        <div className="row align-items-center justify-content-around">
          <div className="col-lg-4">
            <div className="img">
              <img src="/assets/images/inner/login.svg" alt="" />
            </div>
          </div>
          <div className="col-lg-5">
            <div className="login-form">
              <div className="title mb-title">
                <h3 className="color-green2 mb-8 t-title"> Chào mừng trở lại </h3>
                <p className="fz-16 t-sub-title text-uppercase ltspc-2 color-999 mb-0"> đăng nhập để tiếp tục </p>
              </div>
              <form onSubmit={onSubmitHandler} className="form d-block">
                <TextField
                  required
                  name="email"
                  type="text"
                  placeholder="Nhập email hoặc số điện thoại"
                  nameLabel="Email hoặc số điện thoại"
                  control={control}
                />
                <TextField
                  required
                  control={control}
                  name="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  nameLabel="Mật khẩu"
                  fClassName="show_hide_password"
                />
                <Link
                  href={'/forgot-password'}
                  className="d-block fsz-13 cl-primary btn-forget-pass "
                  style={{ textAlign: 'right' }}>
                  Quên mật khẩu ?
                </Link>
                <div className="btns">
                  <ButtonSubmit
                    type="submit"
                    style={{ border: 'none' }}
                    title="Đăng nhập"
                    loading={isLoading}
                  />
                </div>

                <SocialPage />

                <div className="text-uppercase color-999 fsz-14 action-login">
                  chưa có tài khoản ?{' '}
                  <Link href={'/register'} className="color-green2 btn-login ">
                    {' '}
                    Đăng ký ngay{' '}
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default LoginPage

const schemaValidate: Yup.ObjectSchema<LoginReq> = Yup.object().shape({
  email: Yup.string()
    .required('Trường này không được bỏ trống')
    .matches(
      /^([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+|0\d{9})$/,
      'Email hoặc số điện thoại không đúng định dạng'
    ),
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/,
      'Mật khẩu ít nhất 8 ký tự : In hoa , in thường , số , ký tự đặc biệt'
    )
    .required('Trường này không được bỏ trống'),
})
