import Head from 'next/head'
import productAPI from '@/services/product'
import { MainLayout } from '@/layouts/main-layout'
import { TNextPageWithLayout } from '@/types/layout'
import ProductDetailPage from '@/components/pages/product/ProductDetailPage'
import { PAGE_SIZE } from '@/components/pages/product/constants'

const ProductDetail: TNextPageWithLayout = ({ res }: any) => {
  return (
    <>
      <Head>
        <title>{res?.productDetail?.items?.[0]?.name ?? 'Chi tiết sản phẩm'}</title>
      </Head>
      <ProductDetailPage res={res} />
    </>
  )
}

ProductDetail.Layout = MainLayout
export default ProductDetail

export const getStaticPaths = async () => {
  const paths: { params: { detail: string } }[] = await productAPI
    .getProducts({
      filter: {},
      currentPage: 1,
      pageSize: PAGE_SIZE,
    })
    .then((res: any) =>
      res?.products?.items?.map((product: Product) => ({
        params: { detail: product?.url_key + '' ?? '' },
      }))
    )

  return {
    paths,
    fallback: 'blocking',
  }
}

export const getStaticProps = async (context: any) => {
  const { params } = context

  const productDetail: any = await productAPI
    .getProductDetail({
      filter: {
        url_key: {
          eq: params?.detail ?? '',
        },
      },
    })
    .then((res: any) => res?.products)

  return {
    props: {
      res: {
        productDetail: productDetail ?? {},
      },
    },
  }
}

// export const getServerSideProps = async (context: any) => {
//   const productDetail: any = await productAPI
//     .getProductDetail({
//       filter: {
//         url_key: {
//           eq: context?.query?.detail ?? '',
//         },
//       },
//     })
//     .then((res: any) => res?.products)

//   return {
//     props: {
//       res: {
//         productDetail: productDetail ?? {},
//       },
//     },
//   }
// }
