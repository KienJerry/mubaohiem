/* eslint-disable @next/next/no-img-element */
import { FC, useEffect, useReducer, useRef } from 'react'

import Head from 'next/head'
import homeApi from '@/services/home'
import { useQuery } from 'react-query'
import ListProduct from './ListProduct'

import { PAGE_SIZE } from './constants'
import { useRouter } from 'next/router'
import categoryApi from '@/services/categories'
import Breadcrumb from '@/components/Breadcrumb'

import { useSearchParams } from 'next/navigation'
import PopularCategories from './PopularCategories'
import RecentlyViewed from '@/components/RecentlyViewed'
import SwiperEffectFade from '@/components/Swiper/SwiperEffectFade'

import productAPI, { VariableGetProducts, FilterProducts } from '@/services/product'

type ProductPage = {
  res?: {
    categories: Category,
    products: ResProduct,
  },
}

type ProductConfigState = {
  // products?: ResProduct | any,
  productQuery: VariableGetProducts,
  currentCategory: CategoryMainChildren | null,
}

type ProductConfigAction = {
  type: string,
  value?: any,
}

const productReducer = (state: ProductConfigState, action: ProductConfigAction) => {
  switch (action.type) {
    // case 'SET_PRODUCTS':
    //   return { ...state, products: action?.value }
    case 'SET_PRODUCT_QUERY':
      return { ...state, productQuery: action?.value }
    case 'SET_CATEGORY':
      return {
        ...state,
        productQuery: action?.value?.productQuery,
        currentCategory: action?.value?.currentCategory,
      }

    default:
      return state
  }
}

export const ProductPage: FC<ProductPage> = () => {
  const contentRef = useRef<HTMLDivElement>(null)

  const router = useRouter()

  const searchParams = useSearchParams()
  const categoryUid = searchParams.get('category_uid')
  const search = searchParams.get('search')

  const { data: categories } = useQuery<Category>(['GET_CATEGORIES'], {
    queryFn: async () => {
      return await categoryApi.getCategories({}).then((res: any) => res?.categories?.items?.[0])
    },
    staleTime: 30000,
  })

  const [productConfig, productConfigDispatch] = useReducer<
    (state: ProductConfigState, action: ProductConfigAction) => ProductConfigState
  >(productReducer, {
    currentCategory:
      categories?.children?.filter(
        (category: CategoryMainChildren) => category.uid === categoryUid
      )?.[0] ?? null,
    productQuery: {
      pageSize: PAGE_SIZE,
      currentPage: 1,
      filter: categoryUid
        ? {
            category_uid: {
              in: [categoryUid],
            },
          }
        : {},
    },
  })

  const { data: products, isLoading: isLoadingProducts } = useQuery<ResProduct>(
    ['GET_PRODUCTS', productConfig?.currentCategory?.uid, productConfig?.productQuery],
    {
      queryFn: async () => {
        return await productAPI
          .getProducts(productConfig?.productQuery)
          .then((res: any) => res?.products)
      },
    }
  )

  const { data: bannerProd } = useQuery<Banner[]>(['banner-product'], {
    queryFn: async () => {
      return await homeApi
        .getSlider({
          eq: 'banner-products',
        })
        .then((res: any) => {
          return res?.Slider?.items?.[0]?.Banner?.items
        })
    },
    staleTime: 30000,
  })

  const scrollToContentPage = () => {
    // contentRef.current?.scrollIntoView?.({ behavior: 'smooth' })

    const element = contentRef.current;

    if (element) {
      const elementPosition = element?.getBoundingClientRect()?.top + window?.scrollY;

      const offset = -135;
      window.scrollTo({
        top: elementPosition + offset,
        behavior: 'smooth'
      });
    }
  }

  useEffect(() => {
    if (!search) return () => {}

    productConfigDispatch({
      type: 'SET_PRODUCT_QUERY',
      value: {
        filter: {},
        search: search,
        currentPage: 1,
        pageSize: PAGE_SIZE,
      },
    })
    scrollToContentPage()
    return
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])

  const currentCategories = categoryUid
    ? categories?.children?.filter((category) => category.uid === categoryUid)
    : categories?.children

  const { data: bannerBig } = useQuery<Banner[]>(['home-page-big-80'], {
    queryFn: async () => {
      return await homeApi
        .getSlider({
          eq: 'home-page-big-80',
        })
        .then((res: any) => {
          return res?.Slider?.items?.[0]?.Banner?.items
        })
    },
    staleTime: 30000,
  })

  // const { mutate: mutateGetDataProduct, isLoading: isFetchingData } = useMutation({
  //   mutationFn: async (variable: VariableGetProducts) => {
  //     return await productAPI.getProducts(variable).then((res: any) => res?.products)
  //   },
  //   onSuccess: (data: ResProduct) => {
  //     if (
  //       data?.items?.length === EMPTY_ITEM &&
  //       productConfig.products?.aggregations?.length > EMPTY_ITEM
  //     )
  //       return productConfigDispatch({
  //         type: 'SET_PRODUCTS',
  //         value: { ...data, aggregations: productConfig.products?.aggregations },
  //       })
  //     return productConfigDispatch({ type: 'SET_PRODUCTS', value: data })
  //   },
  // })

  const handleReWriteUrlByFilter = (filter: Record<string, any>) => {
    const entriesFilter = Object.entries(filter) ?? []
    let queryFilter = {}
    entriesFilter?.map((val: any) => {
      queryFilter = { ...queryFilter, [val?.[0]]: val?.[1]?.in }
    })

    return router.push(
      {
        pathname: '/products',
        query: { ...queryFilter },
      },
      undefined,
      { shallow: true }
    )
  }

  const handleChangeCurrentPage = (pageIndex: number) => {
    productConfigDispatch({
      type: 'SET_PRODUCT_QUERY',
      value: { ...productConfig.productQuery, currentPage: pageIndex },
    })
  }

  const handleChangeCurrentCategory = (
    category: CategoryMainChildren | CategoryChildren | null
  ) => {
    let productQuery = { ...productConfig.productQuery, currentPage: 1 }
    let filterProductQuery = { ...productQuery.filter }

    productQuery = {
      ...productQuery,
      filter: { ...filterProductQuery, category_uid: { in: [category?.uid] } },
    }

    if (category === null) {
      delete filterProductQuery?.['category_uid']
      productQuery = { ...productQuery, filter: filterProductQuery }
    }

    handleReWriteUrlByFilter(productQuery?.filter)
    productConfigDispatch({
      type: 'SET_CATEGORY',
      value: {
        productQuery,
        currentCategory: category,
      },
    })
  }

  const handleToggleFilter = (key: string, value: string) => {
    const filter = productConfig.productQuery.filter
    if (key in filter) {
      const inValue = [...(filter as Record<string, any>)?.[key]?.in]
      if (!inValue?.includes(value))
        return {
          ...filter,
          [key]: {
            in: [...inValue, value],
          },
        }

      if (inValue?.length === 1) {
        delete (filter as Record<string, any>)?.[key];
        return filter
      }

      return {
        ...filter,
        [key]: {
          in: inValue?.filter((item) => item !== value),
        },
      }
    }

    return {
      ...filter,
      [key]: {
        in: [value],
      },
    }
  }

  const handleChangeFilterAndCallApi = (filter: FilterProducts) => {
    const productQuery = {
      filter,
      currentPage: 1,
      pageSize: PAGE_SIZE,
    }

    handleReWriteUrlByFilter(filter)
    return productConfigDispatch({
      type: 'SET_PRODUCT_QUERY',
      value: productQuery,
    })
  }

  const handleClearFilter = () => {
    // const filter = {
    //   ...productConfig.productQuery.filter,
    // }
    // if ('category_uid' in filter)
    //   return handleChangeFilterAndCallApi({
    //     category_uid: filter?.category_uid,
    //   })

    return handleChangeFilterAndCallApi({})
  }

  const handleChangeFilter = (key: string, value: string) => {
    const filter = handleToggleFilter(key, value)
    return handleChangeFilterAndCallApi(filter)
  }

  const handleFilterPriceRange = (min: number, max: number) => {
    const filter = {
      ...productConfig.productQuery.filter,
      price: {
        from: min + '',
        to: max + '',
      },
    }
    return handleChangeFilterAndCallApi(filter)
  }

  const renderBreadcrumb = () => {
    let breadCrumbValue = [
      {
        title: 'Trang chủ',
        href: '/',
      },
      {
        title: 'Sản phẩm',
        href: '/products',
      },
    ]

    if (productConfig?.currentCategory)
      breadCrumbValue = [
        ...breadCrumbValue,
        {
          title: productConfig?.currentCategory?.name ?? '',
          href: '#',
        },
      ]

    return <Breadcrumb items={breadCrumbValue} />
  }

  return (
    <div className="home-style3">
      <Head>
        <title>{productConfig?.currentCategory?.name ?? 'Sản phẩm - Mũ bảo hiểm'}</title>
      </Head>
      {renderBreadcrumb()}

      <section className="tc-header-style6 box-wr bg-white mt-3 wow fadeInUp">
        {categoryUid ? (
          <h6 className="fsz-18 fw-bold text-uppercase mb-title">{currentCategories?.[0]?.name}</h6>
        ) : null}

        <div className="row gx-2">
          <div className="col-lg-8">
            <SwiperEffectFade className="header-slider6 short-banner" data={bannerBig ?? []} />
          </div>
          <div className="col-lg-4 mt-3 mt-lg-0">
            <div className="sub-banner">
              <div className="img h-200">
                <img
                  src={bannerProd?.[0]?.media}
                  alt={bannerProd?.[0]?.media_alt}
                  className="img-cover"
                />
              </div>
              <div className="info text-white">
                <h6 className="sub-title fsz-20 text-capitalize fw-600">{bannerProd?.[0]?.name}</h6>
                {bannerProd?.[0]?.link && (
                  <a
                    href={bannerProd?.[0]?.link}
                    className="butn px-3 py-2 bg-green2 text-white radius-4 fw-500 fsz-12 text-uppercase w-fit">
                    <span> Mua ngay </span>
                  </a>
                )}
                {/* <small className="fsz-10 text-uppercase color-999">from</small>
                    <h5 className="fsz-24 color-green2 fw-400">$169</h5> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <PopularCategories currentCategory={productConfig.currentCategory} onChangeCategory={handleChangeCurrentCategory} />

      <ListProduct
        contentPageRef={contentRef}
        isFetchingData={isLoadingProducts}
        products={products}
        filter={productConfig.productQuery?.filter}
        currentCategory={productConfig.currentCategory}
        onChangeCurrentPage={handleChangeCurrentPage}
        onActionFilter={{
          onClearFilter: handleClearFilter,
          onChangeFilter: handleChangeFilter,
          onChangePriceRange: handleFilterPriceRange,
          onChangeCategory: handleChangeCurrentCategory,
        }}
      />

      <RecentlyViewed />
    </div>
  )
}
