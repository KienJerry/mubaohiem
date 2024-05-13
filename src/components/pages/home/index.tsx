import { FC } from 'react'

import SubNavHome from './SubNavHome'
import HotCombo from '@/components/pages/home/HotCombo'
import BannerHome from '@/components/pages/home/BannerHome'
import DealsOfDay from '@/components/pages/home/DealsOfDay'

import TopProduct from '@/components/pages/home/TopProduct'
import BestSeller from '@/components/pages/home/BestSeller'
// import BrandCards from "@/components/BrandCards"
import RecentlyViewed from '@/components/RecentlyViewed'

import BrandAndCategory from '@/components/pages/home/BrandAndCategory'
// import ShortIntroduction from "@/components/ShortIntroduction"
// import PromotionalBanners from '@/components/PromotionalBanners'
import PromotionalTwoBanner from '@/components/pages/home/PromotionalBanners/PromotionalTwoBanner'
import { useQuery } from 'react-query'
import {
  __getDataLocal,
  __RemoveItemLocal,
  __CreateDataLocal,
} from '@/helper/local_helper/localStogare'

import homeApi from '@/services/home'
import categoryApi from '@/services/categories'

import storeConfigAPI from '@/services/storeConfig'
import productAPI from '@/services/product'

type HomePage = {
  res: {
    bannersBig?: Banner[],
    bannersSmall?: Banner[],
    categories: Category,
    storeConfig: StoreConfig,
    resProductDaily: ResProductDaily,
  },
}

const HomePage: FC<HomePage> = () => {
  const { data: bannersBig } = useQuery({
    queryKey: ['bannersBig'],
    queryFn: async () => {
      const res: any = await homeApi.getSlider({
        eq: 'home-page-big-80',
      })
      return res?.Slider?.items?.[0]?.Banner?.items || []
    },
  })

  const { data: bannersSmall } = useQuery({
    queryKey: ['bannersSmall'],
    queryFn: async () => {
      const res: any = await homeApi.getSlider({
        eq: 'home-page-banner-small',
      })
      return res?.Slider?.items?.[0]?.Banner?.items || []
    },
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const res: any = await categoryApi.getCategories({})
      return res?.categories?.items?.[0] || []
    },
  })

  const { data: storeConfig }: any = useQuery({
    queryKey: ['storeConfig'],
    queryFn: async () => {
      const res: any = await storeConfigAPI.getStoreConfig()
      return res
    },
  })

  const { data: resProductDaily }: any = useQuery({
    queryKey: ['resProductDaily'],
    queryFn: async () => {
      return await productAPI.getProductDailySales().then((respon: any) => respon?.DailySales)
    },
  })

  // const { bannersBig = [], bannersSmall = [], categories, resProductDaily, storeConfig } = res
  const sectionCategoryHomepage = storeConfig?.storeConfig?.section_category_homepage ?? {}
  const bestCategory = sectionCategoryHomepage?.best ?? ''
  const topCategory = sectionCategoryHomepage?.top ?? ''

  return (
    <div>
      <SubNavHome />
      <BannerHome
        dataBanner={{
          bannersBig,
          bannersSmall,
        }}
        categories={categories}
      />
      <BrandAndCategory />
      <DealsOfDay resProductDaily={resProductDaily} />
      {/* <PromotionalBanners /> */}
      <TopProduct />
      <HotCombo />
      <BestSeller categoryId={bestCategory} id="PRODUCT" />
      <BestSeller categoryId={topCategory} id="ACCESSORY" />
      {/* <BrandCards /> */}
      <PromotionalTwoBanner />
      <RecentlyViewed />
      {/* <ShortIntroduction /> */}
    </div>
  )
}

export default HomePage
