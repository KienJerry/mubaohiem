import { MainLayout } from '@/layouts/main-layout'
import { TNextPageWithLayout } from '@/types/layout'
import { BlogDetailPage } from '@/components/pages/blog/BlogDetailPage'
import { blogApi } from '@/services'
import Head from 'next/head'

const BlogDetail: TNextPageWithLayout = ({ res }: any) => {
  const { resDetail } = res
  return (
    <>
      <Head>
        <title>{resDetail?.og_title}</title>
      </Head>
      <BlogDetailPage data={resDetail} />
    </>
  )
}

BlogDetail.Layout = MainLayout
export default BlogDetail

export const getServerSideProps = async (context: any) => {
  const resDetail: any = await blogApi
    .getDetailBlog({
      id: context?.query?.slug,
    })
    .then((res: any) => {
      return res?.blogPost || null
    })

  if (!resDetail) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      res: {
        resDetail,
      },
    },
  }
}
