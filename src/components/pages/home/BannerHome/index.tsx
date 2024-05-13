/* eslint-disable @next/next/no-img-element */
import { FC } from 'react'
import NavbarLeftSide from '../../../NavbarLeftSide'
import SwiperEffectFade from '../../../Swiper/SwiperEffectFade'
import Link from 'next/link'
import { useWindowSize } from '@/hooks/useWindowSize'

type BannerHome = {
  dataBanner: {
    bannersBig?: Banner[],
    bannersSmall?: Banner[],
  },
  categories: Category,
}

const BannerHome: FC<BannerHome> = ({ dataBanner, categories }) => {
  const { bannersBig = [], bannersSmall = [] } = dataBanner

  const { width } = useWindowSize()

  return (
    <div className="tc-header-style3">
      <div className="row gx-0">
        <div className="col-lg-3 pe-lg-3 show-only-desktop">
          <NavbarLeftSide categories={categories} />
        </div>
        <div className="col-lg-9">
          <div className="main-header-content">
            <div className="row gx-0">
              <div className="col-lg-8">
                <SwiperEffectFade
                  className="header-slider3"
                  data={width > 994 ? bannersBig : [...bannersBig, ...bannersSmall]}
                />
                <div className="row gx-3 show-only-desktop">
                  <div className="col-lg-6">
                    <div className="card-rec-box mt-3">
                      <div className="img">
                        <img
                          loading="lazy"
                          src={bannersSmall?.[2]?.media ?? '/assets/images/header/slider4.png'}
                          alt={bannersSmall?.[2]?.media_alt}
                          className="img-cover"
                        />
                      </div>
                      <div className="info">
                        <h6 className="sub-title fsz-15 fw-500 ">{bannersSmall?.[2]?.name}</h6>
                        {bannersSmall?.[2]?.caption ? (
                          <div dangerouslySetInnerHTML={{ __html: bannersSmall[2].caption }} />
                        ) : null}
                        {bannersSmall?.[2]?.link && (
                          <a
                            href={bannersSmall?.[2]?.link}
                            className="btn-more fsz-12 text-decoration-underline text-uppercase">
                            <span className="txt">Khám phá ngay</span>
                            <span className="btn-arr">
                              <i className="btn-arr-icon --first las la-angle-right arrow"></i>
                              <i className="btn-arr-icon --second las la-angle-right arrow"></i>
                            </span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="card-rec-box mt-3">
                      <div className="img">
                        <img
                          loading="lazy"
                          src={bannersSmall?.[3]?.media ?? '/assets/images/header/slider5.png'}
                          alt={bannersSmall?.[3]?.media_alt}
                          className="img-cover"
                        />
                      </div>
                      <div className="info text-white">
                        <h6 className="sub-title fsz-15 fw-500">{bannersSmall?.[3]?.name}</h6>
                        {bannersSmall?.[3]?.caption ? (
                          <div dangerouslySetInnerHTML={{ __html: bannersSmall[3].caption }} />
                        ) : null}
                        {bannersSmall?.[3]?.link && (
                          <Link
                            passHref
                            href={bannersSmall?.[3]?.link || ''}
                            className="btn-more fsz-12 text-decoration-underline text-uppercase">
                            <span className="txt">Khám phá ngay</span>
                            <span className="btn-arr">
                              <i className="btn-arr-icon --first las la-angle-right arrow"></i>
                              <i className="btn-arr-icon --second las la-angle-right arrow"></i>
                            </span>
                          </Link>
                        )}
                        {/* <p className="fsz-12">Best for all device</p> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 ps-lg-3 show-only-desktop">
                <div className="card-box">
                  <div className="img">
                    <img
                      loading="lazy"
                      src={bannersSmall?.[0]?.media ?? '/assets/images/header/slider6.png'}
                      alt={bannersSmall?.[0]?.media_alt}
                      className="img-cover"
                    />
                  </div>
                  <div className="info r_info">
                    {/* <small className="fsz-10 d-block mb-2 text-uppercase">xomia</small> */}
                    <h6 className="sub-title fsz-20 fw-600">{bannersSmall?.[0]?.name}</h6>
                    {bannersSmall?.[0]?.caption ? (
                      <div dangerouslySetInnerHTML={{ __html: bannersSmall[0].caption }} />
                    ) : null}
                    {bannersSmall?.[0]?.link && (
                      <a
                        href={bannersSmall?.[0]?.link}
                        className="butn px-3 py-2 bg-333 text-white radius-4 fw-500 fsz-11 text-uppercase hover-bg-green2">
                        <span> Mua ngay </span>
                      </a>
                    )}
                  </div>
                </div>
                <div className="card-box mt-3">
                  <div className="img">
                    <img
                      loading="lazy"
                      src={bannersSmall?.[1]?.media ?? '/assets/images/header/slider7.png'}
                      alt={bannersSmall?.[1]?.media_alt}
                      className="img-cover"
                    />
                  </div>
                  <div className="info text-white">
                    <h6 className="sub-title fsz-20 text-capitalize fw-600">
                      {bannersSmall?.[1]?.name}
                    </h6>
                    {bannersSmall?.[1]?.caption ? (
                      <div dangerouslySetInnerHTML={{ __html: bannersSmall[1].caption }} />
                    ) : null}
                    {bannersSmall?.[1]?.link && (
                      <Link
                        href={bannersSmall?.[1]?.link || ''}
                        passHref
                        className="butn px-3 py-2 bg-333 text-white radius-4 fw-500 fsz-11 text-uppercase hover-bg-green2">
                        <span> Mua ngay </span>
                      </Link>
                    )}
                    {/* <small className="fsz-10 text-uppercase color-999">from</small>
                    <h5 className="fsz-24 color-green2 fw-400">$169</h5> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BannerHome
