/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'

import Link from 'next/link'
import { Skeleton } from 'antd'
import CardItem from './CardItem'
import { RootState } from '@/store'

import useCart from '@/hooks/useCart'
import { FormatNumber } from '@/helper'
import { useSelector } from 'react-redux'
import { Spinner } from '@/components/spinner'

import Promotions from '../checkout/Promotions'
import usePromotion from '@/hooks/usePromotion'
import Breadcrumb from '@/components/Breadcrumb'
import EmptyData from '@/components/boxLayout/EmptyData'

import LoadingData from '@/components/boxLayout/LoadingData'

const CartPage = () => {
  const [voucher, setVoucher] = useState<string>('')
  const [loadingPayment, setLoadingPayment] = useState<boolean>(false)

  const { cartData, isLoadingGetCart, isCartLoading, onUpdateProduct } = useCart()
  const currency = cartData?.prices?.grand_total?.currency ?? ''
  const appliedCoupons = cartData?.applied_coupons
  const isHaveAppliedCoupons = appliedCoupons !== null

  const { isLoadingHandleVoucher, onApplyVoucher, onRemoveVoucher } = usePromotion()

  const { isLoadingGetCart: isLoadingHookGetCart } = useSelector(
    (state: RootState) => state?.loading
  )

  const handleChangeVoucher = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVoucher(e.target.value)
  }

  const renderItemInCart = () => {
    if (isLoadingGetCart && !cartData) return <LoadingData />

    return cartData?.items?.map((item) => (
      <CardItem data={item} key={item?.id} onUpdateProduct={onUpdateProduct} />
    ))
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
      <div className="box-coupon p-0 mb-3">
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

  const renderContentPage = () => {
    if ((!cartData?.items || cartData?.items?.length === 0) && !isLoadingGetCart)
      return (
        <div className="text-center">
          <EmptyData />
          <h5 className='fz-15 mt-8 mb-0'>Giỏ hàng trống! Hãy chọn vài sản phẩm rồi quay lại đây!</h5>
        </div>
      )

    return (
      <div className="row">
        <div className="col-lg-8">
          <div className="products">{renderItemInCart()}</div>
        </div>
        <div className="col-lg-4">
          <div className="cart-card">
            <strong className="fsz-16 d-block mb-title-sm"> Thông tin hoá đơn </strong>
            <div className="card-item">
              <span> Tạm tính: </span>
              <strong className="color-000">
                <Skeleton
                  active
                  style={{ width: '110px' }}
                  className="MN-Skeleton-text"
                  loading={isCartLoading || isLoadingHookGetCart}>
                  {`${FormatNumber(
                    cartData?.prices?.subtotal_excluding_tax?.value ?? 0,
                    '.'
                  )} ${currency}`}
                </Skeleton>
              </strong>
            </div>
            {/* <div className="card-item">
                <span> Shpping estimate: </span> <strong className="color-000"> $600.00 </strong>
              </div> */}
            <div className="card-item border-0">
              <strong className="color-000 text-uppercase"> Tổng tiền: </strong>
              <strong className="color-000">
                <Skeleton
                  active
                  style={{ width: '110px' }}
                  className="MN-Skeleton-text"
                  loading={isCartLoading || isLoadingHookGetCart}>
                  {`${FormatNumber(cartData?.prices?.grand_total?.value ?? 0, '.')} ${currency}`}
                </Skeleton>
              </strong>
            </div>
            <div className="mt-3">
              <Promotions />
            </div>
            {renderPromotionInput()}
            <div className="btns pt-3">
              <div className="row justify-content-center">
                <div className="col-lg-12">
                  <Link
                    href="/checkout"
                    className="butn bg-green2 text-white radius-4 fw-500 fsz-12 text-uppercase text-center mt-3 mt-lg-0 py-3 px-3 w-100 btn-add-to-cart">
                    <span className="text-white" onClick={() => setLoadingPayment(!loadingPayment)}>
                      {loadingPayment && <Spinner className="spinner-white spinner-btn" />} Thanh
                      toán{' '}
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="home-style3 cart-pg-1">
      <Breadcrumb
        items={[
          {
            title: 'Trang chủ',
            href: '/',
          },
          {
            title: 'Giỏ hàng',
            href: '#',
          },
        ]}
      />

      <section className="tc-cart box-wr bg-white mt-3 mb-3 MN-cart">
        {renderContentPage()}
      </section>
    </div>
  )
}

export default CartPage
