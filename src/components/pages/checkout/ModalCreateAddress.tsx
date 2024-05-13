import * as Yup from 'yup'
import { Modal } from 'antd'
import { toast } from 'react-toastify'
import { Spinner } from '@/components/spinner'

import { TextField } from '@/components/inputs'
import { useMutation, useQuery } from 'react-query'
import addressApi from '@/services/address.queries'
import { useForm, Controller } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import authenApi from '@/services/authenticate.queries'
import { FormSelectAntd } from '@/components/select/formSelectAntd'
import { queryClient } from '@/pages/_app'

export enum MODAL_ADDRESS_MODE {
  CREATE = 'CREATE',
  EDIT = 'EDIT',
}

type ModalCreateAddress = {
  mode?: MODAL_ADDRESS_MODE.CREATE | MODAL_ADDRESS_MODE.EDIT,
  isModalOpen?: boolean,
  defaultValues?: Record<string, string>,
  onCancel: () => void,
}

type variableCreateAddress = {
  input: {
    firstname: string,
    lastname: string,
    telephone: string,
    city?: string,
    city_id: number,
    district?: string,
    district_id: number,
    ward?: string,
    ward_id: number,
    street: string[],
    country_code: 'VN',
    default_billing: boolean,
    default_shipping: boolean,
  },
}

type variableUpdateAddress = variableCreateAddress & {
  id: string,
}

const ModalCreateAddress: React.FC<ModalCreateAddress> = ({
  mode = MODAL_ADDRESS_MODE.CREATE,
  isModalOpen = false,
  defaultValues = {},
  onCancel,
}) => {
  const { control, register, handleSubmit, setValue, watch } = useForm<any>({
    mode: 'all',
    defaultValues: {
      ...defaultValues,
    },
    resolver: yupResolver(schemaValidate),
  })

  const { data: cities, isLoading: isFetchingCity } = useQuery(['GET_CITIES'], {
    queryFn: async () => {
      return await addressApi
        .getCity({ country_id: 'VN' })
        ?.then((res: any) => res?.citys?.listcitys)
    },
    staleTime: 30000,
  })

  const { data: districts, isLoading: isFetchingDistrict } = useQuery(
    ['GET_DISTRICTS', watch('city')?.value],
    {
      queryFn: async () => {
        return await addressApi
          .getDistricts({ city_id: watch('city')?.value })
          ?.then((res: any) => res?.districts?.listdistricts)
      },
      staleTime: 30000,
      enabled: !!watch('city')?.value,
    }
  )

  const { data: wards, isLoading: isFetchingWard } = useQuery(
    ['GET_WARDS', watch('district')?.value],
    {
      queryFn: async () => {
        return await addressApi
          .getWards({ district_id: watch('district')?.value })
          ?.then((res: any) => res?.wards?.listwards)
      },
      staleTime: 30000,
      enabled: !!watch('district')?.value,
    }
  )

  const { mutate: mutateCreateAddress, isLoading: isLoadingCreateCart } = useMutation({
    mutationFn: async (variable: variableCreateAddress) => {
      return await authenApi.CreateAddressCustomer(variable)
    },
    onSuccess: (data: any) => {
      if (data?.createCustomerAddress === null) {
        toast.error('Lỗi! Đã có lỗi xảy ra, vui là thử lai.')
        return data
      }
      queryClient.refetchQueries(['getCustomer'])
      toast.success('Lưu thành công')
      onCancel()
      return data
    },
    onError: () => {
      toast.error('Lỗi! Đã có lỗi xảy ra, vui là thử lai.')
    },
  })

  const { mutate: mutateUpdateAddress, isLoading: isLoadingUpdateCart } = useMutation({
    mutationFn: async (variable: variableUpdateAddress) => {
      return await authenApi.UpdateAddressCustomer(variable)
    },
    onSuccess: (data: any) => {
      if (data === undefined) {
        toast.error('Lỗi! Đã có lỗi xảy ra, vui là thử lai.')
        return data
      }
      queryClient.refetchQueries(['getCustomer'])
      toast.success('Lưu thành công')
      onCancel()
      return data
    },
    onError: () => {
      toast.error('Lỗi! Đã có lỗi xảy ra, vui là thử lai.')
    },
  })

  const handlerOnSubmit = handleSubmit((formValues) => {
    const inputApi: variableCreateAddress = {
      input: {
        firstname: formValues?.firstName,
        lastname: formValues?.lastName,
        telephone: formValues?.phoneNumber,
        city: formValues?.city?.label,
        city_id: formValues?.city?.value,
        district: formValues?.district?.label,
        district_id: formValues?.district?.value,
        ward: formValues?.ward?.label,
        ward_id: formValues?.ward?.value,
        street: [formValues?.street],
        country_code: 'VN',
        default_billing: formValues?.isDefault,
        default_shipping: formValues?.isDefault,
      },
    }

    if (mode === MODAL_ADDRESS_MODE.EDIT)
      return mutateUpdateAddress({ ...inputApi, id: defaultValues?.id ?? '' })

    return mutateCreateAddress(inputApi)
  })

  const footerModal = (
    <div className="footer-content">
      <button className="btn-cancel butn" onClick={onCancel}>
        Huỷ
      </button>
      <button className="btn-save butn" onClick={handlerOnSubmit}>
        {isLoadingCreateCart || isLoadingUpdateCart ? <Spinner /> : 'Lưu'}
      </button>
    </div>
  )

  if (!isModalOpen) return null
  return (
    <Modal
      open={true}
      onCancel={onCancel}
      width={750}
      title={
        mode === MODAL_ADDRESS_MODE.CREATE ? 'Thêm địa chỉ nhận hàng mới!' : 'Cập nhật địa chỉ'
      }
      className="MN-modal"
      footer={footerModal}>
      <form className="form" onSubmit={handlerOnSubmit}>
        <div className="form-content">
          <div className="row gx-3">
            <div className="col-lg-6">
              <div className="form-group mb-16">
                <TextField
                  name="lastName"
                  type="text"
                  className="form-control"
                  nameLabel="Họ"
                  placeholder="Nhập họ của bạn"
                  required
                  control={control}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group mb-16">
                <TextField
                  name="firstName"
                  type="text"
                  className="form-control"
                  nameLabel="Tên"
                  placeholder="Nhập tên của bạn"
                  required
                  control={control}
                />
              </div>
            </div>
            <div className="col-lg-12">
              <div className="form-group mb-16">
                <TextField
                  name="phoneNumber"
                  type="text"
                  className="form-control"
                  placeholder="Nhập số điện thoại của bạn"
                  nameLabel="Số điện thoại"
                  control={control}
                  required
                />
              </div>
            </div>
            {/* <div className="col-lg-12">
              <div className="form-group mb-4">
                <TextField
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="Nhập email của bạn"
                  nameLabel="Email"
                  control={control}
                  required
                />
              </div>
            </div> */}
            <div className="col-lg-4">
              <div className="form-group mb-16">
                <Controller
                  name="city"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <FormSelectAntd
                      name="city"
                      required
                      error={error}
                      nameLabel="Thành phố / Thị trấn"
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input: any, option: any) =>
                        (option?.label ?? '').includes(input)
                      }
                      filterSort={(optionA: any, optionB: any) =>
                        (optionA?.label ?? '')
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? '').toLowerCase())
                      }
                      style={{ width: '100%', height: '45px' }}
                      loading={isFetchingCity}
                      value={value}
                      placeholder="Chọn Tỉnh / Thành phố"
                      options={
                        cities?.length > 0
                          ? cities?.map((val: any) => ({
                            value: val?.city_id,
                            label: val?.default_name,
                          }))
                          : []
                      }
                      onChange={(id: any) => {
                        if (id === value) return

                        const selectedCity = cities?.find((city: any) => city.city_id === id)
                        if (!selectedCity) return

                        const newValue = {
                          label: selectedCity.default_name,
                          value: selectedCity.city_id,
                        }
                        onChange(newValue)
                        setValue('district', {})
                        setValue('ward', {})
                      }}
                    />
                  )}
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group mb-16">
                <Controller
                  name="district"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <FormSelectAntd
                      name="district"
                      required
                      error={error}
                      nameLabel="Quận / Huyện"
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input: any, option: any) =>
                        (option?.label ?? '').includes(input)
                      }
                      filterSort={(optionA: any, optionB: any) =>
                        (optionA?.label ?? '')
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? '').toLowerCase())
                      }
                      style={{ width: '100%', height: '45px' }}
                      loading={isFetchingDistrict}
                      value={value}
                      placeholder="Chọn Quận / Huyện"
                      options={
                        districts?.length > 0
                          ? districts?.map((val: any) => ({
                            value: val?.district_id,
                            label: val?.default_name,
                          }))
                          : []
                      }
                      onChange={(id) => {
                        if (id === value) return

                        const selectedDistrict = districts?.find(
                          (district: any) => district.district_id === id
                        )
                        if (!selectedDistrict) return

                        const newValue = {
                          label: selectedDistrict.default_name,
                          value: selectedDistrict.district_id,
                        }
                        onChange(newValue)
                        setValue('ward', '')
                      }}
                    />
                  )}
                />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group mb-16">
                <Controller
                  name="ward"
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <FormSelectAntd
                      name="ward"
                      required
                      error={error}
                      nameLabel="Phường / Xã"
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input: any, option: any) =>
                        (option?.label ?? '').includes(input)
                      }
                      filterSort={(optionA: any, optionB: any) =>
                        (optionA?.label ?? '')
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? '').toLowerCase())
                      }
                      style={{ width: '100%', height: '45px' }}
                      loading={isFetchingWard}
                      value={value}
                      placeholder="Chọn Phường / Xã"
                      options={
                        wards?.length > 0
                          ? wards?.map((val: any) => ({
                            value: val?.ward_id,
                            label: val?.default_name,
                          }))
                          : []
                      }
                      onChange={(id: any) => {
                        if (id === value) return
                        const selectedWard = wards?.find((ward: any) => ward.ward_id === id)
                        if (!selectedWard) return

                        const newValue = {
                          label: selectedWard.default_name,
                          value: selectedWard.ward_id,
                        }
                        onChange(newValue)
                      }}
                    />
                  )}
                />
              </div>
            </div>
            <div className="col-lg-12">
              <div className="form-group mb-16">
                <TextField
                  name="street"
                  type="text"
                  className="form-control"
                  placeholder="Nhập số nhà và tên đường..."
                  nameLabel="Địa chỉ"
                  control={control}
                  required
                />
              </div>
            </div>

            <div className="col-lg-12">
              <div className="form-check">
                <input
                  {...register('isDefault')}
                  className="form-check-input"
                  name="isDefault"
                  type="checkbox"
                  id="isDefault"
                />
                <label className="form-check-label" htmlFor="isDefault">
                  Đặt làm địa chỉ mặc định
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default ModalCreateAddress

const EMPTY_FIELD = 'Trường này không được bỏ trống'

const schemaValidate: Yup.ObjectSchema<any> = Yup.object().shape({
  firstName: Yup.string().required(EMPTY_FIELD),
  lastName: Yup.string().required(EMPTY_FIELD),
  city: Yup.object().required(EMPTY_FIELD),
  district: Yup.object().required(EMPTY_FIELD),
  ward: Yup.object().required(EMPTY_FIELD),
  street: Yup.string().required(EMPTY_FIELD),
  // email: Yup.string()
  //   .matches(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/, 'Email không đúng định dạng')
  //   .required(EMPTY_FIELD),
  phoneNumber: Yup.string()
    .matches(/^0\d{9}$/, 'Số điện thoại không đúng định dạng')
    .required(EMPTY_FIELD),
  isDefault: Yup.boolean(),
})
