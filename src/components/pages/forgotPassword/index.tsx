/* eslint-disable @next/next/no-img-element */
import Breadcrumb from '@/components/Breadcrumb'
// import Link from 'next/link'
import { TextField } from '@/components/inputs/textField'
import { useForm } from 'react-hook-form'
import { LoginReq } from '@/types/auth'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { ButtonSubmit } from '@/components/button/btnSubmit'
import { toast } from 'react-toastify'
import { useMutation } from 'react-query'
import authenApi from '@/services/authenticate.queries'
import React from 'react'
import router from 'next/router'

const ForgotPasswordPage = () => {
  const { control, handleSubmit } = useForm<LoginReq>({
    mode: 'all',
    resolver: yupResolver(schemaValidate),
  })

  const { isLoading, mutate } = useMutation({
    mutationFn: async (data: LoginReq) => {
      return await authenApi.reqResetPass({
        email: data?.email,
      })
    },
    onSuccess: (response: any) => {
      if (!!response?.requestPasswordResetEmail) {
        toast.success('Gửi yêu cầu cấp mật khẩu thành công ! Vui lòng kiểm tra Email của bạn')
        router.push('/login')
      }
    },
    onError: () => { },
  })

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
            title: 'Quên mật khẩu',
            href: '/forgot-password',
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
              <div className="title mb-title ">
                <h3 className="color-green2 t-title "> Quên mật khẩu </h3>
              </div>
              <form onSubmit={onSubmitHandler} className="form d-block">
                <TextField
                  required
                  name="email"
                  type="text"
                  placeholder="Example@gmail.com"
                  nameLabel="Email"
                  control={control}
                />
                <div>
                  <div className="btns">
                    <ButtonSubmit
                      type="submit"
                      style={{ border: 'none' }}
                      title="Gửi"
                      loading={isLoading}
                    />
                  </div>
                  {/* <Link
                    href={'/login'}
                    className="d-block color-999 fsz-13"
                    style={{ textAlign: 'right', textDecoration: 'none !important' }}>
                    Quay lại đăng nhập
                  </Link> */}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ForgotPasswordPage

const schemaValidate: Yup.ObjectSchema<any> = Yup.object().shape({
  email: Yup.string()
    .matches(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/, 'Email không đúng định dạng')
    .required('Trường này không được bỏ trống'),
})
