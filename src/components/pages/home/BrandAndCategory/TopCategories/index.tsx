/* eslint-disable @next/next/no-img-element */
import { useRef } from 'react'

import Link from 'next/link'
import SwiperCore from 'swiper'
import { useQuery } from 'react-query'
import { Navigation } from 'swiper/modules'

import categoryApi from '@/services/categories'
import { Swiper, SwiperSlide } from 'swiper/react'

const TopCategories = () => {
  const swiperRef = useRef<SwiperCore | any>(null)

  const { data: categories } = useQuery<Category>(['GET_CATEGORIES'], {
    queryFn: async () => {
      return await categoryApi.getCategories({}).then((res: any) => res?.categories?.items?.[0])
    },
    staleTime: 30000,
  })

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

  const renderItemsCategory = () => {
    return categories?.children
      ?.sort((a, b) => a.position - b.position)
      ?.map((category) => {
        return (
          <SwiperSlide key={category?.uid}>
            <Link href={`/products/?category_uid=${category?.uid}`} className="cat-card">
              <div className="img">
                <img
                  loading="lazy"
                  src={category?.image ? category.image : '/assets/images/logo.png'}
                  alt=""
                  width={20}
                  height={60}
                  className="img-contain"
                />
              </div>
              <p className="text fsz-14 fw-600">{category?.name}</p>
            </Link>
          </SwiperSlide>
        )
      })
  }

  return (
    <div
      className="categories bg-white box-wr mt-3 wow fadeInUp slow top-categories"
      data-wow-delay="0.4s">
      <div className="title">
        <div className="categories-wr row">
          <div className="col-lg-8 box-title">
            <h6 className="fsz-18 fw-bold text-uppercase d-inline-block mb-0 h-mobile">
              Danh mục nổi bật
            </h6>
            <Link
              href="/products/#POPULAR_CATEGORIES"
              className="more text-capitalize color-666 fsz-13 ms-lg-4 mt-lg-0">
              Xem thêm <i className="la la-angle-right"></i>
            </Link>
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
      <div className="categories-slider">
        {/* <div className="swiper-wrapper">
          <div className="swiper-slide">
            <a href="#" className="cat-card">
              <div className="img">
                <img src="/assets/images/products/prod1.png" alt="" className="img-contain" />
              </div>
              <p className="fsz-14 fw-600">PC Gaming</p>
            </a>
          </div>
          <div className="swiper-slide">
            <a href="#" className="cat-card">
              <div className="img">
                <img src="/assets/images/products/prod2.png" alt="" className="img-contain" />
              </div>
              <p className="fsz-14 fw-600">Headphones</p>
            </a>
          </div>
          <div className="swiper-slide">
            <a href="#" className="cat-card">
              <div className="img">
                <img src="/assets/images/products/prod3.png" alt="" className="img-contain" />
              </div>
              <p className="fsz-14 fw-600">Monitors</p>
            </a>
          </div>
          <div className="swiper-slide">
            <a href="#" className="cat-card">
              <div className="img">
                <img src="/assets/images/products/prod4.png" alt="" className="img-contain" />
              </div>
              <p className="fsz-14 fw-600">Laptops</p>
            </a>
          </div>
        </div> */}

        <Swiper
          ref={swiperRef}
          slidesPerView={3}
          spaceBetween={5}
          loop={true}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          breakpoints={{
            640: {
              slidesPerView: 4,
            },
            1024: {
              slidesPerView: 5,
            },
          }}
          modules={[Navigation]}
          className="swiper-wrapper-flex">
          {renderItemsCategory()}
        </Swiper>
      </div>
    </div>
  )
}

export default TopCategories
