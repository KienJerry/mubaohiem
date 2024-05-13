import LoginPage from '@/components/pages/login'
import { MainLayout } from '@/layouts/main-layout'
import { TNextPageWithLayout } from '@/types/layout'
import React, { useEffect } from 'react'
import router from 'next/router'
import { COOKIE_KEY } from '@/services/graphql'
import Cookies from 'js-cookie'
import Head from 'next/head'

const Login: TNextPageWithLayout = () => {
  useEffect(() => {
    if (Cookies.get(COOKIE_KEY?.ACCESS_TOKEN)) {
      router.push(`/`)
    }
  }, [])
  return (
    <>
      <Head>
        <title>Đăng Nhập</title>
      </Head>
      <LoginPage/>
    </>
  )
}

Login.Layout = MainLayout
export default Login
