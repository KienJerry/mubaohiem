/* eslint-disable @next/next/no-img-element */
import { FC, useRef } from 'react'

import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import EmptyData from '../boxLayout/EmptyData'
import ProductCard from '../productCard'

type RelatedProducts = {
  products: Product[] | undefined,
}

const RelatedProducts: FC<RelatedProducts> = ({ products }) => {
  const swiperRef = useRef<SwiperCore | any>(null)

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

  const renderSlideProducts = () => {
    if (!products || products.length === 0) return <EmptyData title="Không tìm thấy sản phẩm" />

    return products.map((product) => {
      return (
        <SwiperSlide key={product.uid}>
          <ProductCard data={product} />
        </SwiperSlide>
      )
    })
  }

  if (!products || products.length === 0) return null

  return (
    <section className="related-products p-30 radius-4 bg-white mt-3 wow fadeInUp mb-3">
      <h6 className="fsz-18 fw-bold text-uppercase"> Sản phẩm liên quan </h6>
      <div className="products-content">
        <div className="products-slider">
          <Swiper
            ref={swiperRef}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 5,
              },
            }}
            spaceBetween={0}
            loop={true}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Navigation]}
            className="swiper-wrapper-flex">
            {renderSlideProducts()}
          </Swiper>
        </div>
        <div className="swiper-button-next" onClick={goToNextSlide}>
          <i className="la la-angle-right"></i>
        </div>
        <div className="swiper-button-prev" onClick={goToPrevSlide}>
          <i className="la la-angle-left"></i>
        </div>
      </div>
    </section>
  )
}

export default RelatedProducts
