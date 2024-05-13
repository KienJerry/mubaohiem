import React from 'react'
import { TNextPageWithLayout } from '@/types/layout'
import { MainLayout } from '@/layouts/main-layout'
import ContactPage from '@/components/pages/contact'
import Head from 'next/head'

const Contact: TNextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Liên Hệ</title>
      </Head>
      <ContactPage />
    </>
  )
}

Contact.Layout = MainLayout
export default Contact
