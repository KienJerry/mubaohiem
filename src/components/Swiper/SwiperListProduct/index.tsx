/* eslint-disable @next/next/no-img-element */
import { FC, useRef } from 'react'

import SwiperCore from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import ProductCard from '@/components/productCard'
import EmptyData from '@/components/boxLayout/EmptyData'

type PropsSwiperListProduct = {
  className?: string,
  slidesPerView?: number,
  isShowAddToCart?: boolean,
  childrenClassName?: string,
  products: Product[] | undefined,
}

const SwiperListProduct: FC<PropsSwiperListProduct> = ({
  products,
  className,
  childrenClassName,
  slidesPerView = 4,
  isShowAddToCart = true,
}) => {
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

  const renderSwiperButton = () => {
    if (!products || products?.length < slidesPerView) return null
    return (
      <>
        <div className="swiper-button-next" onClick={goToNextSlide}>
          <i className="la la-angle-right"></i>
        </div>
        <div className="swiper-button-prev" onClick={goToPrevSlide}>
          <i className="la la-angle-left"></i>
        </div>
      </>
    )
  }

  const renderSlideProducts = () => {
    if (!products || products.length === 0) return <EmptyData title="Không tìm thấy sản phẩm" />

    return products.map((product, idx) => {
      return (
        <SwiperSlide key={product?.uid || idx}>
          <ProductCard data={product} isShowAddToCart={isShowAddToCart} />
        </SwiperSlide>
      )
    })
  }

  return (
    <div className={className}>
      <div className={childrenClassName}>
        <Swiper
          ref={swiperRef}
          loop={true}
          spaceBetween={0}
          navigation={true}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: slidesPerView,
            },
          }}
          pagination={{
            clickable: true,
          }}
          modules={[Navigation]}
          className="swiper-wrapper-flex">
          {renderSlideProducts()}
        </Swiper>
      </div>

      {renderSwiperButton()}
    </div>
  )
}

export default SwiperListProduct
