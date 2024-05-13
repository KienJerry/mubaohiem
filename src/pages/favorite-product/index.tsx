import React from 'react'

import { FavoriteProductPage } from '@/components/pages/favorite-product'
import { MainLayout } from '@/layouts/main-layout'
import { TNextPageWithLayout } from '@/types/layout'
import Head from 'next/head'

const Index: TNextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Sản Phẩm Yêu Thích</title>
      </Head>
      <FavoriteProductPage />
    </>
  )
}

Index.Layout = MainLayout

export default Index
