import Head from 'next/head'
import HomePage from '@/components/pages/home'

import { MainLayout } from '@/layouts/main-layout'

const Index: any = ({ res }: any) => {
  return (
    <>
      <Head>
        <title>Mũ bảo hiểm chính hãng</title>
      </Head>
      <HomePage res={res} />
    </>
  )
}

export const getServerSideProps = async () => {
  // const bannersBig: any = await homeApi
  //   .getSlider({
  //     eq: 'home-page-big-80',
  //   })
  //   .then((res: any) => {
  //     return res?.Slider?.items?.[0]?.Banner?.items
  //   })

  // const bannersSmall: any = await homeApi
  //   .getSlider({
  //     eq: 'home-page-banner-small',
  //   })
  //   .then((res: any) => {
  //     return res?.Slider?.items?.[0]?.Banner?.items
  //   })

  // const categories: any = await categoryApi
  //   .getCategories({})
  //   .then((res: any) => res?.categories?.items?.[0])

  // const storeConfig: any = await storeConfigAPI.getStoreConfig()

  // const resProductDaily: any = await productAPI
  //   .getProductDailySales()
  //   .then((res: any) => res?.DailySales)

  return {
    props: {
      res: {
        // bannersBig: bannersBig ?? [],
        // bannersSmall: bannersSmall ?? [],
        // categories,
        // storeConfig,
        // resProductDaily: resProductDaily ?? {},
      },
    },
  }
}

Index.Layout = MainLayout

Index.Layout.defaultProps = {
  Advertisement: true,
}

export default Index
