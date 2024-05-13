import NewPasswordPage from '@/components/pages/newPassword'
import { MainLayout } from '@/layouts/main-layout'
import { TNextPageWithLayout } from '@/types/layout'
import Head from 'next/head'

const NewPassword: TNextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Mật khẩu mới</title>
      </Head>
      <NewPasswordPage />
    </>
  )
}

NewPassword.Layout = MainLayout
export default NewPassword
