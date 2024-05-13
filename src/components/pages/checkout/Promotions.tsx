import { FC } from 'react'

import 'swiper/css'
import 'swiper/css/pagination'

import classNames from 'classnames'
import useCart from '@/hooks/useCart'
import { useQuery } from 'react-query'
import { FormatNumber, isCurrentTimeInRange } from '@/helper'

import promotionAPI from '@/services/promotion'
import usePromotion from '@/hooks/usePromotion'
import { Swiper, SwiperSlide } from 'swiper/react'

type Promotions = {
  slidesPerView?: number,
}

const Promotions: FC<Promotions> = ({ slidesPerView = 1.5 }) => {
  const { cartData } = useCart()
  const { onApplyVoucher, onRemoveVoucher, isLoadingHandleVoucher } = usePromotion()

  const { data: promotions } = useQuery<any>(['GET_LIST_PROMOTION'], {
    queryFn: async () => {
      return await promotionAPI.getList()
    },
    staleTime: 30000,
  })
  const appliedCoupons = cartData?.applied_coupons
  const isHaveAppliedCoupons = appliedCoupons !== null

  const renderVouchers = () => {
    return promotions?.cartPriceRule?.items?.map((item: Promotion) => {
      const isInTimeActive = isCurrentTimeInRange(item?.from_date, item?.to_date)
      const isActive = isInTimeActive && item?.is_active
      const isSelected = item?.code === appliedCoupons?.[0]?.code

      if (!isInTimeActive) return null
      return (
        <SwiperSlide key={item?.code} >
          <div
            className={classNames('voucher', {
              active: isSelected,
              disabled: !item?.is_active,
            })}
            onClick={() => {
              if (!isActive || isSelected || isLoadingHandleVoucher) return

              if (!isHaveAppliedCoupons)
                return onApplyVoucher({
                  cart_id: cartData?.id ?? '',
                  coupon_code: item?.code,
                })

              return onRemoveVoucher({
                cartId: cartData?.id ?? '',
                callBackFn: () => {
                  onApplyVoucher({
                    cart_id: cartData?.id ?? '',
                    coupon_code: item?.code,
                  })
                },
              })
            }}>
            <div className="decorate"></div>
            <div className="content">
              <div>
                <b>{item?.code}</b> - {item?.name} (
                {`${FormatNumber(item?.discount_amount, '.')}${item?.currency}`})
              </div>
              <div>{item?.description}</div>
            </div>
          </div>
        </SwiperSlide>
      )
    })
  }

  if (!promotions) return null
  return (
    <Swiper
      slidesPerView={slidesPerView}
      spaceBetween={10}
      pagination={{
        clickable: true,
      }}
      className="mySwiper box-voucher">
      {renderVouchers()}
    </Swiper>
  )
}

export default Promotions
