/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'

import 'swiper/css'
import 'swiper/css/pagination'

import * as Yup from 'yup'
import Link from 'next/link'
import { Skeleton } from 'antd'
import Cookies from 'js-cookie'

import { RootState } from '@/store'
import useCart from '@/hooks/useCart'
import Promotions from './Promotions'
import { toast } from 'react-toastify'

import { useRouter } from 'next/router'
import { FormatNumber } from '@/helper'
import { useSelector } from 'react-redux'
import FormCheckout from './FormCheckout'

import { useForm } from 'react-hook-form'
import { useMutation } from 'react-query'
import { GETTOKEN } from '@/services/graphql'
import checkoutApi from '@/services/checkout'

import { Spinner } from '@/components/spinner'
import usePromotion from '@/hooks/usePromotion'
import Breadcrumb from '@/components/Breadcrumb'
import { CONFIGURABLE_PRODUCT, EMPTY_ITEM } from '../product/constants'

import { yupResolver } from '@hookform/resolvers/yup'
import EmptyData from '@/components/boxLayout/EmptyData'
import LoadingData from '@/components/boxLayout/LoadingData'
import { graphQLClient, COOKIE_KEY } from '@/services/graphql'
import { VariableSetPaymentMethodAndPlaceOrder } from '@/services/checkout/checkout.type'

const CheckoutPage = () => {
  const [voucher, setVoucher] = useState<string>('')

  const router = useRouter()

  const {
    cartData,
    typeCart,
    isLoadingGetCart,
    isLoadingSetGuestEmail,
    onUpdateCartId,
    onCreateCartCheckout,
    onSetGuestEmailOnCart,
  } = useCart()
  const currency = cartData?.prices?.grand_total?.currency ?? ''
  const appliedCoupons = cartData?.applied_coupons
  const isHaveAppliedCoupons = appliedCoupons !== null

  const { onApplyVoucher, onRemoveVoucher } = usePromotion()

  const {
    isLoadingGetCart: isLoadingHookGetCart,
    isLoadingHandleVoucher,
    isLoadingHandleShipping,
  } = useSelector((state: RootState) => state?.loading)

  const { control, register, handleSubmit, setValue, getValues, watch, reset } = useForm<any>({
    mode: 'all',
    resolver: yupResolver(schemaValidate),
  })

  const formConfig = { control, register, setValue, getValues, watch, reset }

  const handleSetCustomerToken = (customer: PlaceOrderCustomer) => {
    if (customer === null) return

    if (!!customer?.error_message) {
      toast.error(customer?.error_message)
      return
    }

    const token = customer?.customer_token
    Cookies.set(COOKIE_KEY?.ACCESS_TOKEN, token)

    graphQLClient.setHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      accept: 'application/json',
    })

    onCreateCartCheckout()
  }

  const encodeToBase64 = (str: string): string => {
    return Buffer.from(str).toString('base64')
  }

  const handleRedirectAfterCheckout = (order: OrderCheckout) => {
    if (order?.paymentOnline?.url_pay) {
      return router.push(order?.paymentOnline?.url_pay)
    }

    const result = {
      status: 'success',
      email: watch('email') ?? '',
      orderCode: order?.order_number ?? '',
    }

    const resultString = encodeToBase64(JSON.stringify(result))

    return router.push({
      pathname: '/order-success',
      query: {
        result: resultString,
      },
    })
  }

  const { mutate: mutateCheckout, isLoading: isLoadingCheckout } = useMutation({
    mutationFn: async (variable: VariableSetPaymentMethodAndPlaceOrder) => {
      return await checkoutApi.checkout(variable)
    },
    onSuccess: (data: any) => {
      const dataResponse: ResSetPaymentMethodAndPlaceOrder = data

      if (!dataResponse?.placeOrder?.order?.order_number) {
        toast.error('Lỗi hệ thống, vui lòng thử lại sau!')
        return data
      }

      handleSetCustomerToken(dataResponse?.placeOrder?.customer)

      if (dataResponse?.createEmptyCart && dataResponse?.placeOrder?.customer === null)
        onUpdateCartId({
          cartId: dataResponse?.createEmptyCart,
          type: typeCart,
        })

      toast.success('Đặt hàng thành công!')
      handleRedirectAfterCheckout(dataResponse?.placeOrder?.order)
      return data
    },
  })

  const { mutate: mutateCheckEmailHaveAccount, isLoading: isCheckEmail } = useMutation({
    mutationFn: async (variable: { email: string, callBackFn?: () => void }) => {
      return await checkoutApi.checkEmailHaveAccount(variable.email).then((res: any) => {
        if (!res?.isEmailAvailable?.is_email_available) {
          toast.error('Email đã được sử dụng! Vui lòng đăng nhập để tiếp tục đặt hàng.')
          return res
        }

        variable?.callBackFn?.()
        return res
      })
    },
  })

  const handleChangeVoucher = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoucher(e.target.value)
  }

  const handleCheckout = (inputCheckout: VariableSetPaymentMethodAndPlaceOrder, email: string) => {
    if (cartData?.email === null || cartData?.email !== email) {
      return onSetGuestEmailOnCart({
        input: {
          cart_id: cartData?.id ?? '',
          email: email,
        },
        callBackFn: () => {
          mutateCheckout(inputCheckout)
        },
      })
    }

    return mutateCheckout(inputCheckout)
  }

  const handlerOnSubmit = handleSubmit((formValues) => {
    const inputCheckout = {
      setPaymentMethodOnCartInput: {
        cart_id: cartData?.id ?? '',
        payment_method: {
          code: formValues?.payment,
        },
      },
      placeOrderInput: {
        cart_id: cartData?.id ?? '',
        create_customer: formValues?.account,
      },
    }

    if (formValues?.account) {
      return mutateCheckEmailHaveAccount({
        email: formValues?.email,
        callBackFn: () => {
          handleCheckout(inputCheckout, formValues?.email)
        },
      })
    }

    return handleCheckout(inputCheckout, formValues?.email)
  })

  const renderItemInCart = () => {
    return cartData?.items?.map((item) => {
      const rowTotal = item?.prices?.row_total
      return (
        <div className="prod-card" key={item?.uid}>
          <div className="img-side">
            <div className="img">
              <img
                src={
                  item?.product?.__typename === CONFIGURABLE_PRODUCT
                    ? item?.configured_variant?.image?.url
                    : item?.product?.image?.url
                }
                alt=""
              />
            </div>
            <div className="inf">
              <p className="fw-500 lh-3">{item?.product?.name}</p>
              <p className=" color-666"> Số lượng: {item?.quantity} </p>
              {item?.configurable_options?.map((option) => (
                <p className="color-666" key={option?.option_label}>
                  {' '}
                  {option?.option_label}: {option?.value_label}{' '}
                </p>
              ))}
            </div>
          </div>
          <div className="text-nowrap price-num">
            {FormatNumber(rowTotal?.value ?? 0, '.')} {rowTotal?.currency}
          </div>
        </div>
      )
    })
  }

  const renderDiscountPrice = () => {
    if (!isHaveAppliedCoupons && !isLoadingHandleVoucher) return null

    const discount = cartData?.prices?.discounts?.[0] ?? {}
    return (
      <div className="worldwide d-flex justify-content-between py-2">
        <span> Giảm giá </span>
        <Skeleton
          active
          style={{ width: '110px' }}
          className="MN-Skeleton-text"
          loading={isLoadingHandleVoucher}>
          <span>
            -{FormatNumber(discount?.amount?.value ?? 0, '.')} {discount?.amount?.currency}
          </span>
        </Skeleton>
      </div>
    )
  }

  const renderShippingPrice = () => {
    const selectedShippingMethod = cartData?.shipping_addresses?.[0]?.selected_shipping_method
    if (!selectedShippingMethod) return null

    return (
      <div className="worldwide d-flex justify-content-between py-2">
        <span> Phí giao hàng </span>

        <Skeleton
          active
          style={{ width: '110px' }}
          className="MN-Skeleton-text"
          loading={isLoadingHandleShipping}>
          <span className="">
            {`${FormatNumber(selectedShippingMethod?.amount?.value ?? 0, '.')} ${
              selectedShippingMethod?.amount?.currency
            }`}
          </span>
        </Skeleton>
      </div>
    )
  }

  const renderPaymentMethods = (paymentMethods: AvailablePaymentMethod[]) => {
    return paymentMethods?.map((method, index) => {
      return (
        <div className="form-check" key={method?.code}>
          <input
            className="form-check-input"
            type="radio"
            value={method?.code}
            id={method?.code}
            required
            {...register('payment')}
            defaultChecked={index === 0}
          />
          <label className="form-check-label" htmlFor={method?.code}>
            <h6 className="fw-bold mb-10 fsz-14 mb-0"> {method?.title} </h6>
          </label>
        </div>
      )
    })
  }

  const renderPromotionInput = () => {
    const isDisabled = (voucher === '' && !isHaveAppliedCoupons) || isLoadingHandleVoucher

    const handleClickBtn = () => {
      if (isHaveAppliedCoupons) {
        return onRemoveVoucher({ cartId: cartData?.id ?? '' })
      }
      return onApplyVoucher({
        cart_id: cartData?.id ?? '',
        coupon_code: voucher,
      })
    }

    return (
      <div className="box-coupon p-0 mb-16">
        <input
          type="text"
          name="coupon"
          placeholder="Nhập mã giảm giá"
          value={isHaveAppliedCoupons ? appliedCoupons?.[0]?.code : voucher}
          onChange={handleChangeVoucher}
          disabled={isHaveAppliedCoupons}
        />
        <button
          className="butn bg-green2 text-white radius-4 fw-500 fsz-12 none-border mb-0"
          onClick={handleClickBtn}
          disabled={isDisabled}>
          {isLoadingHandleVoucher ? (
            <Spinner className="w-[16px] h-[16px] mr-[8px]" />
          ) : isHaveAppliedCoupons ? (
            'Xoá mã'
          ) : (
            'Áp dụng'
          )}
        </button>
      </div>
    )
  }

  const renderLinkToPageLogin = () => {
    if (!!GETTOKEN.tokenAuth()) return null

    return (
      <div className="col-lg-12">
        <div className="alert bg-light2 mb-title" role="alert">
          <p className="mb-0">
            <span className="icon">
              <i className="la la-user me-2 fs-4"></i>
            </span>
            Bạn đã có tài khoản?{' '}
            <Link href="/login" className="color-red1 text-decoration-underline">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    )
  }

  const renderContentPage = () => {
    if (isLoadingGetCart) return <LoadingData />

    if (!cartData || cartData?.items?.length === EMPTY_ITEM)
      return (
        <div className="text-center">
          <EmptyData />
          <h5 className="mt-5 mb-5">Giỏ hàng của bạn không có sản phẩm để thanh toán!</h5>
        </div>
      )

    const isDisabledBtnCheckout =
      isLoadingCheckout ||
      isLoadingSetGuestEmail ||
      isLoadingGetCart ||
      isLoadingHandleVoucher ||
      isLoadingHookGetCart ||
      isLoadingHandleVoucher ||
      isLoadingHandleShipping ||
      isCheckEmail

    return (
      <div className="checkout-form">
        <h6 className="fsz-18 fw-bold text-uppercase mb-title-sm"> Thanh toán </h6>
        <div className="alerts mb-16">
          <div className="row">
            {renderLinkToPageLogin()}

            <div className="col-lg-7">
              <FormCheckout onSubmit={handlerOnSubmit} useForm={formConfig} />
            </div>
            <div className="col-lg-5">
              <div className="order">
                <h6 className="fsz-16 fw-bold mb-title"> Đơn hàng của bạn </h6>
                <div className="order-card">
                  <h6 className="card-title">
                    <span> MÔ TẢ SẢN PHẨM </span> <span> GIÁ </span>
                  </h6>
                  <div className="prod-cont">
                    {renderItemInCart()}
                    {renderDiscountPrice()}
                    {renderShippingPrice()}
                  </div>
                  <div className="total d-flex justify-content-between fsz-16 fw-bold pb-0 pt-16">
                    <span> Tổng </span>
                    <span className="">
                      {' '}
                      {`${FormatNumber(
                        cartData?.prices?.grand_total?.value ?? 0,
                        '.'
                      )} ${currency}`}{' '}
                    </span>
                  </div>
                </div>

                <div className="payment-card">
                  <Promotions />

                  {renderPromotionInput()}

                  {renderPaymentMethods(cartData?.available_payment_methods)}

                  <button
                    className="butn bg-green2 text-white radius-4 fw-500 fsz-12 text-uppercase text-center mt-title mb-0 py-3 px-3 w-100 none-border btn-checkout"
                    disabled={isDisabledBtnCheckout}
                    onClick={handlerOnSubmit}>
                    {isLoadingCheckout || isCheckEmail ? <Spinner /> : null}
                    <span> Thanh toán </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="home-style3 checkout-pg-1">
      <Breadcrumb
        items={[
          {
            title: 'Trang chủ',
            href: '/',
          },
          {
            title: 'Thanh toán',
            href: '#',
          },
        ]}
      />

      <section className="tc-checkout box-wr bg-white mt-3 mb-3 MN-checkout">
        {renderContentPage()}
      </section>
    </div>
  )
}

export default CheckoutPage

const EMPTY_FIELD = 'Trường này không được bỏ trống'

const schemaValidate: Yup.ObjectSchema<any> = Yup.object().shape({
  firstName: Yup.string().required(EMPTY_FIELD),
  lastName: Yup.string().required(EMPTY_FIELD),
  city: Yup.object().required(EMPTY_FIELD),
  district: Yup.object().required(EMPTY_FIELD),
  ward: Yup.object().required(EMPTY_FIELD),
  street: Yup.string().required(EMPTY_FIELD),
  email: Yup.string()
    .matches(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/, 'Email không đúng định dạng')
    .required(EMPTY_FIELD),
  phoneNumber: Yup.string()
    .matches(/^0\d{9}$/, 'Số điện thoại không đúng định dạng')
    .required(EMPTY_FIELD),
  account: Yup.boolean(),
  note: Yup.string(),
  payment: Yup.string(),
})
