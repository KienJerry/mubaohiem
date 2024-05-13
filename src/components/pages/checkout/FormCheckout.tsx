import { FC, useEffect, useRef, useState } from 'react'

import classNames from 'classnames'
import useCart from '@/hooks/useCart'
import { FormatNumber } from '@/helper'
import { useAppDispatch } from '@/store'

import { Controller } from 'react-hook-form'
import { GETTOKEN } from '@/services/graphql'
import checkoutApi from '@/services/checkout'
import { EMPTY_ITEM } from '../product/constants'

import { useMutation, useQuery } from 'react-query'
import addressApi from '@/services/address.queries'
import authenApi from '@/services/authenticate.queries'
import { updateLoading } from '@/store/loadingHookSlice'

import { TextField } from '@/components/inputs/textField'
import { FormSelectAntd } from '@/components/select/formSelectAntd'
import ModalCreateAddress, { MODAL_ADDRESS_MODE } from './ModalCreateAddress'

import {
  VariableSetShippingAddress,
  VariableSetShippingMethods,
} from '@/services/checkout/checkout.type'
import {
  Control,
  UseFormWatch,
  UseFormRegister,
  UseFormSetValue,
  UseFormReset,
  UseFormGetValues,
} from 'react-hook-form'

type FormCheckout = {
  onSubmit: (data: any) => void,
  useForm: {
    control: Control,
    watch: UseFormWatch<any>,
    reset: UseFormReset<any>,
    register: UseFormRegister<any>,
    setValue: UseFormSetValue<any>,
    getValues: UseFormGetValues<any>,
  },
}

type CustomAttribute = {
  attribute_code: string,
  value: string,
}

const FormCheckout: FC<FormCheckout> = ({ useForm, onSubmit }) => {
  const { control, register, setValue, watch, reset } = useForm

  const dispatch = useAppDispatch()

  const [modalConfig, setModalConfig] = useState({
    mode: MODAL_ADDRESS_MODE.CREATE,
    isOpen: false,
    defaultValues: {},
  })
  const [addressSelected, setAddressSelected] = useState<Address | null>(null)
  const [shippingSelected, setShippingSelected] = useState<AvailableShippingMethod | undefined>(
    undefined
  )

  const { cartData, onRefreshCart } = useCart()

  const debounce = useRef<any>()

  const { data: customerData } = useQuery<ResCustomer>({
    queryKey: ['getCustomer'],
    queryFn: async () => {
      return await authenApi.getInfoCustomer().then((response: any) => {
        return response || null
      })
    },
    staleTime: 30000,
    enabled: !!GETTOKEN.tokenAuth(),
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

  const { mutate: mutateSetShippingMethods } = useMutation({
    mutationFn: async (variable: VariableSetShippingMethods) => {
      return await checkoutApi.setShippingMethods(variable)
    },
    onSuccess: () => {
      onRefreshCart()
    },
  })

  const { data: shippingMethods, mutate: mutateGetShippingAddress } = useMutation({
    mutationFn: async (variable: VariableSetShippingAddress) => {
      return await checkoutApi.getShippingMethods(variable)
    },
    onSuccess: (data: any) => {
      const availableShippingMethods =
        data?.setShippingAddressesOnCart?.cart?.shipping_addresses?.[0]
          ?.available_shipping_methods ?? []

      if (availableShippingMethods?.length !== 0) {
        setShippingSelected(availableShippingMethods?.[0])

        dispatch(
          updateLoading({
            isLoadingHandleShipping: true,
          })
        )

        mutateSetShippingMethods({
          setShippingMethodsOnCartInput: {
            cart_id: cartData?.id ?? '',
            shipping_methods: [
              {
                carrier_code: availableShippingMethods?.[0]?.carrier_code,
                method_code: availableShippingMethods?.[0]?.method_code,
              },
            ],
          },
        })
      }
      return data
    },
  })

  const lastName = watch('lastName')
  const firstName = watch('firstName')
  const street = watch('street')
  const phoneNumber = watch('phoneNumber')
  const city = watch('city')
  const district = watch('district')
  const ward = watch('ward')

  useEffect(() => {
    if (!lastName || !firstName || !street || !phoneNumber || !city || !district || !ward) return

    if (customerData && customerData?.addresses?.length !== 0) return

    if (debounce.current !== null) clearTimeout(debounce.current)

    debounce.current = setTimeout(() => {
      dispatch(
        updateLoading({
          isLoadingHandleShipping: true,
        })
      )

      mutateGetShippingAddress({
        setShippingAddressesOnCartInput: {
          cart_id: cartData?.id ?? '',
          shipping_addresses: [
            {
              customer_notes: watch('note'),
              address: {
                country_code: 'VN',
                company: ' ',
                lastname: lastName,
                firstname: firstName,
                postcode: '7000',
                street: [street],
                telephone: phoneNumber,
                save_in_address_book: true,
                city: city?.label,
                custom_attributes: [
                  {
                    attribute_code: 'ward',
                    value: ward?.label,
                  },
                  {
                    attribute_code: 'ward_id',
                    value: ward?.value,
                  },
                  {
                    attribute_code: 'district',
                    value: district?.label,
                  },
                  {
                    attribute_code: 'district_id',
                    value: district?.value,
                  },
                  {
                    attribute_code: 'city_id',
                    value: city?.value,
                  },
                ],
              },
            },
          ],
        },
        setBillingAddressOnCartInput: {
          cart_id: cartData?.id ?? '',
          billing_address: {
            same_as_shipping: true,
          },
        },
      })
    }, 1200)

    return () => {
      clearTimeout(debounce.current)
      debounce.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastName, firstName, street, phoneNumber, city, district, ward])

  useEffect(() => {
    if (cartData?.shipping_addresses?.length === 0) return
    if (customerData && customerData?.addresses?.length !== 0) return

    const address: any = cartData?.shipping_addresses?.[0] ?? {}

    const formValues = {
      lastName: address.lastname,
      firstName: address.firstname,
      email: customerData?.email,
      phoneNumber: address?.telephone,
      city: {
        value: address?.city_id,
        label: address?.city,
      },
      district: {
        value: address?.district_id,
        label: address?.district,
      },
      ward: {
        value: address?.ward_id,
        label: address?.ward,
      },
      street: address?.street?.[0] ?? '',
    }
    reset(formValues)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleGetCustomAttribute = (
    customAttributes: CustomAttribute[] | undefined,
    attributeCode: string
  ): string => {
    return (
      customAttributes?.filter((item) => item?.attribute_code === attributeCode)?.[0]?.value ?? ''
    )
  }

  const handleGetListAttribute = (
    customAttributes: CustomAttribute[] | undefined,
    listCode: string[]
  ) => {
    return listCode?.map((item) => {
      return handleGetCustomAttribute(customAttributes, item)
    })
  }

  const handleFormatValuesForm = (address: Address) => {
    const [cityId, districtId, districtLabel, wardId, wardLabel] = handleGetListAttribute(
      address?.custom_attributes,
      ['city_id', 'district_id', 'district', 'ward_id', 'ward']
    )

    const formValues = {
      lastName: address.lastname,
      firstName: address.firstname,
      email: customerData?.email,
      phoneNumber: address?.telephone,
      city: {
        value: cityId,
        label: address?.city,
      },
      district: {
        value: districtId,
        label: districtLabel,
      },
      ward: {
        value: wardId,
        label: wardLabel,
      },
      street: address?.street?.[0] ?? '',
    }

    return formValues
  }

  const handleChangeAddressSelected = (address: Address) => {
    dispatch(
      updateLoading({
        isLoadingHandleShipping: true,
      })
    )

    mutateGetShippingAddress({
      setShippingAddressesOnCartInput: {
        cart_id: cartData?.id ?? '',
        shipping_addresses: [
          {
            customer_notes: watch('note'),
            customer_address_id: address?.id,
          },
        ],
      },
      setBillingAddressOnCartInput: {
        cart_id: cartData?.id ?? '',
        billing_address: {
          same_as_shipping: true,
        },
      },
    })

    const formValues = handleFormatValuesForm(address)
    reset(formValues)
  }

  const handleEditAddress = (address: Address) => {
    const formValues = handleFormatValuesForm(address)

    setModalConfig({
      isOpen: true,
      mode: MODAL_ADDRESS_MODE.EDIT,
      defaultValues: { ...formValues, id: address?.id },
    })
  }

  useEffect(() => {
    if ((customerData !== undefined || !!customerData) && addressSelected !== null) return

    let addressDefault = null
    if (customerData?.addresses?.length !== EMPTY_ITEM) {
      addressDefault =
        customerData?.addresses?.filter((address) => address?.default_shipping === true)?.[0] ??
        null
      setAddressSelected(addressDefault)
    }

    if (addressDefault === null) return

    handleChangeAddressSelected(addressDefault)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerData])

  const renderAddress = () => {
    const isShowInputAddress = addressSelected === null

    if (!isShowInputAddress) {
      return (
        <>
          <div className="box-address mb-2">
            {customerData?.addresses?.map((address) => {
              const districtLabel = handleGetCustomAttribute(address?.custom_attributes, 'district')
              const wardLabel = handleGetCustomAttribute(address?.custom_attributes, 'ward')

              return (
                <div
                  className={classNames('address', {
                    active: address?.id === addressSelected?.id,
                  })}
                  key={address?.id}
                  onClick={() => {
                    setAddressSelected(address)
                    handleChangeAddressSelected(address)
                  }}>
                  <div className="icon-active">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-check">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  </div>
                  {address?.default_shipping ? (
                    <p className='addr-default'> Địa chỉ mặc định!
                    </p>
                  ) : null}
                  <div className='addr-mobile'>
                    <p className='if-name fw-6'>{`${address?.lastname} ${address?.firstname}`}</p>
                    <p className='if-tel'> <span className="text">Số điện thoại: &#160;</span>{address?.telephone}</p>
                  </div>
                  <p className='if-addr'> <span className="text">Địa chỉ: &#160;</span>
                    {`${address?.street?.[0]}, ${wardLabel}, ${districtLabel}, ${address?.city}`}
                  </p>
                  <div className="box-btn">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleEditAddress(address)
                      }}>
                      Sửa
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="box-btn-add">
            <button
              type="button"
              onClick={() =>
                setModalConfig({
                  mode: MODAL_ADDRESS_MODE.CREATE,
                  isOpen: true,
                  defaultValues: {},
                })
              }>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-plus">
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              <span>Thêm địa chỉ</span>
            </button>
          </div>
        </>
      )
    }

    return (
      <>
        <div
          className={classNames('col-lg-12', {
            'd-none': !isShowInputAddress,
          })}>
          <div className="form-group mb-4">
            <Controller
              name="city"
              control={control}
              rules={{ required: true }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <FormSelectAntd
                  name="city"
                  required
                  error={error}
                  nameLabel="Tỉnh/ Thành phố"
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
        <div
          className={classNames('col-lg-12', {
            'd-none': !isShowInputAddress,
          })}>
          <div className="form-group mb-4">
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
        <div
          className={classNames('col-lg-12', {
            'd-none': !isShowInputAddress,
          })}>
          <div className="form-group mb-4">
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
        <div
          className={classNames('col-lg-12', {
            'd-none': !isShowInputAddress,
          })}>
          <div className="form-group mb-4">
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
      </>
    )
  }

  const renderShippingMethod = () => {
    if (shippingMethods === undefined) return null

    const shippingAddress =
      (shippingMethods as ShippingMethods)?.setShippingAddressesOnCart?.cart?.shipping_addresses?.[0]
    return (
      <div className="box-shipping-method mb-title">
        <h6 className="fsz-16 fw-bold mb-0"> Phương thức vận chuyển </h6>
        {shippingAddress?.available_shipping_methods?.map((shippingMethods, index) => {
          return (
            <div className="form-check" key={shippingMethods?.carrier_code}>
              <input
                className="form-check-input"
                type="checkbox"
                value={shippingMethods?.carrier_code}
                id={shippingMethods?.carrier_code}
                required
                checked={shippingSelected?.method_code === shippingMethods?.method_code}
                name="shipping"
                defaultChecked={index === 0}
                onChange={() => {
                  setShippingSelected(shippingMethods)

                  dispatch(
                    updateLoading({
                      isLoadingHandleShipping: true,
                    })
                  )

                  mutateSetShippingMethods({
                    setShippingMethodsOnCartInput: {
                      cart_id: cartData?.id ?? '',
                      shipping_methods: [
                        {
                          carrier_code: shippingMethods?.carrier_code,
                          method_code: shippingMethods?.method_code,
                        },
                      ],
                    },
                  })
                }}
              />
              <label className="form-check-label" htmlFor={shippingMethods?.carrier_code}>
                <h6 className="mb-10 fsz-14">
                  {' '}
                  <span className="fw-bold">{shippingMethods?.method_title}</span> (
                  {`${FormatNumber(shippingMethods?.amount?.value ?? 0, '.')} ${shippingMethods?.amount?.currency
                    }`}
                  ){' '}
                </h6>
              </label>
            </div>
          )
        })}
      </div>
    )
  }

  const renderModalCreateAddress = () => {
    if (!modalConfig?.isOpen) return null

    return (
      <ModalCreateAddress
        mode={modalConfig?.mode}
        isModalOpen={modalConfig?.isOpen}
        defaultValues={modalConfig?.defaultValues}
        onCancel={() => {
          setModalConfig({ isOpen: false, mode: MODAL_ADDRESS_MODE.CREATE, defaultValues: {} })
        }}
      />
    )
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="form-content">
        <div className="row gx-3">
          <div className="col-lg-12">
            <h6 className="fsz-16 fw-bold mb-title"> Thông tin hoá đơn </h6>
          </div>
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
          <div className="col-lg-12">
            <div className="form-group mb-16">
              <TextField
                name="email"
                type="email"
                className="form-control"
                placeholder="Nhập email của bạn"
                nameLabel="Email"
                control={control}
                required
                disabled={!!customerData && addressSelected !== null}
              />
            </div>
          </div>
          {renderAddress()}

          <div className={classNames('col-lg-12 mb-20', { 'd-none': customerData !== undefined })}>
            <div className="form-check">
              <input
                {...register('account')}
                className="form-check-input"
                name="account"
                type="checkbox"
                id="account"
              />
              <label className="form-check-label" htmlFor="account">
                Tạo tài khoản mới với thông tin trên
              </label>
            </div>
          </div>

          <div className="col-lg-12">{renderShippingMethod()}</div>

          <div className="col-lg-12">
            <h6 className="fsz-16 mb-2"> Thêm thông tin ghi chú </h6>
          </div>
          <div className="col-lg-12">
            <div className="form-group">
              {/* <label htmlFor="note">Ghi chú</label> */}
              <textarea
                id="note"
                {...register('note')}
                rows={5}
                className="form-control"
                placeholder="Ghi chú thêm (Ví dụ: Giao hàng giờ hành chính)"></textarea>
            </div>
          </div>
        </div>
      </div>

      {renderModalCreateAddress()}
    </form>
  )
}

export default FormCheckout
