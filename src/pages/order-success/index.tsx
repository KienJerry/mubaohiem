import Head from 'next/head'
import { MainLayout } from '@/layouts/main-layout'
import { TNextPageWithLayout } from '@/types/layout'
import OrderSuccess from '@/components/pages/orderSuccess'

const OrderSuccessPage: TNextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Xác nhận đơn hàng - Mũ bảo hiểm chính hãng</title>
      </Head>
      <OrderSuccess />
    </>
  )
}

OrderSuccessPage.Layout = MainLayout
export default OrderSuccessPage
