/* eslint-disable @next/next/no-img-element */

import { FC } from 'react'
import Link from 'next/link'
import { handleAddToRecentlyViewed } from './constants'
import { FormatNumber, isCurrentTimeInRange } from '@/helper'
import { CONFIGURABLE_PRODUCT } from '../pages/product/constants'
import useCart from '@/hooks/useCart'
import { Spinner } from '../spinner'

type ProductCartDaily = {
  data: Product,
}

const ProductCartDaily: FC<ProductCartDaily> = ({ data }) => {
  const isConfigurableProduct = data?.__typename === CONFIGURABLE_PRODUCT
  const productActive = isConfigurableProduct ? data?.variants?.[0]?.product : data

  const configurableOptions =
    data.configurable_product_options_selection?.configurable_options ?? []

  const itemSelectedDefault = configurableOptions?.reduce((accumulator, currentValue) => {
    const value = currentValue?.values?.filter((value) => value?.is_available === true)?.[0]
    return { ...accumulator, [currentValue?.attribute_code]: value }
  }, {})

  const { isCartLoading, onAddProducts } = useCart()

  const renderDiscount = () => {
    let percentOff = data?.price_range?.maximum_price?.discount?.percent_off

    const isHaveDailySale = productActive?.daily_sale !== null
    if (isHaveDailySale) {
      const isInTimeDiscount = isCurrentTimeInRange(
        productActive?.daily_sale?.start_date ?? null,
        productActive?.daily_sale?.end_date ?? null
      )
      const regularPrice = productActive?.price_range?.maximum_price?.regular_price?.value ?? 0
      const discountPrice = productActive?.daily_sale?.sale_price ?? 0

      percentOff = isInTimeDiscount
        ? Math.floor(((regularPrice - discountPrice) / regularPrice) * 100)
        : percentOff
    }

    if (!percentOff) return null
    return (
      <div className="dis-card">
        <small className="fsz-10 d-block text-uppercase"> save </small>
        <h6 className="fsz-14 mb-0"> {percentOff}% </h6>
      </div>
    )
  }

  const renderRating = () => {
    return (
      <div className="rating">
        <div className="stars">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <i
                className={
                  index + 1 <= data?.rating_summary
                    ? 'la la-star'
                    : index < data?.rating_summary
                    ? 'la la-star-half'
                    : 'la la-star color-999'
                }
                key={index}></i>
            ))}
        </div>
        <span className="num"> ({data?.review_count}) </span>
      </div>
    )
  }

  const renderPrice = () => {
    const isHaveDailySale = productActive?.daily_sale !== null
    const isHaveAmountOff = productActive?.price_range?.maximum_price?.discount?.amount_off
    const finalCurrency = productActive?.price_range?.maximum_price?.final_price?.currency
    const finalValue = FormatNumber(
      productActive?.price_range?.maximum_price?.final_price?.value ?? 0,
      '.'
    )
    const regularPrice = FormatNumber(
      productActive?.price_range?.maximum_price?.regular_price?.value ?? 0,
      '.'
    )

    const isInTimeDiscount = isCurrentTimeInRange(
      productActive?.daily_sale?.start_date ?? null,
      productActive?.daily_sale?.end_date ?? null
    )

    if (isHaveDailySale && isInTimeDiscount) {
      const dailySale = productActive?.daily_sale
      const priceSale = FormatNumber(dailySale?.sale_price ?? 0, '.')

      return (
        <h5 className="fsz-18 color-red1 fw-600">
          {`${priceSale} ${finalCurrency} `}
          <span className="old fsz-14 color-666 text-decoration-line-through">{`${regularPrice} ${data?.price_range.maximum_price.regular_price.currency}`}</span>
        </h5>
      )
    }

    if (isHaveAmountOff) {
      return (
        <h5 className="fsz-18 color-red1 fw-600">
          {`${finalValue}${finalCurrency} `}
          <span className="old fsz-14 color-666 text-decoration-line-through">{`${regularPrice}${data?.price_range.maximum_price.regular_price.currency}`}</span>
        </h5>
      )
    }

    return <h5 className="fsz-18 fw-600 ">{`${finalValue}${finalCurrency}`}</h5>
  }

  if (!data) return null
  return (
    <div className="product-card">
      <div className="top-inf">
        {renderDiscount()}
        {/* <a href="#0" className="fav-btn">
                                <i className="las la-heart"></i>
                              </a> */}
      </div>
      <Link
        href={`/products/${data?.url_key}`}
        className="img"
        onClick={() => handleAddToRecentlyViewed(data)}>
        <img loading="lazy" src={data?.image?.url} alt="" className="img-contain main-image" />
      </Link>
      <div className="info">
        {renderRating()}
        <h6>
          <Link
            href={`/products/${data?.url_key}`}
            className="prod-title fsz-14 fw-bold mt-2 hover-green2"
            onClick={() => handleAddToRecentlyViewed(data)}>
            {data?.name}
          </Link>
        </h6>
        <div className="price mt-15">{renderPrice()}</div>
        <button
          className="butn bg-000 text-white radius-4 fw-500 fsz-11 text-uppercase text-center mt-2 hover-bg-green2 addCart none-border mb-0 btn-add-to-cart"
          disabled={isCartLoading}
          onClick={() => {
            const selectedOptions = isConfigurableProduct
              ? Object.values(itemSelectedDefault)?.map((option: any) => option?.uid) ?? []
              : []
            onAddProducts([
              { sku: data?.sku ?? '', quantity: 1, selected_options: selectedOptions },
            ])
          }}>
          <span className="text-nowrap">
            {isCartLoading ? <Spinner className="spinner-btn" /> : 'Thêm vào giỏ hàng'}
          </span>
        </button>
      </div>
    </div>
  )
}

export default ProductCartDaily
