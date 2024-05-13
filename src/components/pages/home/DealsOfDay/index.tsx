/* eslint-disable @next/next/no-img-element */
import { FC, useRef } from 'react'

import Link from 'next/link'
import SwiperCore from 'swiper'
import TechNews from './TechNews'

import Countdown from './Countdown'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Autoplay } from 'swiper/modules'
import ProductCartDaily from '@/components/productCard/ProductCartDaily'

type DealsOfDay = {
  resProductDaily: ResProductDaily,
}

const DealsOfDay: FC<DealsOfDay> = ({ resProductDaily }) => {
  const swiperRef = useRef<SwiperCore | any>(null)

  const productsDaily = resProductDaily?.items ?? []

  const goToNextSlide = (swiper: any) => {
    if (swiper) {
      swiper?.slideNext()
    }
  }

  const goToPrevSlide = (swiper: any) => {
    if (swiper) {
      swiper?.slidePrev()
    }
  }

  const renderBtnSlide = () => {
    if (productsDaily?.[0]?.items && productsDaily?.[0]?.items?.length < 3) return null
    return (
      <>
        <div
          className="swiper-button-next"
          onClick={() => goToNextSlide(swiperRef.current?.swiper)}>
          <i className="la la-angle-right ms-1"></i>
        </div>
        <div
          className="swiper-button-prev"
          onClick={() => goToPrevSlide(swiperRef.current?.swiper)}>
          <i className="la la-angle-left ms-1"></i>
        </div>
      </>
    )
  }

  if (!resProductDaily || productsDaily?.length === 0) return null

  return (
    <section className="tc-deals-style3 tc-brand-box-style3 MN-daily-product" id="FLASH_SALE">
      <div className="row gx-3">
        <div className="col-lg-9">
          <div className="deals-day mt-3 wow fadeInUp slow box-product-daily" data-wow-delay="0.2s">
            <div className="title-box mb-1 mb-lg-0 mn-deal-of-day">
              <div className="box-header title-hd d-flex align-items-center">
                <h6 className="title fsz-18 fw-bold text-uppercase d-inline-block mb-0 text-white">
                  ƯU ĐÃI TRONG NGÀY
                </h6>
                <div className="text-lg-end">
                  <Link href="/products" className="more text-capitalize fsz-13">
                    Xem tất cả <i className="la la-angle-right ms-1"></i>
                  </Link>
                </div>
              </div>
              <Countdown endDate={resProductDaily?.items?.[0]?.end_date ?? ''} />
            </div>
            <div className="product-details box-wr bg-white">
              <div className="products-content wow fadeInUp slow" data-wow-delay="0.2s">
                <div className="products-slider mx-1">
                  <Swiper
                    ref={swiperRef}
                    slidesPerView={1}
                    spaceBetween={30}
                    loop={true}
                    autoplay={{
                      delay: 5500,
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
                        slidesPerView: 3,
                      },
                    }}
                    modules={[Navigation, Autoplay]}
                    className="swiper-wrapper-flex">
                    {resProductDaily?.items?.[0]?.items?.map((item, index) => (
                      <SwiperSlide key={index}>
                        <ProductCartDaily data={item?.product} />
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>

                {renderBtnSlide()}
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3">
          <TechNews />
        </div>
      </div>
    </section>
  )
}

export default DealsOfDay
