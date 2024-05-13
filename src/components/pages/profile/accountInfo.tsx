import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { TextField } from '@/components/inputs/textField'
import { ButtonSubmit } from '@/components/button/btnSubmit'
import React, { useEffect } from 'react'
import { useMutation } from 'react-query'
import authenApi from '@/services/authenticate.queries'
import FormAddressInfo from './formAddress'
import { toast } from 'react-toastify'

const AccountInfoTab = ({ dataUserInfo }: any) => {
  const { control, handleSubmit, setValue } = useForm<any>({
    mode: 'all',
    defaultValues: {
      firstname: '',
      lastname: '',
      email: '',
      phone_number: '',
    },
    resolver: yupResolver(schemaValidate),
  })

  const { isLoading, mutate } = useMutation({
    mutationFn: async (data: any) => {
      return await authenApi.UpdateCustomer({
        input: {
          mobile_number: data?.phone_number,
          firstname: data?.firstname,
          lastname: data?.lastname,
        },
      })
    },
    onSuccess: async (response: any) => {
      if (response?.updateCustomerV2?.customer) {
        toast.success('Lưu thành công')
      }
    },
    onError: () => {},
  })

  useEffect(() => {
    if (!!dataUserInfo) {
      setValue('firstname', dataUserInfo?.firstname)
      setValue('lastname', dataUserInfo?.lastname)
      setValue('email', dataUserInfo?.mailHiden)
      setValue('phone_number', dataUserInfo?.mobile_number)
      // setValue('addresses', dataUserInfo?.addresses || [])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUserInfo])

  const onSubmitHandler = handleSubmit((value) => {
    mutate(value)
  })

  return (
    <div className="account-tab">
      <h4 className="fw-bold text-capitalize mb-title txt-header-profile"> Thông tin tài khoản </h4>
      <form onSubmit={onSubmitHandler} className="content">
        <div className="row">
          <div className="col-lg-6">
            <TextField
              required
              name="lastname"
              type="text"
              placeholder="Nhập họ của bạn"
              nameLabel="Họ"
              control={control}
            />
          </div>
          <div className="col-lg-6">
            <TextField
              required
              name="firstname"
              type="text"
              placeholder="Nhập tên của bạn"
              nameLabel="Tên"
              control={control}
            />
          </div>
          <div className="col-lg-6">
            <TextField
              required
              name="email"
              type="email"
              placeholder="Nhập email của bạn"
              nameLabel="Email"
              disabled
              control={control}
            />
          </div>
          <div className="col-lg-6">
            <TextField
              name="phone_number"
              type="text"
              placeholder="Nhập số điện thoại của bạn"
              nameLabel="Số điện thoại"
              control={control}
              required
            />
          </div>
          <div className="col-lg-12">
            <ButtonSubmit
              type="submit"
              className="butn btn-save-acc bg-green2 text-white radius-4 fw-500 fsz-12 text-uppercase text-center mt-20 py-3 px-5"
              style={{
                border: 'none',
                // width: '-webkit-fill-available',
              }}
              title="Lưu thông tin"
              loading={isLoading}
              mt={15}
            />
          </div>
        </div>
      </form>

      <FormAddressInfo dataUserInfo={dataUserInfo} />
    </div>
  )
}

export default AccountInfoTab

const schemaValidate: Yup.ObjectSchema<any> = Yup.object().shape({
  lastname: Yup.string().required('Trường này không được bỏ trống'),
  firstname: Yup.string().required('Trường này không được bỏ trống'),
  // city: Yup.string().required('Trường này không được bỏ trống'),
  // district: Yup.string().required('Trường này không được bỏ trống'),
  // ward: Yup.string().required('Trường này không được bỏ trống'),
  // street: Yup.string().required('Trường này không được bỏ trống'),
  email: Yup.string()
    .required('Trường này không được bỏ trống'),
  phone_number: Yup.string()
    .required('Trường này không được bỏ trống')
    .matches(/^0\d{9}$/, 'Số điện thoại không đúng định dạng'),
})
