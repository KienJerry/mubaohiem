/* eslint-disable @next/next/no-img-element */
import { FC, useEffect, useState } from 'react'

import Link from 'next/link'
import { useDebounce } from '@/hooks'
import useCart from '@/hooks/useCart'
import { FormatNumber, isCurrentTimeInRange } from '@/helper'
import { CONFIGURABLE_PRODUCT } from '../product/constants'
import { Spinner } from '@/components/spinner'
import { useMutation, useQueryClient, useQuery } from 'react-query'
import productApi from '@/services/product'
import { toast } from 'react-toastify'
import { GETTOKEN } from '@/services/graphql'
import {
  __CreateDataLocal,
  __getDataLocal,
  __RemoveSingleItemLocal,
} from '@/helper/local_helper/localStogare'
import { useAppDispatch } from '@/store'
import { createFavorite } from '@/store/favoriteSlice'
import classNames from 'classnames'

type CardItem = {
  data: Cart,
  onUpdateProduct?: any,
}

const CardItem: FC<CardItem> = ({ data, onUpdateProduct }) => {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()
  const { product, configured_variant: configuredVariant, quantity, prices, uid } = data
  const discounts = prices?.discounts

  const [isUpdateItem, setIsUpdateItem] = useState<boolean>(false)
  const [dataFavoriteLocal, setDataFavoriteLocal] = useState<any>([])
  const [stateWishList, setStateWishList] = useState<any>([])
  const [currentQuantity, setCurrentQuantity] = useState<number>(quantity)

  const quantityDebounce = useDebounce(currentQuantity, 500)

  // const { isCartLoading, onUpdateProduct, onRemoveProduct } = useCart()
  const { isCartLoading, onRemoveProduct } = useCart()

  const { data: dataWishList } = useQuery({
    queryKey: ['getWishlists'],
    queryFn: async () => {
      return await productApi
        .getWishlist({ currentPage: 1, pageSize: 20 })
        .then((response: any) => {
          return response?.customer?.wishlists || []
        })
    },
    enabled: !!GETTOKEN.tokenAuth(),
  })

  const { isLoading: LoadingAddWishList, mutate: MutateAddWishList } = useMutation({
    mutationFn: async (data: any) => {
      return await productApi.addProductsToWishlist({
        wishlistId: 0,
        wishlistItems: data,
      })
    },
    onSuccess: async (response: any) => {
      if (!!response?.addProductsToWishlist?.wishlist) {
        await queryClient.invalidateQueries(['getWishlists'])
        toast.success('Đã thêm vào sản phẩm yêu thích')
      }
    },
    onError: () => {},
  })

  const { isLoading: LoadingRemoveWishList, mutate: RemoveWishList } = useMutation({
    mutationFn: async (data: any) => {
      return await productApi.removeItemWishList({
        wishlistId: 0,
        wishlistItemsIds: data,
      })
    },
    onSuccess: async (response: any) => {
      if (!!response?.removeProductsFromWishlist?.wishlist) {
        await queryClient.invalidateQueries(['getWishlists'])
        toast.success('Đã hủy sản phẩm yêu thích')
      }
    },
    onError: () => {},
  })

  useEffect(() => {
    if (!GETTOKEN.tokenAuth()) {
      getDataFavorite()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getDataFavorite = () => {
    const getLength = __getDataLocal({ key: 'favorite-product', type: 'array' }) || []
    setDataFavoriteLocal(getLength)
    dispatch(createFavorite(getLength?.length))
  }

  const handleAddProdToWishList = () => {
    const field_Val = [
      {
        selected_options: [
          data?.configurable_options?.[0]?.configurable_product_option_value_uid, // uid color
          data?.configurable_options?.[1]?.configurable_product_option_value_uid, // uid size
        ],
        parent_sku: data?.product?.sku, // sku parent
        sku: data?.configured_variant?.sku, //sku child
        quantity: currentQuantity, //quantity
      },
    ]

    if (!GETTOKEN.tokenAuth()) {
      // Xử lý Thêm Sản Phẩm Yêu Thích khi chưa đăng nhập
      const ConvertData = {
        id: data?.configured_variant?.sku,
        added_at: new Date(),
        defaultData: field_Val,
        bindData: {
          data,
        },
      }
      __CreateDataLocal({
        type: 'array',
        key: 'favorite-product',
        data: ConvertData,
      })
        ? toast.success('Đã thêm vào sản phẩm yêu thích')
        : toast.error('Sản phẩm đã có trong mục yêu thích')

      getDataFavorite()
    } else {
      changeStateWishList(data?.configured_variant?.sku, 'create')
      MutateAddWishList(field_Val)
    }
  }

  const handleRemoveProdToWishList = (dataRemove: any) => {
    if (!GETTOKEN.tokenAuth()) {
      //Xử lý xóa sản phẩm yêu thích
      __RemoveSingleItemLocal({ key: 'favorite-product', data: { id: dataRemove?.id } })
        ? toast.success('Đã hủy sản phẩm yêu thích')
        : toast.error('Xóa thất bại')
      getDataFavorite()
    } else {
      changeStateWishList(data?.configured_variant?.sku, 'remove')
      RemoveWishList([dataRemove?.id])
    }
  }

  const changeStateWishList = (sku: string, type: string) => {
    if (type == 'create') {
      const addState = [...stateWishList, { sku: sku }]
      setStateWishList(addState)
    } else {
      const removeItemState = stateWishList.filter((item: any) => item.sku !== sku)
      setStateWishList(removeItemState)
    }
  }

  const dataInfoCus = dataWishList?.[0]?.items_v2?.items || []

  useEffect(() => {
    if (dataInfoCus?.length > 0 && stateWishList?.length == 0) {
      const field_Sku = dataInfoCus?.map((item: any) => ({
        sku: item?.configured_variant?.sku,
        id: item?.id,
      }))
      setStateWishList(field_Sku)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataInfoCus])

  const foundItemFetching = !GETTOKEN.tokenAuth()
    ? dataFavoriteLocal?.find((item: any) => item?.id === data?.configured_variant?.sku)
    : dataInfoCus?.find(
        (item: any) => item?.configured_variant?.sku === data?.configured_variant?.sku
      )

  useEffect(() => {
    if (!isUpdateItem || quantityDebounce === quantity) return

    setIsUpdateItem(false)
    // if (quantityDebounce === 0) return onRemoveProduct(uid)

    return onUpdateProduct([
      {
        cart_item_uid: uid,
        quantity: quantityDebounce,
      },
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quantityDebounce])

  const renderDiscount = () => {
    if (!discounts) return null
    return (
      <div className="dis-card me-1">
        <small className="fsz-10 d-block text-uppercase"> save </small>
        <h6 className="fsz-14 text-white mb-0">
          {FormatNumber(discounts?.[0]?.amount?.value ?? 0, '.')} {prices?.row_total?.currency}{' '}
        </h6>
      </div>
    )
  }

  const renderTagNew = () => {
    const isNewItem = isCurrentTimeInRange(product?.new_from_date, product?.new_to_date)
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
                  index + 1 <= product?.rating_summary
                    ? 'la la-star'
                    : index < product?.rating_summary
                    ? 'la la-star-half'
                    : 'la la-star color-999'
                }
                key={index}></i>
            ))}
        </div>
        <span className="num"> ({product?.review_count}) </span>
      </div>
    )
  }

  const renderPride = () => {
    const price = `${FormatNumber(prices?.price?.value, '.')} ${prices?.row_total?.currency}`
    if (!discounts) return <h5 className="fsz-18 fw-600"> {price} </h5>

    return <h5 className="fsz-18 color-red1 fw-600"> {price} </h5>
  }

  const renderConfiguredVariant = () => {
    return data?.configurable_options?.map((option) => (
      <p className="fsz-14 color-666 mb-0" key={option?.option_label}>
        {' '}
        {option?.option_label}: {option?.value_label}{' '}
      </p>
    ))
  }

  const renderTags = () => {
    const tagsAttribute = product?.attributes?.filter(
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
    if (product?.stock_status === 'IN_STOCK')
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

  const foundItem = !GETTOKEN.tokenAuth()
    ? dataFavoriteLocal?.find((item: any) => item?.id === data?.configured_variant?.sku)
    : stateWishList?.find((item: any) => item?.sku === data?.configured_variant?.sku)

  return (
    <div className="product-card">
      <div className="top-inf">
        {renderDiscount()}
        {renderTagNew()}

        <button
          style={{
            pointerEvents: `${LoadingAddWishList || LoadingRemoveWishList ? 'none' : 'auto'}`,
          }}
          className={`fav-btn none-border ${foundItem ? 'active' : ''}`}
          onClick={() =>
            foundItem ? handleRemoveProdToWishList(foundItemFetching) : handleAddProdToWishList()
          }>
          <i className="las la-heart"></i>
        </button>
        <button
          className="remove-btn none-border d-flex align-items-center justify-content-center"
          onClick={() => onRemoveProduct(uid)}>
          {isCartLoading ? (
            <Spinner className="w-[16px] h-[16px]" />
          ) : (
            <i className="las la-trash"></i>
          )}
        </button>
      </div>
      <Link href={`/products/${product?.url_key}`} className="img">
        <img
          src={
            product?.__typename === CONFIGURABLE_PRODUCT
              ? configuredVariant?.image?.url
              : product?.image?.url
          }
          alt={product?.image?.label}
          className="img-contain main-image"
        />
      </Link>
      <div className="info">
        {renderRating()}
        <h6>
          <Link
            href={`/products/${product?.url_key}`}
            className="prod-title fsz-14 fw-bold mt-2 hover-green2">
            {product?.name}
          </Link>
        </h6>
        <div className="price mt-15">{renderPride()}</div>
        <div>{renderConfiguredVariant()}</div>
        <div className="add-more mt-3">
          <span
            className={classNames('qt-minus', {
              ['pointer hover-primary']: currentQuantity !== 1,
            })}
            onClick={() => {
              if (currentQuantity === 1) return
              setIsUpdateItem(true)
              setCurrentQuantity(currentQuantity - 1)
            }}>
            {/* <i className="fas fa-minus"></i> */}
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
              className="lucide lucide-minus">
              <path d="M5 12h14" />
            </svg>
          </span>
          <input
            type="text"
            className="qt border-0"
            value={currentQuantity}
            onChange={(e) => {
              const value = Number(e?.target?.value)
              setIsUpdateItem(true)

              if (e?.target?.value === '') return setCurrentQuantity(1)
              if (!isNaN(value)) {
                if (Number(value) <= 0) return setCurrentQuantity(1)
                return setCurrentQuantity(Number(value))
              }
            }}
          />
          <span
            className="qt-plus pointer hover-primary"
            onClick={() => {
              setIsUpdateItem(true)
              setCurrentQuantity(currentQuantity + 1)
            }}>
            {/* <i className="fas fa-plus"></i> */}
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
              className="lucide lucide-plus">
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
          </span>
        </div>

        {renderTags()}

        {renderStock()}
      </div>
    </div>
  )
}

export default CardItem
