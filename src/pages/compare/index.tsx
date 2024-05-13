import { ComparePage } from '@/components/pages/compare'
import { MainLayout } from '@/layouts/main-layout'
import { TNextPageWithLayout } from '@/types/layout'
import Head from 'next/head'

const Index: TNextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>So Sánh Sản Phẩm</title>
      </Head>
      <ComparePage />
    </>
  )
}

Index.Layout = MainLayout

export default Index
