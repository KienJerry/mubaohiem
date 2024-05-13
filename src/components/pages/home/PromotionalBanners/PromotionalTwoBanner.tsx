/* eslint-disable @next/next/no-img-element */
import homeApi from '@/services/home'
import Link from 'next/link'
import React from 'react'
import { useQuery } from 'react-query'

const PromotionalTwoBanner = () => {
  const { data: bannerHomePageFooter } = useQuery<Banner[]>(['home-page-banner-footer'], {
    queryFn: async () => {
      return await homeApi
        .getSlider({
          eq: 'home-page-banner-footer',
        })
        .then((res: any) => {
          return res?.Slider?.items?.[0]?.Banner?.items
        })
    },
    staleTime: 30000,
  })

  return (
    <section className="tc-sub-banners-style3">
      <div className="row gx-2">
        {bannerHomePageFooter?.map((val, key) => {
          return (
            <React.Fragment key={val?.banner_id}>
              {val?.link ? (
                <Link passHref href={val?.link} className="col-lg-6">
                  <div className="cashback-banner mt-3 wow fadeInUp slow" data-wow-delay="0.2s">
                    <div className="img">
                      <img loading="lazy" src={val?.media} alt={val?.media_alt} className="img-cover" />
                    </div>
                    <div className={`info ${key % 2 == 0 ? 'right' : 'left'}`}>
                      <p className="fsz14 lh-3">{val?.name}</p>
                    </div>
                  </div>
                </Link>
              ) : (
                <div className="col-lg-6">
                  <div className="cashback-banner mt-3 wow fadeInUp slow" data-wow-delay="0.2s">
                    <div className="img">
                      <img loading="lazy" src={val?.media} alt={val?.media_alt} className="img-cover" />
                    </div>
                    <div className={`info ${key % 2 == 0 ? 'right' : 'left'}`}>
                      <p className="fsz14 lh-3">{val?.name}</p>
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </section>
  )
}

export default PromotionalTwoBanner
