import Head from 'next/head'
import { MainLayout } from '@/layouts/main-layout'
import { TNextPageWithLayout } from '@/types/layout'
import CheckoutPage from '@/components/pages/checkout'

const Checkout: TNextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Thanh toán - Mũ bảo hiểm chính hãng</title>
      </Head>
      <CheckoutPage />
    </>
  )
}

Checkout.Layout = MainLayout
export default Checkout
