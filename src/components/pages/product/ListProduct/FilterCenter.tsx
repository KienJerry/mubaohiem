/* eslint-disable @next/next/no-img-element */
import { FC, useRef, useState } from 'react'

import classNames from 'classnames'
import { useClickOutside } from '@/hooks'
import { FilterProducts } from '@/services/product'
import { FILTER_ATTRIBUTE_SKIP, handleSortAggregations, TYPE_COLOR_SWATCH } from '../constants'
import PriceRangeSlider from './PriceRangeSlider'

type FilterCenter = {
  filter: FilterProducts,
  isFetchingData?: boolean,
  aggregations: Aggregation[],
  priceRangeFilters: priceRangeFilter,

  onActionFilter: {
    onClearFilter: () => void,
    onChangeFilter: (key: string, value: string) => void,
    onChangePriceRange: (min: number, max: number) => void,
    onChangeCategory: (category: CategoryMainChildren | CategoryChildren | null) => void,
  },
}

const PRICE = 'price'

const FilterCenter: FC<FilterCenter> = ({
  filter,
  aggregations,
  priceRangeFilters,
  isFetchingData = false,
  onActionFilter,
}) => {
  const { min = 0, max = 10000000 } = priceRangeFilters ?? {}
  const { onChangeFilter, onChangePriceRange } = onActionFilter ?? {}

  const [filterActive, setFilterAction] = useState<
    (Aggregation & { originalAttributeCode?: string }) | undefined
  >()

  const contentRef = useRef<any>()
  const contentMobileRef = useRef<any>()
  const filterListRef = useRef<any>()

  useClickOutside([contentRef, contentMobileRef], () => setFilterAction(undefined))

  const renderOptions = (aggregation: Aggregation & { originalAttributeCode?: string }) => {
    const attributeCode = aggregation?.originalAttributeCode
      ? aggregation?.originalAttributeCode
      : aggregation?.attribute_code

    return aggregation?.options?.map((option) => {
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
    })
  }

  const renderFilterFeatures = () => {
    const sortAggregations = handleSortAggregations(aggregations)

    return sortAggregations.map((aggregation, index) => {
      const attributeCode = aggregation?.attribute_code
      const isActive = `${aggregation?.attribute_code}_${index}` === filterActive?.attribute_code

      if (FILTER_ATTRIBUTE_SKIP?.includes(aggregation?.attribute_code)) return null

      return (
        <div key={`${attributeCode}_${aggregation?.label}`} className="box-content">
          <button
            className={classNames({ active: isActive })}
            onClick={() => {
              if (filterActive?.attribute_code === attributeCode) return setFilterAction(undefined)

              return setFilterAction({
                ...aggregation,
                originalAttributeCode: aggregation?.attribute_code,
                attribute_code: `${aggregation?.attribute_code}_${index}`,
              })
            }}>
            <span>{aggregation?.label}</span>
            {isActive ? (
              <i className="la la-angle-up fsz-12"></i>
            ) : (
              <i className="la la-angle-down fsz-12"></i>
            )}
          </button>

          {isActive ? (
            <>
              {/* <div className="arrow-filter show-only-desktop">

              </div> */}
              <div className="content show-only-desktop MN-filter-box" ref={contentRef}>
                <div className="box-options MN-filters-box">
                  {renderOptions(aggregation)}

                  {isFetchingData ? <div className="overlay"></div> : null}
                </div>
              </div>
            </>
          ) : null}
        </div>
      )
    })
  }

  const renderFilterPriceRange = () => {
    const isActive = filterActive?.attribute_code === PRICE

    return (
      <div className="box-content show-only-desktop">
        <button
          className={classNames({ active: isActive })}
          onClick={() => {
            if (isActive) return setFilterAction(undefined)

            return setFilterAction({
              attribute_code: PRICE,
              count: 0,
              label: '',
              position: null,
              options: [],
            })
          }}>
          <span>Mức giá</span>
          {isActive ? (
            <i className="la la-angle-up fsz-12"></i>
          ) : (
            <i className="la la-angle-down fsz-12"></i>
          )}
        </button>

        {isActive ? (
          <>
            {/* <div className="arrow-filter show-only-desktop" /> */}
            <div className="content show-only-desktop MN-filter-box" ref={contentRef}>
              <div className="group-body">
                <PriceRangeSlider
                  min={Number(min)}
                  max={Number(max)}
                  // isRest={isRestPrice}
                  onGoClick={onChangePriceRange}
                // onRestPrice={() => setIsRestPrice(false)}
                />
              </div>
            </div>
          </>
        ) : null}
      </div>
    )
  }

  return (
    <div className="MN-filter-center" ref={filterListRef}>
      <div className="group-properties">
        {renderFilterFeatures()}
        {renderFilterPriceRange()}
      </div>
      {!!filterActive ? (
        <div className="not-show-desktop content-mobile" ref={contentMobileRef}>
          {renderOptions(filterActive)}
        </div>
      ) : null}
    </div>
  )
}

export default FilterCenter
