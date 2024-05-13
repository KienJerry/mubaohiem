import { useEffect, useRef } from 'react'

import SwiperCore from 'swiper'
import { useQuery } from 'react-query'
import promotionAPI from '@/services/promotion'
import { Swiper, SwiperSlide } from 'swiper/react'

import { Navigation, Autoplay } from 'swiper/modules'
import { FormatNumber, isCurrentTimeInRange } from '@/helper'
import { useWindowSize } from '@/hooks/useWindowSize'

/* eslint-disable @next/next/no-img-element */
const HotCombo = () => {
  const slidesPerViewRef = useRef<number>(4)
  const swiperRef = useRef<SwiperCore | any>(null)

  const { width } = useWindowSize()

  const { data: promotions } = useQuery<any>(['GET_LIST_PROMOTION'], {
    queryFn: async () => {
      return await promotionAPI.getList()
    },
    staleTime: 30000,
  })
  const itemsPromotion: Promotion[] = promotions?.cartPriceRule?.items ?? []

  useEffect(() => {
    if (!width) return

    if (width > 1024) {
      slidesPerViewRef.current = 4
      return
    }
    if (width > 640) {
      slidesPerViewRef.current = 3
      return
    }

    slidesPerViewRef.current = 1
  }, [width])

  const goToNextSlide = () => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper?.slideNext()
    }
  }

  const goToPrevSlide = () => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper?.slidePrev()
    }
  }

  const renderSliderPromotion = () => {
    return itemsPromotion?.map((promotion, index) => {
      const isInTimeActive = isCurrentTimeInRange(promotion?.from_date, promotion?.to_date)

      if (!isInTimeActive) return null
      return (
        <SwiperSlide key={promotion?.code + index}>
          <div className="product-card">
            {/* <a href="" className="img th-230 d-block radius-4 overflow-hidden">
              <img src="/assets/images/products/prod14.jpg" alt="" className="img-cover" />
            </a> */}
            <img
            loading="lazy"
              src={
                promotion?.promotion_image
                  ? promotion?.promotion_image
                  : '/assets/images/products/prod14.jpg'
              }
              alt=""
              className="img-cover radius-4"
            />
            <div className="info pt-20">
              <h6 className="fsz-16 fw-bold">
                {/* <a href="#" className="fsz-16 fw-bold hover-green2">
                  {promotion?.name} - {promotion?.code}
                </a> */}
                {promotion?.name} - {promotion?.code}
              </h6>
              <p className="fsz-13 color-666 mt-10">
                {promotion?.description} (
                {`${FormatNumber(promotion?.discount_amount, '.')}${promotion?.currency}`})
              </p>
              {/* <a
                href="#"
                className="butn color-green2 border-green2 border radius-4 fw-500 fsz-11 text-uppercase text-center mt-2 hover-bg-green2 hover-white py-2 mt-20">
                <span> shop now </span>
              </a> */}
            </div>
          </div>
        </SwiperSlide>
      )
    })
  }

  const renderArrows = () => {
    if (itemsPromotion?.length <= slidesPerViewRef.current) return null

    return (
      <div className="arrows">
        <div className="swiper-button-next" onClick={goToNextSlide}>
          <i className="la la-angle-right"></i>
        </div>
        <div className="swiper-button-prev" onClick={goToPrevSlide}>
          <i className="la la-angle-left"></i>
        </div>
      </div>
    )
  }

  if (!itemsPromotion?.length) return null
  return (
    <section
      className="tc-new-brands-style3 box-wr bg-white mt-3 wow fadeInUp slow MN-padding"
      data-wow-delay="0.2s"
      id="HOT_COMBO">
      <div className="title mb-title ">
        <div className="row align-items-center flex-mobile">
          <div className="col-lg-8">
            <h6 className="fsz-18 fw-bold text-uppercase mb-0 h-mobile">khuyến mãi</h6>
          </div>
          <div className="col-lg-4 text-lg-end mt-lg-0 d-flex align-items-center">
            {renderArrows()}
          </div>
        </div>
      </div>
      <div className="new-brands-slider position-relative overflow-hidden">
        <Swiper
          ref={swiperRef}
          slidesPerView={1}
          spaceBetween={30}
          loop={true}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          breakpoints={{
            640: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          modules={[Navigation, Autoplay]}
          className="swiper-wrapper-flex">
          {renderSliderPromotion()}
        </Swiper>
      </div>
    </section>
  )
}

export default HotCombo
