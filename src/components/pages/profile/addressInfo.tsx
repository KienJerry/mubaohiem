import { useForm, Controller } from 'react-hook-form'
import { TextField } from '@/components/inputs/textField'
import { FormSelectAntd } from '@/components/select/formSelectAntd'
import React, { useEffect } from 'react'
import addressApi from '@/services/address.queries'
import { useQuery } from 'react-query'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from 'react-query'
import authenApi from '@/services/authenticate.queries'
import * as Yup from 'yup'
import { ButtonSubmit } from '@/components/button/btnSubmit'
import { toast } from 'react-toastify'
// import Collapse from '../product/ListProduct/Collapse'
import { queryClient } from '@/pages/_app'
import LoadingData from '@/components/boxLayout/LoadingData'

export type FormAddressProp = {
  loading?: boolean
  dataDefault?: any
  data?: any
  idx?: any
  closeModal?: any
  type?: string
}


const AddressInfo = ({ data, idx, dataDefault, closeModal, type }: FormAddressProp) => {
  const { control, handleSubmit, setValue, getValues, watch, reset, register } = useForm<any>({
    mode: 'all',
    defaultValues: {
      phone_number: '',
      city: '',
      district: '',
      ward: '',
      street: '',
    },
    resolver: yupResolver(schemaValidate),
  })

  const { isLoading, mutate } = useMutation({
    mutationFn: async (dataSubmit: any) => {
      const parentIdCity = dataCity?.find((item: any) => item.city_id == dataSubmit?.city);
      const parentIdDistrict = dataDistrict?.find((item: any) => item.district_id == dataSubmit?.district);
      const parentIdWard = dataWard?.find((item: any) => item.ward_id == dataSubmit?.ward);
      return await authenApi.UpdateAddressCustomer({
        id: dataDefault?.id,
        input: {
          firstname: dataSubmit?.firstname,
          lastname: dataSubmit?.lastname,
          telephone: dataSubmit?.telephone,
          country_code: "VN",
          city_id: dataSubmit?.city,
          city: parentIdCity?.default_name,
          district_id: dataSubmit?.district,
          district: parentIdDistrict?.default_name,
          ward_id: dataSubmit?.ward,
          ward: parentIdWard?.default_name,
          street: [
            dataSubmit?.street
          ],
          default_billing: dataSubmit?.isDefault ? true : false,
          default_shipping: dataSubmit?.isDefault ? true : false,
        }
      })
    },
    onSuccess: async (response: any) => {
      if (!!response?.updateCustomerAddress) {
        await queryClient.refetchQueries(['getCustomer'])
        closeModal()
        toast.success('Lưu thành công')
      }
    },
    onError: () => { },
  })

  const { isLoading: LoadingDelete, mutate: MutateDeleteMethod } = useMutation({
    mutationFn: async (dataSubmit: any) => {
      return await authenApi.DeleteAddressCustomer(dataSubmit)
    },
    onSuccess: async (response: any) => {
      if (!!response?.deleteCustomerAddress) {
        await queryClient.refetchQueries(['getCustomer'])
        toast.success('Xóa thành công')
      }
    },
    onError: () => { },
  })

  const { isLoading: LoadingCreateAddress, mutate: mutateCreateAddress } = useMutation({
    mutationFn: async (dataSubmit: any) => {
      const parentIdCity = dataCity?.find((item: any) => item.city_id == dataSubmit?.city);
      const parentIdDistrict = dataDistrict?.find((item: any) => item.district_id == dataSubmit?.district);
      const parentIdWard = dataWard?.find((item: any) => item.ward_id == dataSubmit?.ward);
      return await authenApi.CreateAddressCustomer({
        input: {
          firstname: dataSubmit?.firstname,
          lastname: dataSubmit?.lastname,
          telephone: dataSubmit?.phone_number,
          country_code: 'VN',
          city_id: dataSubmit?.city,
          district_id: dataSubmit?.district,
          ward_id: dataSubmit?.ward,
          city: parentIdCity?.default_name,
          district: parentIdDistrict?.default_name,
          ward: parentIdWard?.default_name,
          street: [dataSubmit?.street],
          default_billing: dataSubmit?.isDefault ? true : false,
          default_shipping: dataSubmit?.isDefault ? true : false,
        },
      })
    },
    onSuccess: async (response: any) => {
      if (!!response?.createCustomerAddress) {
        await queryClient.refetchQueries(['getCustomer'])
        closeModal()
        toast.success('Thêm thành công')
        reset()
      }
    },
    onError: () => { },
  })

  const { data: dataCity, isFetching: isFetchingCity } = useQuery({
    queryKey: ['getCity'],
    queryFn: async () => {
      return await addressApi.getCity({ country_id: 'VN' }).then((response: any) => {
        return response?.citys?.listcitys || [];
      })
    },
  })

  const { data: dataDistrict, isFetching: isFetchingDistrict } = useQuery({
    queryKey: ['getDistrict', watch('city')],
    queryFn: async () => {
      return await addressApi.getDistricts({
        city_id: watch('city')
      }).then((response: any) => {
        return response?.districts?.listdistricts || [];
      })
    },
    enabled: !!watch('city')
  })

  const { data: dataWard, isFetching: isFetchingWard } = useQuery({
    queryKey: ['getWard', watch('district')],
    queryFn: async () => {
      return await addressApi.getWards({
        district_id: watch('district')
      }).then((response: any) => {
        return response?.wards?.listwards || [];
      })
    },
    enabled: !!watch('district')
  })

  useEffect(() => {
    if (!!dataDefault && type == 'update') {
      setValue('phone_number', dataDefault?.telephone)
      setValue('city', parseInt(dataDefault?.custom_attributes?.[0]?.value))
      setValue('district', parseInt(dataDefault?.custom_attributes?.[2]?.value))
      setValue('ward', parseInt(dataDefault?.custom_attributes?.[4]?.value))
      setValue('street', dataDefault?.street[0])
      setValue('lastname', dataDefault?.lastname)
      setValue('firstname', dataDefault?.firstname)
      setValue('isDefault', dataDefault?.default_shipping)
    }else if(type == 'create'){
      reset()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataDefault])

  const onSubmitHandler = handleSubmit((value) => {
    if (type == 'update') {
      mutate(value)
    } else {
      mutateCreateAddress(value)
    }
  })

  const handleRemoveAddress = (id: number) => {
    MutateDeleteMethod({ id })
  }

  return (
    <>
      {
        // idx &&
        // <Collapse title={`Địa chỉ ${idx || 'mới'}`} keyID={`${idx || 1}`}>
        <div>
          <div style={{ position: 'relative' }}>
            {LoadingDelete && <div className='spinner-loading-custom'>
              <LoadingData />
            </div>}
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
                <div className="col-lg-12">
                  <TextField
                    name="phone_number"
                    type="text"
                    placeholder="Nhập số điện thoại của bạn"
                    nameLabel="Số điện thoại"
                    control={control}
                    required
                  />
                </div>
                <div className="col-lg-4">
                  <Controller
                    name="city"
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { onChange, value }, fieldState: { error } }) => (
                      <FormSelectAntd
                        name="city"
                        required
                        error={error}
                        nameLabel="Thành phố / Tỉnh"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input: any, option: any) => (option?.label ?? '').includes(input)}
                        filterSort={(optionA: any, optionB: any) =>
                          (optionA?.label ?? '')
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        style={{ width: '100%', height: '45px' }}
                        loading={isFetchingCity}
                        value={value || null}
                        placeholder="Chọn Tỉnh / Thành phố"
                        options={
                          dataCity?.length > 0
                            ? dataCity?.map((val: any) => ({
                              value: val?.city_id,
                              label: val?.default_name,
                            }))
                            : []
                        }
                        onChange={(id: any) => {
                          if (id !== value) {
                            onChange(id)
                            if (getValues('district')) {
                              setValue('district', null as any)
                            }
                            if (getValues('ward')) {
                              setValue('ward', null as any)
                            }
                          }
                        }}
                      />
                    )}
                  />
                </div>
                <div className="col-lg-4">
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
                        filterOption={(input: any, option: any) => (option?.label ?? '').includes(input)}
                        filterSort={(optionA: any, optionB: any) =>
                          (optionA?.label ?? '')
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        style={{ width: '100%', height: '45px' }}
                        loading={isFetchingDistrict}
                        value={value || null}
                        placeholder="Chọn Quận / Huyện"
                        options={dataDistrict?.length > 0 ? dataDistrict?.map((val: any) => ({
                          value: val?.district_id,
                          label: val?.default_name,
                        }))
                          : []}
                        onChange={(id: any) => {
                          if (id !== value) {
                            onChange(id)
                            if (getValues('ward')) {
                              setValue('ward', null as any)
                            }
                          }
                        }}
                      />
                    )}
                  />
                </div>
                <div className="col-lg-4">
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
                        filterOption={(input: any, option: any) => (option?.label ?? '').includes(input)}
                        filterSort={(optionA: any, optionB: any) =>
                          (optionA?.label ?? '')
                            .toLowerCase()
                            .localeCompare((optionB?.label ?? '').toLowerCase())
                        }
                        style={{ width: '100%', height: '45px' }}
                        loading={isFetchingWard}
                        value={value || null}
                        placeholder="Chọn Phường / Xã"
                        options={dataWard?.length > 0 ? dataWard?.map((val: any) => ({
                          value: val?.ward_id,
                          label: val?.default_name,
                        }))
                          : []}
                        onChange={(id: any) => {
                          if (id !== value) {
                            onChange(id)
                          }
                        }}
                      />
                    )}
                  />
                </div>
                <div className="col-lg-12">
                  <TextField
                    name="street"
                    type="text"
                    placeholder="Nhập số nhà và tên đường..."
                    nameLabel="Địa chỉ"
                    control={control}
                    required
                  />
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
                <div className='btn-gr'>
                  <div className={`btn-save-addr ${!idx && 'btn-right-modal'}`}>
                    <ButtonSubmit
                      type="submit"
                      className="butn bg-green2 text-white radius-4 fw-500 fsz-14 text-uppercase text-center "
                      style={{
                        border: 'none',
                        // width: '-webkit-fill-available',
                      }}
                      mr0
                      title={type == 'update' ? "Lưu địa chỉ" : "Thêm địa chỉ"}
                      loading={isLoading || LoadingCreateAddress}
                    />
                  </div>
                  {idx &&
                    <div className='btn-delete-prod'>
                      <div className='butn bg-333 text-white radius-4 fw-500 fsz-14 text-uppercase text-center'>
                        <span onClick={() =>
                          handleRemoveAddress(data?.id)
                        }>Xóa địa chỉ</span>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </form>
          </div>
          </div>
        // </Collapse>
      }
    </>

  )
}

export default AddressInfo

const schemaValidate: Yup.ObjectSchema<any> = Yup.object().shape({
  city: Yup.string().required('Trường này không được bỏ trống'),
  district: Yup.string().required('Trường này không được bỏ trống'),
  ward: Yup.string().required('Trường này không được bỏ trống'),
  street: Yup.string().required('Trường này không được bỏ trống'),
  phone_number: Yup.string()
  .required('Trường này không được bỏ trống')
  .matches(/^0\d{9}$/, 'Số điện thoại không đúng định dạng'),
  lastname: Yup.string().required('Trường này không được bỏ trống'),
  firstname: Yup.string().required('Trường này không được bỏ trống'),
});