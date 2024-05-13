import { MainLayout } from '@/layouts/main-layout'
import { TNextPageWithLayout } from '@/types/layout'
import { ProductPage } from '@/components/pages/product'
// import categoryApi from '@/services/categories'
// import productAPI from '@/services/product'
// import { PAGE_SIZE } from '@/components/pages/product/constants'

const Index: TNextPageWithLayout = () => {
  return <ProductPage />
}

Index.Layout = MainLayout

export default Index

// export const getServerSideProps = async (context: any) => {
//   const categories: any = await categoryApi
//     .getCategories({})
//     .then((res: any) => res?.categories?.items?.[0])

//   const search = context?.query?.search

//   const productVariable = {
//     filter: !!context?.query?.category_uid
//       ? {
//           category_uid: {
//             in: [context?.query?.category_uid],
//           },
//         }
//       : {},
//     pageSize: PAGE_SIZE,
//     currentPage: 1,
//     ...(!search ? {} : { search: search }),
//   }

//   const products: any = await productAPI
//     .getProducts(productVariable)
//     .then((res: any) => res?.products)

//   return {
//     props: {
//       res: {
//         categories,
//         products: products ?? {},
//       },
//     },
//   }
// }
