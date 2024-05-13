import React from 'react'
import homeApi from '@/services/home'
import { useQuery } from 'react-query'
import Image from 'next/image'

type TProps = {
  children?: React.ReactNode | any,
  Advertisement?: any,
}

export const Main: React.FC<TProps> = ({ children, Advertisement }) => {
  const { data: bannerAdvertisement } = useQuery<Banner[]>(['banner-quang-cao'], {
    queryFn: async () => {
      return await homeApi
        .getSlider({
          eq: 'banner-quang-cao',
        })
        .then((res: any) => res?.Slider?.items?.[0]?.Banner?.items)
    },
    staleTime: 30000,
  })

  return (
    <React.Fragment>
      <main className={'app-main'} style={{ zIndex: '1' }}>
        <div className="box-main">
          {Advertisement && (
            <div className="MN-banner-advertisement left">
              {bannerAdvertisement?.[0]?.media ? (
                <Image
                  src={bannerAdvertisement?.[0]?.media}
                  fill
                  alt={bannerAdvertisement?.[0]?.media_alt}
                />
              ) : null}
            </div>
          )}
          <div className="app-content" style={{ padding: '0' }}>
            {children}
          </div>
          {Advertisement && (
            <div className="MN-banner-advertisement right">
              {bannerAdvertisement?.[1]?.media ? (
                <Image
                  src={bannerAdvertisement?.[1]?.media}
                  fill
                  alt={bannerAdvertisement?.[1]?.media_alt}
                />
              ) : null}
            </div>
          )}
        </div>
      </main>
    </React.Fragment>
  )
}
