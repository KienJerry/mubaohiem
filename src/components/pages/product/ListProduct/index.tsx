import { FC, useEffect, useState } from 'react'

import classNames from 'classnames'
import Pagination from './Pagination'
import { useQuery } from 'react-query'
import productAPI, { FilterProducts } from '@/services/product'

import FiltersLeftSide from './FiltersLeftSide'
import ProductCard from '@/components/productCard'
import EmptyData from '@/components/boxLayout/EmptyData'
import LoadingData from '@/components/boxLayout/LoadingData'

import { FOUR_ITEMS, TWO_ITEMS, EMPTY_ITEM } from '../constants'
import SwiperListProduct from '@/components/Swiper/SwiperListProduct'
import FilterCenter from './FilterCenter'
import { useWindowSize } from '@/hooks/useWindowSize'
import homeApi from '@/services/home'
import { useSearchParams } from 'next/navigation'

type Option = {
  count: number,
  label: string,
  value: string,
  swatch_data?:
    | {
        type: string,
        value: string,
      }
    | any,
}

type ListProduct = {
  products: ResProduct | any,
  filter: FilterProducts,
  isFetchingData?: boolean,
  currentCategory: CategoryMainChildren | null,
  contentPageRef?: React.RefObject<HTMLDivElement>,
  onActionFilter: {
    onClearFilter: () => void,
    onChangeFilter: (key: string, value: string) => void,
    onChangePriceRange: (min: number, max: number) => void,
    onChangeCategory: (category: CategoryMainChildren | CategoryChildren | null) => void,
  },
  onChangeCurrentPage: (pageNumber: number) => void,
}

/* eslint-disable @next/next/no-img-element */
const ListProduct: FC<ListProduct> = ({
  filter,
  products,
  isFetchingData = false,
  contentPageRef,
  onActionFilter,
  currentCategory,
  onChangeCurrentPage,
}) => {
  const [viewMode, setViewMode] = useState<number>(FOUR_ITEMS)

  const [aggregations, setAggregations] = useState<Aggregation[]>([])
  const [categoriesBrands, setCategoriesBrands] = useState<CategoriesBrands>()

  const { isMobile } = useWindowSize()

  const searchParams = useSearchParams()
  const search = searchParams.get('search')

  const { data: dataProductBestSeller, isLoading } = useQuery<ResProduct>(
    ['GET_PRODUCTS', 'BEST_SELLER', currentCategory?.uid],
    {
      queryFn: async () => {
        const _filter = currentCategory
          ? {
              category_uid: {
                in: [currentCategory?.uid],
              },
            }
          : {}

        return await productAPI
          .getProducts({
            filter: _filter,
            pageSize: 20,
            currentPage: 1,
            sort: {
              best_seller: 'DESC',
            },
          })
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

  useEffect(() => {
    if (products === undefined) return () => {}

    if (products?.aggregations?.length > EMPTY_ITEM) {
      setAggregations(products?.aggregations)
    }

    if (products?.categories_brands) setCategoriesBrands(products?.categories_brands)

    return
  }, [products])

  const handleFormatAggregations = (
    aggregations: Aggregation[],
    categories_brands: CategoriesBrands | undefined
  ): Aggregation[] => {
    if (!aggregations) return []
    let _aggregations = [...aggregations]
    const categoryUid =
      _aggregations?.filter((aggregation) => aggregation?.attribute_code === 'category_uid') ?? []
    if (categoryUid?.length === EMPTY_ITEM) return _aggregations

    _aggregations = _aggregations.filter(
      (aggregation) => aggregation?.attribute_code !== 'category_uid'
    )

    const category: Option[] = []
    const brand: Option[] = []
    const brandUid = categories_brands?.options?.map((brand) => brand?.value)

    categoryUid?.[0]?.options?.map((item) => {
      const value = { ...item, label: `${item?.label} (${item?.count})` }
      if (brandUid?.includes(item?.value)) return brand.push(value)
      return category?.push(value)
    })
    const aggregationCategory = {
      count: 0,
      label: '',
      position: null,
      attribute_code: 'category_uid',
      ...categoryUid?.[0],
    }

    const categoryAggregation: Aggregation = {
      ...aggregationCategory,
      options: category,
    }
    const brandAggregation: Aggregation = {
      ...aggregationCategory,
      options: brand,
      label: 'Thương hiệu',
    }

    return [..._aggregations, categoryAggregation, brandAggregation]
  }

  const renderViewMode = () => {
    return (
      <div className="view-item">
        {/* <span className="s-title"> Xem dạng </span> */}
        <span
          className={classNames('v-item grid-btn', {
            active: viewMode === FOUR_ITEMS,
          })}
          onClick={() => setViewMode(FOUR_ITEMS)}>
          <i className="la la-th-large"></i>
        </span>
        <span
          className={classNames('v-item list-btn', {
            active: viewMode === TWO_ITEMS,
          })}
          onClick={() => setViewMode(TWO_ITEMS)}>
          <i className="la la-list-ul"></i>
        </span>
      </div>
    )
  }

  const renderProductsBestSeller = () => {
    if (isLoading) return <LoadingData />

    return (
      <SwiperListProduct
        products={dataProductBestSeller?.items}
        className="main-content"
        childrenClassName="best-slider6"
        slidesPerView={4}
      />
    )
  }

  const renderProductsCard = () => {
    if (isFetchingData) return <LoadingData />

    if (!products?.items || products?.items?.length === 0)
      return <EmptyData title="Không tìm thấy sản phẩm" />

    return products?.items?.map((product: Product) => {
      return (
        <div className="col-lg-3" key={product.uid}>
          <ProductCard data={product} />
        </div>
      )
    })
  }

  const renderPagination = () => {
    if (!products?.items || products?.page_info.total_pages <= 1 || products?.total_count === 0)
      return null

    return (
      <Pagination
        totalPage={products?.page_info?.total_pages}
        currentPage={products?.page_info?.current_page}
        onAction={onChangeCurrentPage}
      />
    )
  }

  return (
    <section className="tc-products-style6 box-wr bg-white mt-3 wow fadeInUp">
      <div className="row">
        <div className="col-lg-3">
          <FiltersLeftSide
            filter={filter}
            isFetchingData={isFetchingData}
            aggregations={handleFormatAggregations(aggregations, categoriesBrands) ?? []}
            priceRangeFilters={products?.priceRangeFilters}
            currentCategory={currentCategory}
            onActionFilter={onActionFilter}
            banner={bannerProd}
          />
        </div>
        <div className="col-lg-9">
          <div className="best-seller mt-lg-0">
            <h6 className="fsz-18 fw-bold text-uppercase" id="PRODUCT_SELLING">
              {currentCategory ? 'Bán chạy trong danh mục' : 'Bán chạy'}
            </h6>
            {renderProductsBestSeller()}
          </div>
          <div className="products-content" ref={contentPageRef}>
            <div className="prod-filter color-666">
              <div className="row">
                <div className="col-lg-10 relative">
                  <FilterCenter
                    filter={filter}
                    isFetchingData={isFetchingData}
                    priceRangeFilters={products?.priceRangeFilters}
                    aggregations={handleFormatAggregations(aggregations, categoriesBrands) ?? []}
                    onActionFilter={onActionFilter}
                  />
                </div>

                <div className="col-lg-2 text-lg-end mt-lg-0">{renderViewMode()}</div>
              </div>
            </div>
            <div className={classNames('products', { 'products-list': viewMode === TWO_ITEMS })}>
              {!!search ? (
                <div className="mt-3 mb-3">
                  <b>Tìm kiếm với:</b> {search}
                </div>
              ) : null}

              <div className="row">{renderProductsCard()}</div>
            </div>
            {renderPagination()}
          </div>

          {isMobile && (
            <div className="tc-products-style6">
              <div className="filters">
                <div className="addimg mt-10">
                  <img
                    src={bannerProd?.[1]?.media}
                    alt={bannerProd?.[1]?.media_alt}
                    className="img-cover"
                  />
                  <div className="inf">
                    <h6 className="fsz-24 mb-30 text-white">{bannerProd?.[1]?.name}</h6>
                    <div
                      className="price"
                      dangerouslySetInnerHTML={{ __html: bannerProd?.[1]?.caption || '' }}></div>
                    <a
                      href={bannerProd?.[1]?.link || ''}
                      className="btn-more fsz-12 text-decoration-underline text-uppercase">
                      <span className="txt">Khám phá ngay</span>
                      <span className="btn-arr">
                        <i className="btn-arr-icon --first las la-angle-right arrow"></i>
                        <i className="btn-arr-icon --second las la-angle-right arrow"></i>
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default ListProduct
