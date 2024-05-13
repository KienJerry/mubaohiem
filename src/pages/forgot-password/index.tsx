import ForgotPasswordPage from '@/components/pages/forgotPassword'
import { MainLayout } from '@/layouts/main-layout'
import { TNextPageWithLayout } from '@/types/layout'
import Head from 'next/head'

const ForgotPassword: TNextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Quên Mật Khẩu</title>
      </Head>
      <ForgotPasswordPage />
    </>
  )
}

ForgotPassword.Layout = MainLayout
export default ForgotPassword
