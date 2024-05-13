import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { TextField } from '@/components/inputs/textField'
import { ButtonSubmit } from '@/components/button/btnSubmit'
import { useMutation } from 'react-query'
import authenApi from '@/services/authenticate.queries'
import { toast } from 'react-toastify'

const ChangePasswordtab = () => {
  const { control, handleSubmit, reset } = useForm<any>({
    mode: 'all',
    resolver: yupResolver(schemaValidate),
  })

  const { isLoading, mutate } = useMutation({
    mutationFn: async (data: any) => {
      return await authenApi.changeCustomerPassword({
        currentPassword: data?.currentPassword,
        newPassword: data?.newPassword,
      })
    },
    onSuccess: (response: any) => {
      if (response?.changeCustomerPassword) {
        toast.success('Đổi mật khẩu thành công')
        reset();
      }
    },
    onError: () => { },
  })

  const onSubmitHandler = handleSubmit((val) => {
    // if (val?.currentPassword == val?.newPassword) {
    //   toast.error('Mật khẩu mới không được trùng với mật khẩu cũ')
    //   return
    // }
    mutate(val)
  })

  return (
    <div className="account-tab change-pass">
      <h4 className="fw-bold text-capitalize mb-title"> Thay đổi mật khẩu </h4>
      <form onSubmit={onSubmitHandler} className="content">
        <div className="row">
          <div className="col-lg-12">
            <TextField
              required
              control={control}
              name="currentPassword"
              type="password"
              placeholder="Nhập mật khẩu hiện tại"
              nameLabel="Mật khẩu hiện tại"
              fClassName="show_hide_password"
            />
          </div>
          <div className="col-lg-12">
            <TextField
              required
              control={control}
              name="newPassword"
              type="password"
              placeholder="Nhập mật khẩu mới"
              nameLabel="Mật khẩu mới"
              fClassName="show_hide_password"
            />
          </div>
          <div className="col-lg-12">
            <TextField
              required
              control={control}
              name="rePassword"
              type="password"
              placeholder="Nhập mật lại khẩu mới"
              nameLabel="Nhập lại mật khẩu mới"
              fClassName="show_hide_password"
            />
          </div>
          <div className="col-lg-12">
            <ButtonSubmit
              type="submit"
              style={{ border: 'none', width: '-webkit-fill-available' }}
              className="butn bg-green2 text-white radius-4 fw-500 fsz-12 text-uppercase text-center mt-8 py-3 px-5"
              title="Đổi mật khẩu"
              loading={isLoading}
            />
          </div>
        </div>
      </form>
    </div>
  )
}

export default ChangePasswordtab

const schemaValidate: Yup.ObjectSchema<any> = Yup.object().shape({
  currentPassword: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/,
      'Mật khẩu ít nhất 8 ký tự : In hoa , in thường , số , ký tự đặc biệt'
    )
    .required('Trường này không được bỏ trống'),
  newPassword: Yup.string()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/,
      'Mật khẩu ít nhất 8 ký tự : In hoa , in thường , số , ký tự đặc biệt'
    )
    .notOneOf([Yup.ref('currentPassword')], 'Mật khẩu mới không được trùng mật khẩu cũ')
    .required('Trường này không được bỏ trống'),
  rePassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Nhập lại mật khẩu không chính xác')
    .required('Trường này không được bỏ trống '),
})
