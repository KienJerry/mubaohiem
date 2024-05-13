import Head from 'next/head'
import CartPage from '@/components/pages/cart'
import { MainLayout } from '@/layouts/main-layout'
import { TNextPageWithLayout } from '@/types/layout'

const Cart: TNextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Giỏ hàng - Mũ bảo hiểm chính hãng</title>
      </Head>
      <CartPage />
    </>
  )
}

Cart.Layout = MainLayout
export default Cart
