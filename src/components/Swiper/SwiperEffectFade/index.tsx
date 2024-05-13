/* eslint-disable @next/next/no-img-element */
import { FC, useEffect, useRef, useState } from 'react'

import SwiperCore from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, EffectFade, Pagination, Autoplay } from 'swiper/modules'
// import { Navigation, EffectFade, Pagination, Mousewheel } from 'swiper/modules'

type SwiperEffectFade = {
  className?: string
  data: Banner[]
}

const SwiperEffectFade: FC<SwiperEffectFade> = ({ className = "header-slider3", data = [] }) => {
  const [totalSlides, setTotalSlides] = useState<number>(data.length)
  const [activeIndex, setActiveIndex] = useState<number>(0)

  const swiperRef = useRef<SwiperCore | any>(null)

  useEffect(() => {
    if (swiperRef.current?.swiper) {
      setTotalSlides(swiperRef.current.swiper?.slides.length)
      setActiveIndex(swiperRef.current.swiper?.activeIndex)
    }
  }, [swiperRef, data])

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

  const renderSwiperSlide = () => {
    return data?.map(item => {
      return (
        <SwiperSlide key={item.banner_id}>
          <div className="slider-card">
            <div className="img">
              <img src={item?.media ?? "/assets/images/header/slider1.png"} alt={item?.media_alt} className="img-cover" />
            </div>
            <div className="info text-white">
              <h2 className="fsz-30 fw-500">
                {/* <span className="color-green2 d-block">aPodOs</span> */}
                {item.name}
              </h2>
              {item?.caption ? <div dangerouslySetInnerHTML={{ __html: item.caption }} /> : null}
              {item?.link ? 
              <a
                href={item?.link}
                className="butn px-3 py-2 bg-green2 text-white radius-4 fw-500 fsz-12 text-uppercase w-fit">
                <span> Mua ngay </span>
              </a> : null
              }
            </div>
          </div>
        </SwiperSlide>
      );
    })
  }

  if (data.length === 0) return null;
  return (
    <div className={className}>
      <Swiper
        ref={swiperRef}
        slidesPerView={1}
        spaceBetween={0}
        effect={'fade'}
        pagination={{
          clickable: true,
          type: 'fraction',
        }}
        navigation={true}
        // mousewheel={true}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false
        }}
        modules={[Navigation, EffectFade, Pagination, Autoplay]}
        onSlideChange={() => {
          if (swiperRef.current?.swiper) {
            setActiveIndex(swiperRef.current.swiper?.activeIndex)
          }
        }}
        className="swiper-wrapper-flex swiper-wrapper-banner">
        {renderSwiperSlide()}
      </Swiper>
      <div className="slider-controls slider-controls-custom">
        <div className="swiper-button-prev" onClick={goToPrevSlide}>
          <i className="la la-angle-left ms-1"></i>
        </div>
        <div className="swiper-pagination">{`${activeIndex + 1} / ${totalSlides}`}</div>
        <div className="swiper-button-next" onClick={goToNextSlide}>
          <i className="la la-angle-right ms-1"></i>
        </div>
      </div>
    </div>
  )
}

export default SwiperEffectFade