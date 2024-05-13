/* eslint-disable @next/next/no-img-element */
import Breadcrumb from '@/components/Breadcrumb'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { RegisterReq } from '@/types/auth'
import { TextField } from '@/components/inputs/textField'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { useMutation } from 'react-query'
import authenApi from '@/services/authenticate.queries'
import { toast } from 'react-toastify'
import router from 'next/router'
import { ButtonSubmit } from '@/components/button/btnSubmit'
import React from 'react'
import SocialPage from '@/components/pages/login/social'

const RegisterPage = () => {
  const { control, handleSubmit } = useForm<RegisterReq>({
    mode: 'all',
    resolver: yupResolver(schemaValidate),
  })

  const { isLoading, mutate } = useMutation({
    mutationFn: async (data: RegisterReq) => {
      return await authenApi.SignUp({
        input: {
          email: data?.email,
          lastname: data?.lastname,
          firstname: data?.firstname,
          password: data?.password,
        },
      })
      // .then((response) => console.log('response', response))
      // .catch((err) => console.log('err', err))
    },
    onSuccess: (response: any) => {
      if (response?.createCustomerV2 !== null) {
        toast.success('Đăng ký tài khoản thành công')
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
            title: 'Đăng ký',
            href: '/register',
          },
        ]}
      />

      <section className="tc-register box-wr bg-white mt-3 mb-3">
        <div className="row align-items-center justify-content-around">
          <div className="col-lg-4">
            <div className="img">
              <img src="/assets/images/inner/login.svg" alt="" />
            </div>
          </div>
          <div className="col-lg-5">
            <div className="login-form">
              <div className="title mb-title">
                <h3 className="color-green2 mb-8 t-title"> Đăng ký </h3>
                <p className="fz-16 text-uppercase ltspc-2 color-999"> tham gia với chúng tôi </p>
              </div>
              <form onSubmit={onSubmitHandler} className="form d-block">
                <TextField
                  required
                  name="lastname"
                  type="text"
                  placeholder="Nhập họ của bạn"
                  nameLabel="Họ"
                  control={control}
                />
                <TextField
                  required
                  control={control}
                  name="firstname"
                  type="text"
                  placeholder="Nhập tên của bạn"
                  nameLabel="Tên"
                />
                <TextField
                  required
                  control={control}
                  name="email"
                  type="text"
                  placeholder="Example@gmail.com"
                  nameLabel="Email"
                />
                <TextField
                  required
                  control={control}
                  name="password"
                  type="password"
                  placeholder="Nhập mật khẩu"
                  nameLabel="Mật khẩu"
                  fClassName="show_hide_password"
                // icon={<i className="show_pass la la-eye-slash"></i>}
                />
                <TextField
                  required
                  control={control}
                  name="rePassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  nameLabel="Nhập lại mật khẩu"
                  fClassName="show_hide_password"
                // icon={<i className="show_pass la la-eye-slash"></i>}
                />
                <div className="btns">
                  <ButtonSubmit
                    type="submit"
                    style={{
                      border: 'none',
                    }}
                    title="Đăng ký"
                    loading={isLoading}
                  />
                </div>

                <SocialPage />
                <div className="text-uppercase color-999 fsz-14 action-regis">
                  {' '}
                  Bạn đã có tài khoản ?{' '}
                  <Link href={'/login'} className="color-green2 btn-login">
                    {' '}
                    Đăng nhập{' '}
                  </Link>{' '}
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default RegisterPage

const schemaValidate: Yup.ObjectSchema<RegisterReq> = Yup.object().shape({
  lastname: Yup.string().required('Trường này không được bỏ trống'),
  firstname: Yup.string().required('Trường này không được bỏ trống'),
  email: Yup.string()
    .matches(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/, 'Email không đúng định dạng')
    .required('Trường này không được bỏ trống'),
  password: Yup.string()
    // .min(8, 'Password minimum 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/,
      'Mật khẩu ít nhất 8 ký tự : In hoa , in thường , số , ký tự đặc biệt'
    )
    .required('Trường này không được bỏ trống'),
  rePassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Nhập lại mật khẩu không chính xác')
    .required('Trường này không được bỏ trống '),
})
