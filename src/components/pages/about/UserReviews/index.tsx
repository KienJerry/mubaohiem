/* eslint-disable @next/next/no-img-element */
import { useRef } from 'react'

import SwiperCore from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'

const UserReviews = () => {
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

  return (
    <div className="clients p-30 radius-4 bg-white mt-3 wow fadeInUp">
      <div className="title mb-30">
        <div className="row">
          <div className="col-lg-9">
            <h6 className="fsz-18 fw-bold text-uppercase mb-0"> from our lovely buyers </h6>
          </div>
          <div className="col-lg-3 mt-4 mt-lg-0 text-lg-end">
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
      <div className="clients-slider">
        {/* <div className="swiper-wrapper">
          <div className="swiper-slide">
            <div className="testi-card">
              <div className="rate mb-20">
                <div className="stars">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <h6 className="fsz-18 fw-bold"> Fast shipping and flexiable price! </h6>
              </div>
              <div className="text fsz-14 mb-40">
                “I used to have experience shopping on much platform as Amozon, Eboy, Esto, etc. And
                see that Swoo Market really great. It’ll be my 1st choice for any shopping
                experience. Competitive price, fast shipping and support 24/7. Extremely
                recommended!.”
              </div>
              <div className="btm-items">
                <div className="user-info">
                  <div className="img">
                    <img src="/assets/images/inner/user.png " alt="" />
                    <span className="icon">
                      <i className="fas fa-check"></i>
                    </span>
                  </div>
                  <div className="inf">
                    <h6 className="fsz-18 fw-bold">
                      Drake N.
                      <small className="fsz-10 color-green1 ms-1 text-uppercase">
                        Verified Buyer
                      </small>
                    </h6>
                    <p className="fsz-12 color-666"> Brooklyn, Los Angeles </p>
                  </div>
                </div>
                <a
                  href="#"
                  className="text-capitalize color-blue1 text-decoration-underline fsz-11 fw-600">
                  Marshall Standmore Speaker / Black
                </a>
              </div>
            </div>
          </div>
          <div className="swiper-slide">
            <div className="testi-card">
              <div className="rate mb-20">
                <div className="stars">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <h6 className="fsz-18 fw-bold"> Fast shipping and flexiable price! </h6>
              </div>
              <div className="text fsz-14 mb-40">
                “I used to have experience shopping on much platform as Amozon, Eboy, Esto, etc. And
                see that Swoo Market really great. It’ll be my 1st choice for any shopping
                experience. Competitive price, fast shipping and support 24/7. Extremely
                recommended!.”
              </div>
              <div className="btm-items">
                <div className="user-info">
                  <div className="img">
                    <img src="/assets/images/inner/user.png " alt="" />
                    <span className="icon">
                      <i className="fas fa-check"></i>
                    </span>
                  </div>
                  <div className="inf">
                    <h6 className="fsz-18 fw-bold">
                      Drake N.
                      <small className="fsz-10 color-green1 ms-1 text-uppercase">
                        Verified Buyer
                      </small>
                    </h6>
                    <p className="fsz-12 color-666"> Brooklyn, Los Angeles </p>
                  </div>
                </div>
                <a
                  href="#"
                  className="text-capitalize color-blue1 text-decoration-underline fsz-11 fw-600">
                  Marshall Standmore Speaker / Black
                </a>
              </div>
            </div>
          </div>
          <div className="swiper-slide">
            <div className="testi-card">
              <div className="rate mb-20">
                <div className="stars">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <h6 className="fsz-18 fw-bold"> Fast shipping and flexiable price! </h6>
              </div>
              <div className="text fsz-14 mb-40">
                “I used to have experience shopping on much platform as Amozon, Eboy, Esto, etc. And
                see that Swoo Market really great. It’ll be my 1st choice for any shopping
                experience. Competitive price, fast shipping and support 24/7. Extremely
                recommended!.”
              </div>
              <div className="btm-items">
                <div className="user-info">
                  <div className="img">
                    <img src="/assets/images/inner/user.png " alt="" />
                    <span className="icon">
                      <i className="fas fa-check"></i>
                    </span>
                  </div>
                  <div className="inf">
                    <h6 className="fsz-18 fw-bold">
                      Drake N.
                      <small className="fsz-10 color-green1 ms-1 text-uppercase">
                        Verified Buyer
                      </small>
                    </h6>
                    <p className="fsz-12 color-666"> Brooklyn, Los Angeles </p>
                  </div>
                </div>
                <a
                  href="#"
                  className="text-capitalize color-blue1 text-decoration-underline fsz-11 fw-600">
                  Marshall Standmore Speaker / Black
                </a>
              </div>
            </div>
          </div>
        </div> */}

        <Swiper
          ref={swiperRef}
          slidesPerView={1}
          spaceBetween={0}
          loop={true}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Navigation]}
          className="swiper-wrapper-flex">
          <SwiperSlide>
            <div className="testi-card">
              <div className="rate mb-20">
                <div className="stars">
                  <i className="la la-star"></i>
                  <i className="la la-star"></i>
                  <i className="la la-star"></i>
                  <i className="la la-star"></i>
                  <i className="la la-star"></i>
                </div>
                <h6 className="fsz-18 fw-bold mb-0"> Fast shipping and flexiable price! </h6>
              </div>
              <div className="text fsz-14 mb-40">
                “I used to have experience shopping on much platform as Amozon, Eboy, Esto, etc. And
                see that Swoo Market really great. It’ll be my 1st choice for any shopping
                experience. Competitive price, fast shipping and support 24/7. Extremely
                recommended!.”
              </div>
              <div className="btm-items">
                <div className="user-info">
                  <div className="img">
                    <img src="/assets/images/inner/user.png " alt="" />
                    <span className="icon">
                      <i className="la la-check"></i>
                    </span>
                  </div>
                  <div className="inf">
                    <h6 className="fsz-18 fw-bold mb-0">
                      Drake N.
                      <small className="fsz-10 color-green1 ms-1 text-uppercase">
                        Verified Buyer
                      </small>
                    </h6>
                    <p className="fsz-12 color-666 mb-0"> Brooklyn, Los Angeles </p>
                  </div>
                </div>
                <a
                  href="#"
                  className="text-capitalize color-blue1 text-decoration-underline fsz-11 fw-600">
                  Marshall Standmore Speaker / Black
                </a>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="testi-card">
              <div className="rate mb-20">
                <div className="stars">
                  <i className="la la-star"></i>
                  <i className="la la-star"></i>
                  <i className="la la-star"></i>
                  <i className="la la-star"></i>
                  <i className="la la-star"></i>
                </div>
                <h6 className="fsz-18 fw-bold mb-0"> Fast shipping and flexiable price! </h6>
              </div>
              <div className="text fsz-14 mb-40">
                “I used to have experience shopping on much platform as Amozon, Eboy, Esto, etc. And
                see that Swoo Market really great. It’ll be my 1st choice for any shopping
                experience. Competitive price, fast shipping and support 24/7. Extremely
                recommended!.”
              </div>
              <div className="btm-items">
                <div className="user-info">
                  <div className="img">
                    <img src="/assets/images/inner/user.png " alt="" />
                    <span className="icon">
                      <i className="la la-check"></i>
                    </span>
                  </div>
                  <div className="inf">
                    <h6 className="fsz-18 fw-bold mb-0">
                      Drake N.
                      <small className="fsz-10 color-green1 ms-1 text-uppercase">
                        Verified Buyer
                      </small>
                    </h6>
                    <p className="fsz-12 color-666 mb-0"> Brooklyn, Los Angeles </p>
                  </div>
                </div>
                <a
                  href="#"
                  className="text-capitalize color-blue1 text-decoration-underline fsz-11 fw-600">
                  Marshall Standmore Speaker / Black
                </a>
              </div>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="testi-card">
              <div className="rate mb-20">
                <div className="stars">
                  <i className="la la-star"></i>
                  <i className="la la-star"></i>
                  <i className="la la-star"></i>
                  <i className="la la-star"></i>
                  <i className="la la-star"></i>
                </div>
                <h6 className="fsz-18 fw-bold mb-0"> Fast shipping and flexiable price! </h6>
              </div>
              <div className="text fsz-14 mb-40">
                “I used to have experience shopping on much platform as Amozon, Eboy, Esto, etc. And
                see that Swoo Market really great. It’ll be my 1st choice for any shopping
                experience. Competitive price, fast shipping and support 24/7. Extremely
                recommended!.”
              </div>
              <div className="btm-items">
                <div className="user-info">
                  <div className="img">
                    <img src="/assets/images/inner/user.png " alt="" />
                    <span className="icon">
                      <i className="la la-check"></i>
                    </span>
                  </div>
                  <div className="inf">
                    <h6 className="fsz-18 fw-bold mb-0">
                      Drake N.
                      <small className="fsz-10 color-green1 ms-1 text-uppercase">
                        Verified Buyer
                      </small>
                    </h6>
                    <p className="fsz-12 color-666 mb-0"> Brooklyn, Los Angeles </p>
                  </div>
                </div>
                <a
                  href="#"
                  className="text-capitalize color-blue1 text-decoration-underline fsz-11 fw-600">
                  Marshall Standmore Speaker / Black
                </a>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>
      </div>
    </div>
  )
}

export default UserReviews
