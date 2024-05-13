import React, { useState, useEffect } from 'react'
import AddressInfo from './addressInfo'
import ModalAntUI from '@/components/modal/modalAnt'
import classNames from 'classnames'
import { useMutation } from 'react-query'
import authenApi from '@/services/authenticate.queries'
import { queryClient } from '@/pages/_app'
import { toast } from 'react-toastify'
import LoadingData from '@/components/boxLayout/LoadingData'

const FormAddress = ({ dataUserInfo }: any) => {
  const [openModal, setOpenModal] = useState({ open: false, type: 'create' })
  const [addressSelected, setAddressSelected] = useState<Address | null>(null)
  const [addressUpdate, setAddressUpdate] = useState<Address | null>(null)

  const closeModal = () => {
    setOpenModal((prev) => ({
      ...prev,
      open: false,
    }))
  }
  const handleGetCustomAttribute = (customAttributes: any, attributeCode: string): string => {
    return (
      customAttributes?.filter((item: any) => item?.attribute_code === attributeCode)?.[0]?.value ??
      ''
    )
  }

  const { mutate } = useMutation({
    mutationFn: async (dataSubmit: any) => {
      return await authenApi.UpdateAddressCustomer({
        id: dataSubmit?.id,
        input: {
          firstname: dataSubmit?.firstname,
          lastname: dataSubmit?.lastname,
          telephone: dataSubmit?.telephone,
          country_code: 'VN',
          city_id: dataSubmit?.custom_attributes?.find(
            (item: any) => item.attribute_code == 'city_id'
          )?.value,
          city: dataSubmit?.city,
          district_id: dataSubmit?.custom_attributes?.find(
            (item: any) => item.attribute_code == 'district_id'
          )?.value,
          district: dataSubmit?.custom_attributes?.find(
            (item: any) => item.attribute_code == 'district'
          )?.value,
          ward_id: dataSubmit?.custom_attributes?.find(
            (item: any) => item.attribute_code == 'ward_id'
          )?.value,
          ward: dataSubmit?.custom_attributes?.find((item: any) => item.attribute_code == 'ward')
            ?.value,
          street: dataSubmit?.street,
          default_billing: true,
          default_shipping: true,
        },
      })
    },
    onSuccess: async () => {},
    onError: () => {},
  })

  const handleChangeAddressSelected = (data: any) => {
    mutate(data)
  }

  const handleEditAddress = (data: any, type: string) => {
    setOpenModal((prev) => ({
      ...prev,
      open: true,
      type: type,
    }))
    setAddressUpdate(data)
  }

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
    onError: () => {},
  })

  const handleRemoveAddress = (id: string) => {
    MutateDeleteMethod({ id })
  }

  useEffect(() => {
    if (dataUserInfo?.addresses?.length !== 0) {
      const addressDefault =
        dataUserInfo?.addresses?.filter(
          (address: any) => address?.default_shipping === true
        )?.[0] ?? null
      setAddressSelected(addressDefault)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataUserInfo])

  return (
    <div className="account-tab mt-cus">
      <div className="header-title ">
        <h4 className="fw-bold text-capitalize mb-0">Địa chỉ</h4>
      </div>
      <div className="box-address mb-2 profile">
        {dataUserInfo?.addresses?.map((val: any, idx: number) => {
          const districtLabel = handleGetCustomAttribute(val?.custom_attributes, 'district')
          const wardLabel = handleGetCustomAttribute(val?.custom_attributes, 'ward')
          return (
            <React.Fragment key={idx}>
              {LoadingDelete ? (
                <div className="wrapper-loading-layout">
                  <LoadingData />
                </div>
              ) : null}
              <div
                className={classNames('address', {
                  active: val?.id === addressSelected?.id,
                })}
                onClick={() => {
                  if (val?.id !== addressSelected?.id) {
                    setAddressSelected(val)
                    handleChangeAddressSelected(val)
                  }
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
                {val?.id === addressSelected?.id ? (
                  <p className="addr-default"> Địa chỉ mặc định!</p>
                ) : null}
                <div className="addr-mobile">
                  <p className="if-name fw-6">{`${val?.lastname} ${val?.firstname}`}</p>
                  <p className="if-tel">
                    {' '}
                    <span className="text">Số điện thoại: &#160;</span>
                    {val?.telephone}
                  </p>
                </div>
                <p className="if-addr">
                  {' '}
                  <span className="text">Địa chỉ: &#160;</span>
                  {`${val?.street?.[0]}, ${wardLabel}, ${districtLabel}, ${val?.city}`}
                </p>
                <div className="bg-btn-profile">
                  <div className="box-btn yellow">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleEditAddress(val, 'update')
                      }}>
                      Sửa
                    </button>
                  </div>
                  <div className="box-btn remove">
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleRemoveAddress(val?.id)
                      }}>
                      xóa
                    </button>
                  </div>
                </div>
              </div>
            </React.Fragment>
          )
        })}
      </div>
      <div className="box-btn-add profile">
        <button
          type="button"
          onClick={() =>
            setOpenModal((prev) => ({
              ...prev,
              open: true,
              type: 'create',
            }))
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
      <ModalAntUI
        title={openModal?.type == 'create' ? 'Thêm địa chỉ' : 'Cập nhật địa chỉ'}
        openModal={openModal?.open}
        setOpenModal={closeModal}>
        <AddressInfo
          dataDefault={openModal?.type == 'create' ? dataUserInfo : addressUpdate}
          closeModal={closeModal}
          type={openModal?.type}
        />
      </ModalAntUI>
    </div>
  )
}

export default FormAddress
