/* eslint-disable @next/next/no-img-element */
import { FC, useState } from 'react'

import Link from 'next/link'
import useCart from '@/hooks/useCart'
import { CartItem } from '@/services/cart'
import { FormatNumber, isCurrentTimeInRange } from '@/helper'
import { Spinner } from '@/components/spinner'

type CardItem = {
  data: Product,
  parameterSelected: CartItem[],
  onRemoveFavorites: () => void,
}

const FavoriteCard: FC<CardItem> = ({ data, parameterSelected, onRemoveFavorites }) => {
  const { isCartLoading, onAddProducts } = useCart()

  const [isRemoveFavorite, setIsRemoveFavorite] = useState<boolean>(false)

  const renderDiscount = (productSelect: Product) => {
    let percentOff = data?.price_range?.maximum_price?.discount?.percent_off
    const isHaveDailySale = productSelect?.daily_sale !== null
    if (isHaveDailySale) {
      const isInTimeDiscount = isCurrentTimeInRange(
        productSelect?.daily_sale?.start_date ?? null,
        productSelect?.daily_sale?.end_date ?? null
      )
      const regularPrice = productSelect?.price_range?.maximum_price?.regular_price?.value ?? 0
      const discountPrice = productSelect?.daily_sale?.sale_price ?? 0
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

  const renderTagNew = () => {
    const isNewItem = isCurrentTimeInRange(data?.new_from_date, data?.new_to_date)
    if (!isNewItem) return <div />

    return <small className="fsz-10 py-1 px-2 radius-2 bg-222 text-white text-uppercase">mới</small>
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

  const renderPrice = (productSelect: Product) => {
    const maximumPrice = productSelect?.price_range?.maximum_price
    const isHaveDailySale = productSelect?.daily_sale !== null
    const isHaveAmountOff = maximumPrice?.discount?.amount_off
    const finalCurrency = maximumPrice?.final_price?.currency
    const finalValue = FormatNumber(maximumPrice?.final_price?.value ?? 0, '.')
    const regularPrice = FormatNumber(maximumPrice?.regular_price?.value ?? 0, '.')

    const isInTimeDiscount = isCurrentTimeInRange(
      productSelect?.daily_sale?.start_date ?? null,
      productSelect?.daily_sale?.end_date ?? null
    )
    if (isHaveDailySale && isInTimeDiscount) {
      const dailySale = productSelect?.daily_sale
      const priceSale = FormatNumber(dailySale?.sale_price ?? 0, '.')

      return (
        <div className="price mt-15">
          <h5 className="fsz-18 color-red1 fw-600">
            {`${priceSale} ${finalCurrency} `}
            <span className="old fsz-14 color-666 text-decoration-line-through">
              {`${regularPrice} ${maximumPrice?.regular_price?.currency}`}
            </span>
          </h5>
        </div>
      )
    }

    if (isHaveAmountOff) {
      return (
        <div className="price mt-15">
          <h5 className="fsz-18 color-red1 fw-600">
            {`${finalValue} ${finalCurrency} `}
            <span className="old fsz-14 color-666 text-decoration-line-through">
              {`${regularPrice} ${maximumPrice?.regular_price?.currency}`}
            </span>
          </h5>
        </div>
      )
    }

    return (
      <div className="price mt-15">
        <h5 className="fsz-18 fw-600">{`${finalValue} ${finalCurrency}`}</h5>
      </div>
    )
  }

  const renderTags = () => {
    const tagsAttribute = data?.attributes?.filter(
      (attribute) => attribute?.attribute_code === 'tags'
    )?.[0]
    if (tagsAttribute?.value === '') return null

    const tags = tagsAttribute?.value?.split(', ')
    return (
      <div className="meta d-flex flex-wrap">
        {tags?.map((tags) => {
          return (
            <div className="meta-item color-green2 w-fit" key={tags}>
              {tags} <span className="bg bg-green2"></span>
            </div>
          )
        })}
      </div>
    )
  }

  const renderStock = () => {
    if (data?.stock_status === 'IN_STOCK')
      return (
        <p className="fsz-12 mt-2 d-flex align-items-center gap-1">
          {/* <i className="fas fa-check-circle color-green2 me-1"></i> */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="#ff9e00"
            color="white"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-circle-check">
            <circle cx="12" cy="12" r="10" />
            <path d="m9 12 2 2 4-4" />
          </svg>{' '}
          Còn hàng
        </p>
      )

    return (
      <p className="fsz-12 mt-2 d-flex align-items-center gap-1">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="#eb4227"
          color="white"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-circle-x">
          <circle cx="12" cy="12" r="10" />
          <path d="m15 9-6 6" />
          <path d="m9 9 6 6" />
        </svg>{' '}
        Hết hàng
      </p>
    )
  }

  const renderBtnIcon = () => {
    return (
      <>
        <button
          className="btn-heart fav-btn none-border active"
          onClick={() => {
            if (isRemoveFavorite) return
            setIsRemoveFavorite(true)
            onRemoveFavorites()
          }}>
          {isRemoveFavorite ? <Spinner className="spinner" /> : <i className="las la-heart"></i>}
        </button>

        <button
          className="btn-cart none-border bg-none d-flex align-items-center justify-content-center"
          onClick={() => {
            if (!isCartLoading) onAddProducts(parameterSelected)
          }}>
          {isCartLoading ? (
            <Spinner className="spinner" />
          ) : (
            <i className="las la-shopping-bag"></i>
          )}
        </button>
      </>
    )
  }

  return (
    <div className="product-card">
      <div className="top-inf">
        {renderDiscount(data)}
        {renderTagNew()}

        {renderBtnIcon()}
      </div>
      <Link href={`/products/${data?.url_key}`} className="img">
        <img src={data?.image?.url} alt={data?.name} className="img-contain main-image" />
      </Link>
      <div className="info">
        {renderRating()}
        <h6>
          <Link
            href={`/products/${data?.url_key}`}
            className="prod-title fsz-14 fw-bold mt-2 hover-green2">
            {data?.name}
          </Link>
        </h6>
        <div className="price mt-15">{renderPrice(data)}</div>

        {renderTags()}

        {renderStock()}
      </div>
    </div>
  )
}

export default FavoriteCard
