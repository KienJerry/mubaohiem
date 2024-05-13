import React from 'react'
import { useQuery } from 'react-query'
import authenApi from '@/services/authenticate.queries'
import Image from 'next/image'

const SocialPage = () => {

  const {
    data: dataSocialAuth,
  }: {
    data?: any
    isLoading?: boolean
  } = useQuery({
    queryKey: ['socialLoginUrl'],
    queryFn: async () => {
      const res: any = await authenApi.SocialAuth();
      return res?.socialLoginUrl
    }
  })

  return (
    <div className="wrapper-auth-social">
      <div className="ctn-title">
        <div className="line"></div>
        <p>Đăng nhập bằng</p>
        <div className="line"></div>
      </div>
      <div className="div-socials">
        {dataSocialAuth?.map((val: any) => {
          return(
            <a href={val.login_url} key={val.key}>
              <Image fill src={ val.key == 'facebook' ?'/assets/images/logos/facebook.svg' : '/assets/images/logos/google.svg'} alt="icon google" />
            </a>
          )
        })}
        {/* <a href={dataSocialAuth?.[0]?.login_url}>
              <img src={'/assets/images/logos/google.svg'} alt="icon google" />
            </a> */}
      </div>
    </div>
  )
}

export default SocialPage
