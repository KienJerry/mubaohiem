import NotFoundPage from '@/components/pages/404'
import { MainLayout } from '@/layouts/main-layout'
import { TNextPageWithLayout } from '@/types/layout'

const Index: TNextPageWithLayout = () => {
  return <NotFoundPage />
}

Index.Layout = MainLayout

export default Index