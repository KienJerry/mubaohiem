import RegisterPage from '@/components/pages/register'
import { MainLayout } from '@/layouts/main-layout'
import { TNextPageWithLayout } from '@/types/layout'
import React, { useEffect } from 'react'
import router from 'next/router'
import { COOKIE_KEY } from '@/services/graphql'
import Cookies from 'js-cookie'
import Head from 'next/head'

const Register: TNextPageWithLayout = () => {
  useEffect(() => {
    if (Cookies.get(COOKIE_KEY?.ACCESS_TOKEN)) {
      router.push(`/`)
    }
  }, [])
  return (
    <>
      <Head>
        <title>Đăng Ký</title>
      </Head>
      <RegisterPage />
    </>
  )
}

Register.Layout = MainLayout
export default Register
