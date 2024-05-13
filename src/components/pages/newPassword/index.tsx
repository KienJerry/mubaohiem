/* eslint-disable @next/next/no-img-element */
import Breadcrumb from '@/components/Breadcrumb'
import { TextField } from '@/components/inputs/textField'
import { useForm } from 'react-hook-form'
import { LoginReq } from '@/types/auth'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { ButtonSubmit } from '@/components/button/btnSubmit'
import { toast } from 'react-toastify'
import { useMutation } from 'react-query'
import authenApi from '@/services/authenticate.queries'
import { useRouter } from 'next/router'

const NewPasswordPage = () => {
  const router = useRouter()
  const paramUrl: any = router.query

  const { control, handleSubmit } = useForm<LoginReq>({
    mode: 'all',
    resolver: yupResolver(schemaValidate),
  })

  // useEffect(() => {
  //   if (!data?.rstoken || !data?.email) {
  //     router.push('/404');
  //   }
  // }, [data])

  const { isLoading, mutate } = useMutation({
    mutationFn: async (data: LoginReq) => {
      return await authenApi.ResetPass({
        newPassword: data?.password,
        email: paramUrl?.email,
        resetPasswordToken: paramUrl?.rstoken,
      })
    },
    onSuccess: (response: any) => {
      if (!!response?.resetPassword) {
        toast.success('Đổi mật khẩu thành công!')
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
            title: 'Mật khẩu mới',
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
              <div className="title mb-title">
                <h3 className="color-green2 mb-10"> Mật khẩu mới </h3>
              </div>
              <form onSubmit={onSubmitHandler} className="form d-block">
                <TextField
                  required
                  control={control}
                  name="password"
                  type="password"
                  placeholder="Nhập mật khẩu mới"
                  nameLabel="Mật khẩu mới"
                  fClassName="show_hide_password"
                />
                <TextField
                  required
                  control={control}
                  name="rePassword"
                  type="password"
                  placeholder="Nhập lại mật khẩu mới"
                  nameLabel="Nhập lại mật khẩu"
                  fClassName="show_hide_password"
                />
                <div className="btns">
                  <ButtonSubmit
                    type="submit"
                    style={{ border: 'none' }}
                    title="Đổi mật khẩu"
                    loading={isLoading}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default NewPasswordPage

const schemaValidate: Yup.ObjectSchema<any> = Yup.object().shape({
  password: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/,
      'Mật khẩu ít nhất 8 ký tự : In hoa , in thường , số , ký tự đặc biệt'
    )
    .required('Trường này không được bỏ trống'),
  rePassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Nhập lại mật khẩu không chính xác')
    .required('Trường này không được bỏ trống '),
})
