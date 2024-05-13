/* eslint-disable @next/next/no-img-element */
import { useRef } from 'react'

import SwiperCore from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import ProductCardShort from '../productCard/ProductCardShort'

const RecentlyViewed = () => {
  const swiperRef = useRef<SwiperCore | any>(null)

  const recentlyViewedJSON =
    typeof window !== 'undefined' ? localStorage?.getItem('recentlyViewed') : false
  const recentlyViewed: Product[] = recentlyViewedJSON ? JSON?.parse(recentlyViewedJSON) : []

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

  const renderSliderProduct = () => {
    return recentlyViewed?.map((product) => {
      return (
        <SwiperSlide key={product?.uid}>
          <ProductCardShort data={product} />
        </SwiperSlide>
      )
    })
  }

  if (recentlyViewedJSON === null || recentlyViewed?.length === 0) return <div className="mb-3" />

  return (
    <section
      className="tc-recently-viewed-style3 box-wr bg-white mt-3 mb-3 wow fadeInUp slow MN-padding MN-box-container"
      data-wow-delay="0.2s">
      <div className="title mb-title">
        <div className="row align-items-center">
          <div className="col-lg-8 box-title">
            <h6 className="fsz-18 fw-bold text-uppercase d-inline-block h-mobile mb-0">Đã xem</h6>
            {/* <Link
              href="/products"
              className="more text-capitalize color-666 fsz-13 ms-lg-4 mt-lg-0">
              Xem thêm <i className="la la-angle-right"></i>
            </Link> */}
          </div>
          <div className="col-lg-4 text-lg-end mt-3 mt-lg-0 box-arrow">
            <div className="arrows">
              <div className="swiper-button-next" onClick={goToNextSlide}>
                <i className="la la-angle-right"></i>
              </div>
              <div className="swiper-button-prev" onClick={goToPrevSlide}>
                <i className="la la-angle-left"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="products-slider">
        <Swiper
          ref={swiperRef}
          slidesPerView={2}
          spaceBetween={0}
          loop={true}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            768: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 4,
            },
          }}
          modules={[Navigation]}
          className="swiper-wrapper-flex">
          {renderSliderProduct()}
        </Swiper>
      </div>
    </section>
  )
}

export default RecentlyViewed
