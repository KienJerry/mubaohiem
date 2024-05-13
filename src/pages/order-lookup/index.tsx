import { OrderLookupPage } from '@/components/pages/orderLookup'
import { MainLayout } from '@/layouts/main-layout'
import { TNextPageWithLayout } from '@/types/layout'
import Head from 'next/head'

const OrderLookup: TNextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Tra cứu đơn hàng</title>
      </Head>
      <OrderLookupPage />
    </>
  )
}

OrderLookup.Layout = MainLayout
export default OrderLookup
