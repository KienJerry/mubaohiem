/* eslint-disable @next/next/no-img-element */
import { FC, useState } from 'react'

import Collapse from './Collapse'
import classNames from 'classnames'
import { useQuery } from 'react-query'
import categoryApi from '@/services/categories'
import PriceRangeSlider from './PriceRangeSlider'
import { FilterProducts } from '@/services/product'
import { FILTER_ATTRIBUTE_SKIP, handleSortAggregations, TYPE_COLOR_SWATCH } from '../constants'
import { Drawer } from 'antd'
import { useWindowSize } from '@/hooks/useWindowSize'

type FiltersLeftSide = {
  filter: FilterProducts,
  isFetchingData?: boolean,
  aggregations: Aggregation[],
  priceRangeFilters: priceRangeFilter,
  currentCategory: CategoryMainChildren | null,
  banner?: any,

  onActionFilter: {
    onClearFilter: () => void,
    onChangeFilter: (key: string, value: string) => void,
    onChangePriceRange: (min: number, max: number) => void,
    onChangeCategory: (category: CategoryMainChildren | CategoryChildren | null) => void,
  },
}
const FiltersLeftSide: FC<FiltersLeftSide> = ({
  filter,
  aggregations,
  currentCategory,
  priceRangeFilters,
  isFetchingData = false,
  onActionFilter,
  banner
}) => {
  const { min = 0, max = 10000000 } = priceRangeFilters ?? {}
  const { onClearFilter, onChangeFilter, onChangePriceRange, onChangeCategory } =
    onActionFilter ?? {}

  const [isRestPrice, setIsRestPrice] = useState<boolean>(false)
  const [openDrawer, setOpenDrawer] = useState<string | null>(null)
  const { isMobile } = useWindowSize()
  const { data: categories } = useQuery<Category>(['GET_CATEGORIES'], {
    queryFn: async () => {
      return await categoryApi.getCategories({}).then((res: any) => res?.categories?.items?.[0])
    },
    staleTime: 30000,
  })

  const handleGoClick = (min: number, max: number) => {
    onChangePriceRange(min, max)
  }

  const renderCategories = () => {
    const isHadChildren = currentCategory?.children_count !== '0'
    const isLastLevel = !isHadChildren && currentCategory.breadcrumbs?.length !== 0

    const renderDetailCategory = (
      textBtnBack: string,
      CategoryRender: CategoryMainChildren | undefined,
      onBackClick: () => void
    ) => {
      if (!CategoryRender) return null
      return (
        <>
          <button
            className="cat-btn fsz-12 fw-bold py-2 px-3 bg-white radius-3 hover-bg-green2"
            onClick={onBackClick}>
            <i className="la la-angle-left me-2"></i> {textBtnBack}
          </button>

          <div className="cat-list">
            <div className="d-flex">
              {CategoryRender?.image ? (
                <img
                  src={CategoryRender?.image}
                  alt="category icon"
                  width={16}
                  height={16}
                  className="me-1"
                />
              ) : null}
              <h6 className={classNames('fsz-14 fw-bold mb-title-sm ')}>{CategoryRender?.name}</h6>
            </div>
            <ul>
              {CategoryRender?.children?.map((category) => {
                return (
                  <li key={category?.uid}>
                    <button
                      onClick={() => onChangeCategory(category)}
                      className={classNames({ active: category?.uid === currentCategory?.uid })}>
                      {category?.name}
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </>
      )
    }

    if (!!currentCategory && isHadChildren)
      return renderDetailCategory('Tất cả danh mục', currentCategory, () => {
        onChangeCategory(null)
      })

    if (isLastLevel) {
      const parentCurrent = categories?.children?.filter(
        (category) => category?.uid === currentCategory?.breadcrumbs?.[0]?.category_uid
      )?.[0]
      return renderDetailCategory('Trở về', parentCurrent, () => {
        onChangeCategory(parentCurrent ?? null)
      })
    }

    return (
      <div className="all-category">
        {categories?.children?.map((category) => {
          return (
            <button
              key={category?.uid}
              onClick={() => onChangeCategory(category)}
              className={classNames({ active: category?.uid === currentCategory?.uid })}>
              <div>
                {category?.image ? (
                  <img
                    src={category?.image}
                    alt="category icon"
                    width={16}
                    height={16}
                    className="me-1"
                  />
                ) : null}{' '}
                {category?.name}
              </div>

              {category?.children_count !== '0' ? <i className="la la-angle-down"></i> : null}
            </button>
          )
        })}
      </div>
    )
  }

  const renderTagsFilterSelected = () => {
    const sortAggregations = handleSortAggregations(aggregations)

    return sortAggregations?.map((aggregation) => {
      const attributeCode = aggregation?.attribute_code

      return aggregation?.options?.map((option) => {
        if (!(filter as Record<string, any>)?.[attributeCode]?.in?.includes(option?.value))
          return null

        return (
          <span className="selected-item" key={option?.value}>
            {`${option?.label} `}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-x"
              onClick={() => onChangeFilter(attributeCode, option?.value)}>
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </span>
        )
      })
    })
  }

  const renderFilterItem = () => {
    const sortAggregations = handleSortAggregations(aggregations)

    return sortAggregations?.map((aggregation) => {
      if (FILTER_ATTRIBUTE_SKIP?.includes(aggregation?.attribute_code)) return null

      const attributeCode = aggregation?.attribute_code
      return (
        <Collapse title={aggregation?.label} key={`${attributeCode}_${aggregation?.label}`}>
          <div className="box-options">
            {aggregation?.options?.map((option) => {
              if (attributeCode === 'color') {
                if (option?.swatch_data?.type === TYPE_COLOR_SWATCH.COLOR) {
                  return (
                    <div
                      className={classNames('color-option', {
                        active: (filter as Record<string, any>)?.[attributeCode]?.in?.includes(option?.value),
                      })}
                      style={{ background: option?.swatch_data?.value }}
                      key={option?.value}
                      onClick={() => onChangeFilter(attributeCode, option?.value)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-check">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>
                  )
                }

                if (option?.swatch_data?.type === TYPE_COLOR_SWATCH.IMAGE) {
                  return (
                    <div
                      className={classNames('img-option-color', {
                        active: (filter as Record<string, any>)?.[attributeCode]?.in?.includes(option?.value)
                      })}
                      key={option?.value}
                      onClick={() => onChangeFilter(attributeCode, option?.value)}>
                      <img src={option?.swatch_data?.value} alt={option?.label} />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-check">
                        <path d="M20 6 9 17l-5-5" />
                      </svg>
                    </div>
                  )
                }
              }

              return (
                <button
                  key={option?.value}
                  className={classNames({
                    active: (filter as Record<string, any>)?.[attributeCode]?.in?.includes(option?.value)
                  })}
                  onClick={() => onChangeFilter(attributeCode, option?.value)}>
                  {option?.label}
                </button>
              )
            })}
          </div>
        </Collapse>
      )
    })
  }

  const renderBanner = () => {
    if (isMobile) return null

    return (
      <div className="addimg mt-16">
        <img src={banner?.[1]?.media} alt={banner?.[1]?.media_alt} className="img-cover" />
        <div className="inf">
          <h6 className="fsz-24 mb- text-white">
            {banner?.[1]?.name}
            {/* <strong> OKODo </strong> hero 11+ <br /> 5K wireless */}
          </h6>
          <div className="price" dangerouslySetInnerHTML={{ __html: banner?.[1]?.caption || '' }}>
            {/* <p className="fsz-12 color-999 text-uppercase"> from </p>
            <h5 className="fsz-30 fw-400"> $169 </h5> */}
          </div>
          {banner?.[1]?.link &&
          <a
            href={banner?.[1]?.link || ''}
            className="btn-more fsz-12 text-decoration-underline text-uppercase">
            <span className="txt">Khám phá ngay</span>
            <span className="btn-arr">
              <i className="btn-arr-icon --first las la-angle-right arrow"></i>
              <i className="btn-arr-icon --second las la-angle-right arrow"></i>
            </span>
          </a>
          }
        </div>
      </div>
    )
  }

  const renderContentPage = () => {
    if (isMobile)
      return (
        <div className="filters-wrap-btn__mobile " >
          <button
            className="btn-category btn-prod text-uppercase text-center addCart mb-0" 
            onClick={() => {
                setOpenDrawer('category')
              }}
            >
            <span
              className="text-nowrap"
              >
              Danh mục
            </span>
          </button>
          <button
           onClick={() => {
                setOpenDrawer('filter')
            }} 
           className="btn-filter btn-prod text-uppercase text-center addCart mb-0"
           >
            <span
              className="text-nowrap"
             >
              Bộ lọc
            </span>
          </button>
        </div>
      )

    return (
      <>
        <div className="category-box MN-category-box">
          <h6 className="fsz-18 fw-bold text-uppercase mb-title"> Danh mục </h6>

          {renderCategories()}
        </div>
        <div className="MN-filters-box">
          <div className="filter-box mt-16">
            <div className="title mb-title">
              <h6 className="fsz-18 fw-bold text-uppercase mb-0"> Bộ lọc </h6>
              <button
                className="rest-btn hover-green2 none-border bg-none"
                onClick={() => {
                  onClearFilter()
                  setIsRestPrice(true)
                }}>
                <i className="la la-sync me-1"></i> Đặt lại
              </button>
            </div>
            <div className="selected-filters">{renderTagsFilterSelected()}</div>
            <div className="filter-groups MN-filter-box">
              {renderFilterItem()}

              <Collapse title="Mức giá">
                <div className="group-body">
                  <PriceRangeSlider
                    min={Number(min)}
                    max={Number(max)}
                    isRest={isRestPrice}
                    onGoClick={handleGoClick}
                    onRestPrice={() => setIsRestPrice(false)}
                  />
                </div>
              </Collapse>
            </div>
          </div>

          {isFetchingData ? (<div className="overlay"></div>) : null}
        </div>
      </>
    )
  }

  return (
    <div className="filters">
      <Drawer
        title={openDrawer == 'category' ? 'Danh mục' : 'Bộ lọc'}
        placement="bottom"
        onClose={() => setOpenDrawer(null)}
        open={!!openDrawer}
        className="filter-products"
        extra={
          openDrawer == 'filter' ? (
            <button
              className="rest-btn hover-green2 none-border bg-none"
              onClick={() => {
                onClearFilter()
                setIsRestPrice(true)
              }}>
              <i className="la la-sync me-1"></i> Đặt lại
            </button>
          ) : undefined
        }>
        <div className="tc-products-style6">
          <div className="filters">
            {openDrawer == 'category' ? (
              <div className="category-box MN-category-box">{renderCategories()}</div>
            ) : (
              <div className="filter-box">
                <div className="selected-filters">{renderTagsFilterSelected()}</div>
                <div className="filter-groups MN-filter-box">
                  {renderFilterItem()}

                  <Collapse title="Mức giá">
                    <div className="group-body">
                      <PriceRangeSlider
                        min={Number(min)}
                        max={Number(max)}
                        isRest={isRestPrice}
                        onGoClick={handleGoClick}
                        onRestPrice={() => setIsRestPrice(false)}
                      />
                    </div>
                  </Collapse>
                </div>
              </div>
            )}
          </div>
        </div>
      </Drawer>

      {renderContentPage()}

      {renderBanner()}
    </div>
  )
}

export default FiltersLeftSide
