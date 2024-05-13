import ProfilePage from '@/components/pages/profile'
import { MainLayout } from '@/layouts/main-layout'
import { TNextPageWithLayout } from '@/types/layout'
import React, { useEffect } from 'react'
import router from 'next/router'
import { COOKIE_KEY } from '@/services/graphql'
import Cookies from 'js-cookie'
import Head from 'next/head'

const Profile: TNextPageWithLayout = () => {
  useEffect(() => {
    if (!Cookies.get(COOKIE_KEY?.ACCESS_TOKEN)) {
      router.push(`/login`)
    }
  }, [])
  return (
    <>
      <Head>
        <title>Thông Tin Tài Khoản</title>
      </Head>
      <ProfilePage />
    </>
  )
}

Profile.Layout = MainLayout
export default Profile
