import React from 'react'

import { BlogPage } from '@/components/pages/blog'
import { MainLayout } from '@/layouts/main-layout'
import { TNextPageWithLayout } from '@/types/layout'
import Head from 'next/head'

const Index: TNextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Bài viết</title>
      </Head>
      <BlogPage />
    </>
  )
}

Index.Layout = MainLayout

export default Index
