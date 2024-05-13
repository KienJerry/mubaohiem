/* eslint-disable @next/next/no-img-element */
import { FC } from 'react'

import Link from 'next/link'
import useCart from '@/hooks/useCart'
import { FormatNumber } from '@/helper'
import { Spinner } from '@/components/spinner'
import { CONFIGURABLE_PRODUCT } from '@/components/pages/product/constants'

type ItemMiniCart = {
  data: Cart,
}

const ItemMiniCart: FC<ItemMiniCart> = ({ data }) => {
  const { isCartLoading, isLoadingGetCart, onRemoveProduct } = useCart()
  const isConfigurableProduct = data?.product?.__typename === CONFIGURABLE_PRODUCT

  return (
    <div className="item">
      <Link href={`/products/${data?.product?.url_key}`}>
        <div className="info">
          <img
            src={
              isConfigurableProduct
                ? data?.configured_variant?.image?.url
                : data?.product?.image?.url ?? ''
            }
            alt="item-cart"
            width={45}
            height={45}
          />
          <div className="name">{data?.product?.name}</div>
        </div>
        <div className="price">
          {FormatNumber(data?.prices?.price?.value, '.')} {data?.prices?.price?.currency}
        </div>
      </Link>
      <div className="delete-item" onClick={() => onRemoveProduct(data?.uid)}>
        {isCartLoading || isLoadingGetCart ? <Spinner /> : <i className="las la-trash"></i>}
      </div>
    </div>
  )
}

export default ItemMiniCart
