/* eslint-disable @next/next/no-img-element */
import { FC, useRef, useState, useEffect } from 'react'

import Link from 'next/link'
import { FormatNumber, isCurrentTimeInRange } from '@/helper'
import { handleAddToRecentlyViewed } from './constants'

import SwiperCore from 'swiper'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import { ATTRIBUTE_CODE, CONFIGURABLE_PRODUCT } from '../pages/product/constants'
import classNames from 'classnames'
import useCart from '@/hooks/useCart'
import { useMutation, useQueryClient, useQuery } from 'react-query'
import productApi from '@/services/product'
import { compareApi } from '@/services'
import { toast } from 'react-toastify'
import { GETTOKEN } from '@/services/graphql'
import {
  __CreateDataLocal,
  __getDataLocal,
  __RemoveSingleItemLocal,
} from '@/helper/local_helper/localStogare'
import { createFavorite } from '@/store/favoriteSlice'
import { useAppDispatch } from '@/store'
import { Spinner } from '../spinner'

type ProductCard = {
  data: Product,
  isShowAddToCart?: boolean,
}

const ProductCard: FC<ProductCard> = ({ data, isShowAddToCart = true }) => {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()
  const isConfigurableProduct = data?.__typename === CONFIGURABLE_PRODUCT
  const configurableOptions =
    data?.configurable_product_options_selection?.configurable_options ?? []

  const itemSelectedDefault = configurableOptions?.reduce((accumulator, currentValue) => {
    const value = currentValue?.values?.filter((value) => value?.is_available === true)?.[0]
    return { ...accumulator, [currentValue?.attribute_code]: value }
  }, {})

  const [itemSelected, setItemSelected] =
    useState<Record<string, ValueConfigurableOption>>(itemSelectedDefault)

  const [dataItemSelected, setDataItemSelected] = useState<any>(data?.variants?.[0] || {})
  const [stateCompore, setStateCompore] = useState<any>([])
  const [stateWishList, setStateWishList] = useState<any>([])
  const [dataFavoriteLocal, setDataFavoriteLocal] = useState<any>([])

  const swiperRef = useRef<SwiperCore | any>(null)

  const { isCartLoading, onAddProducts } = useCart()

  const { data: dataWishList } = useQuery({
    queryKey: ['getWishlists'],
    queryFn: async () => {
      return await productApi
        .getWishlist({ currentPage: 1, pageSize: 20 })
        .then((response: any) => {
          return response?.customer?.wishlists || []
        })
    },
    // select: (response: any) => {
    //   return response?.customer?.wishlists || []
    // },
    enabled: !!GETTOKEN.tokenAuth(),
  })

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

  const { data: dataCompare } = useQuery({
    queryKey: ['getCompare'],
    queryFn: async () => {
      return await compareApi
        .getCompare({
          uid: __getDataLocal({ key: 'compare-product', type: 'string' }),
        })
        .then((response: any) => {
          if (response?.compareList) {
            let data: any = response?.compareList
            data?.attributes.push({
              code: 'typeBtn',
              label: 'typeBtn',
            })

            let revertItem: any = data?.items?.map((item: any) => {
              const newObj: any = { ...item }

              item.attributes.forEach((attr: any) => {
                newObj[attr.code] = attr.value
              })

              return newObj
            })
            response.compareList.items = revertItem
            return response?.compareList || null
          }
        })
    },
    enabled: !!__getDataLocal({ key: 'compare-product', type: 'string' }),
    staleTime: 30000,
  })

  const dataitemCompare = dataCompare?.items || []

  const { mutate: RemoveItemCompare, isLoading: LoadingRemoveItemCompare } = useMutation({
    mutationFn: async (data: any) => {
      return await compareApi.removeItemCompare({
        input: {
          products: data,
          uid: __getDataLocal({ key: 'compare-product', type: 'string' }),
        },
      })
    },
    onSuccess: async (response: any) => {
      if (response.removeProductsFromCompareList) {
        await queryClient.invalidateQueries(['getCompare'])
        toast.success('Đã hủy sản phẩm so sánh ')
      }
    },
    onError: () => {},
  })

  useEffect(() => {
    if (dataitemCompare?.length > 0 && stateCompore?.length == 0) {
      const field_Sku = dataitemCompare?.map((item: any) => ({ sku: item?.sku, uid: item?.uid }))
      setStateCompore(field_Sku)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataitemCompare])

  const handleGetVariantAttributes = (
    itemFilter: Record<string, any>,
    productData: Product
  ): Variant | any => {
    return (
      productData?.variants?.filter((variant) => {
        let valueReturn = true
        variant?.attributes?.map((attribute) => {
          if (attribute?.uid !== itemFilter?.[attribute?.code]?.uid) valueReturn = false
        })

        return valueReturn
      })?.[0] ?? {}
    )
  }

  const { isLoading: LoadingAddWishList, mutate } = useMutation({
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

  const { isLoading: LoadingCreateCompare, mutate: CreateCompare } = useMutation({
    mutationFn: async (data: any) => {
      return await compareApi.createCompare({
        input: {
          products: data, // ['NjA=']
        },
      })
    },
    onSuccess: async (response: any) => {
      if (!!response?.createCompareList) {
        __CreateDataLocal({
          type: 'string',
          key: 'compare-product',
          data: response?.createCompareList?.uid,
        })
        await queryClient.invalidateQueries(['getCompare'])
        toast.success('Đã thêm sản phẩm vào mục so sánh')
      }
    },
    onError: () => {},
  })

  const { isLoading: LoadingAddCompare, mutate: AddCompare } = useMutation({
    mutationFn: async (data: any) => {
      return await compareApi.addCompare({
        input: {
          products: data.products, // ['NjA=']
          uid: data.uid,
        },
      })
    },
    onSuccess: async (response: any) => {
      if (!!response?.addProductsToCompareList) {
        await queryClient.invalidateQueries(['getCompare'])
        toast.success('Đã thêm sản phẩm vào mục so sánh')
      }
    },
    onError: () => {},
  })

  const handleAddProdToWishList = (value: any) => {
    const field_Val = [
      {
        selected_options: [
          itemSelected?.color?.uid, // uid color
          itemSelected?.size?.uid, // uid size
        ],
        parent_sku: value?.sku, // sku parent
        sku: dataItemSelected?.product?.sku, //sku child
        quantity: 1,
      },
    ]

    if (!GETTOKEN.tokenAuth()) {
      const ConvertData = {
        id: dataItemSelected?.product?.sku,
        added_at: new Date(),
        defaultData: field_Val,
        bindData: {
          value,
          dataItemSelected,
          itemSelected,
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
      changeStateWishList(dataItemSelected?.product?.sku, value?.id, 'create')
      mutate(field_Val)
    }
  }

  const handleRemoveProdToWishList = (val: any) => {
    if (!GETTOKEN.tokenAuth()) {
      __RemoveSingleItemLocal({ key: 'favorite-product', data: { id: val?.id } })
        ? toast.success('Đã hủy sản phẩm yêu thích')
        : toast.error('Xóa thất bại')
      getDataFavorite()
    } else {
      changeStateWishList(dataItemSelected?.product?.sku, val?.id, 'remove')
      RemoveWishList([val?.id])
    }
  }

  const handleAddProdToCompare = () => {
    // if (dataCompare?.items?.length >= 3) {
    //   toast.error('Số lượng sản phẩm so sánh quá  nhiều , vui lòng xóa ít nhất 1 sản phẩm so sánh')
    //   return
    // }
    changeStateCompore(dataItemSelected?.product?.sku, dataItemSelected?.product?.uid, 'create')
    const getID = __getDataLocal({ key: 'compare-product', type: 'string' })
    const decodedString = Buffer?.from(dataItemSelected?.product?.uid, 'base64').toString('utf-8')
    const dataProd = [decodedString]
    if (getID) {
      const CovertData = {
        products: dataProd,
        uid: getID,
      }
      AddCompare(CovertData)
    } else {
      CreateCompare(dataProd)
    }
  }

  const handleRemoveItemCompare = (val: any) => {
    changeStateCompore(dataItemSelected?.product?.sku, val?.uid, 'remove')
    RemoveItemCompare([val?.uid])
  }

  const currentVariantAttributes = handleGetVariantAttributes({ ...itemSelected }, data)

  useEffect(() => {
    if (!GETTOKEN.tokenAuth()) {
      getDataFavorite()
    }
    fieldData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fieldData = () => {
    setDataItemSelected(currentVariantAttributes)
  }

  const changeStateCompore = (sku: string, uid: string, type: string) => {
    if (type == 'create') {
      const addState = [...stateCompore, { sku: sku, uid: uid }]
      setStateCompore(addState)
    } else {
      const removeItemState = stateCompore.filter((item: any) => item.sku !== sku)
      setStateCompore(removeItemState)
    }
  }

  const changeStateWishList = (sku: string, id: string, type: string) => {
    if (type == 'create') {
      const addState = [...stateWishList, { sku: sku, id: id }]
      setStateWishList(addState)
    } else {
      const removeItemState = stateWishList.filter((item: any) => item.sku !== sku)
      setStateWishList(removeItemState)
    }
  }

  const foundItem = !GETTOKEN.tokenAuth()
    ? dataFavoriteLocal?.find((item: any) => item?.id === dataItemSelected?.product?.sku)
    : stateWishList?.find((item: any) => item?.sku === dataItemSelected?.product?.sku)

  const getDataFavorite = () => {
    const getLength = __getDataLocal({ key: 'favorite-product', type: 'array' }) || []
    setDataFavoriteLocal(getLength)
    dispatch(createFavorite(getLength?.length))
  }

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

  const renderTagNew = (productSelect: Product) => {
    const isNewItem = isCurrentTimeInRange(productSelect?.new_from_date, productSelect?.new_to_date)
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

  const renderDailySale = (productSelect: Product) => {
    const dailySale = productSelect?.daily_sale
    const isHaveDailySale = dailySale !== null
    const isInTimeDailySale = isCurrentTimeInRange(
      productSelect?.daily_sale?.start_date ?? null,
      productSelect?.daily_sale?.end_date ?? null
    )

    if (!isHaveDailySale || !isInTimeDailySale) return null

    const saleableQty = dailySale?.saleable_qty
    const soldQty = dailySale?.sold_qty
    const allQty = saleableQty + soldQty
    const percent = ((soldQty / allQty) * 100).toPrecision(1)
    return (
      <>
        <div className="MN-progress-info">
          <div>
            {productSelect?.review_count ? (
              <>
                <span className="vote">
                  {productSelect?.rating_summary} <i className="la la-star"></i>
                </span>
                <span>({productSelect?.review_count})</span>
              </>
            ) : null}
          </div>
          <div className="box-cart">
            <i className="fa-solid fa-cart-shopping"></i>
            {FormatNumber(dailySale?.sale_qty, '.')}
          </div>
        </div>
        <div className="progress-content MN-progress">
          <div className="progress progress-height">
            <div
              className="progress-bar bg-green2"
              role="progressbar"
              style={{ width: `${percent}%` }}
              aria-valuenow={25}
              aria-valuemin={0}
              aria-valuemax={100}></div>
          </div>
          <div>{percent}%</div>
        </div>
      </>
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
            <div className="meta-item color-green2  w-fit" key={tags}>
              {tags} <span className="bg bg-green2"></span>
            </div>
          )
        })}
      </div>
    )
  }

  const renderBtnAddToCart = () => {
    if (!isShowAddToCart) return null
    return (
      <button
        className="butn bg-000 text-white radius-4 fw-500 fsz-11 text-uppercase text-center mt-2 hover-bg-green2 addCart none-border mb-0 btn-add-to-cart"
        disabled={isCartLoading}
        onClick={() => {
          const selectedOptions = isConfigurableProduct
            ? Object.values(itemSelected)?.map((option) => option?.uid) ?? []
            : []
          onAddProducts([{ sku: data?.sku ?? '', quantity: 1, selected_options: selectedOptions }])
        }}>
        <span className="text-nowrap">
          {isCartLoading ? <Spinner className="spinner-btn" /> : 'Thêm vào giỏ hàng'}
        </span>
      </button>
    )
  }

  const handleInitialClick = (optionSelect: any, variantAttributes: any) => {
    setItemSelected(optionSelect)
    setDataItemSelected(variantAttributes)
  }

  const renderListSwiperSlide = () => {
    return configurableOptions?.map((option) => {
      if (option?.attribute_code !== ATTRIBUTE_CODE.COLOR) return null

      return option?.values?.map((value) => {
        const variantAttributes = handleGetVariantAttributes(
          { ...itemSelected, [option?.attribute_code]: value },
          data
        )
        const optionSelect = { ...itemSelected, [option?.attribute_code]: value }
        return (
          <SwiperSlide key={value?.uid}>
            <span
              className="color-img"
              onClick={() => handleInitialClick(optionSelect, variantAttributes)}
              // onClick={() => {
              //   setItemSelected({ ...itemSelected, [option?.attribute_code]: value })
              //   setDataItemSelected(variantAttributes)
              // }}
            >
              <img
                loading="lazy"
                src={variantAttributes?.product?.image?.url}
                alt={variantAttributes?.product?.image?.label}
                className={classNames('thumbnail', {
                  selected: value?.uid === itemSelected?.[option?.attribute_code]?.uid,
                })}
              />
            </span>
          </SwiperSlide>
        )
      })
    })
  }

  const renderSwiperProduct = () => {
    if (!isConfigurableProduct) return null

    return (
      <div className="thumbnail-imgs mt-10 overflow-hidden">
        <Swiper
          ref={swiperRef}
          slidesPerView={4}
          spaceBetween={0}
          loop={false}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Navigation]}
          className="swiper-wrapper-flex list-icon-product">
          {renderListSwiperSlide()}
        </Swiper>
      </div>
    )
  }

  if (!data) return null

  const product = isConfigurableProduct ? currentVariantAttributes?.product : data

  const foundItemFetching = !GETTOKEN.tokenAuth()
    ? dataFavoriteLocal?.find((item: any) => item?.id === dataItemSelected?.product?.sku)
    : dataInfoCus?.find(
        (item: any) => item?.configured_variant?.sku === dataItemSelected?.product?.sku
      )

  const foundDataCompare = stateCompore?.find(
    (item: any) => item?.sku === dataItemSelected?.product?.sku
  )

  const foundDataCompareFetching = dataitemCompare?.find(
    (item: any) => item?.sku === dataItemSelected?.product?.sku
  )

  return (
    <div className="product-card MN-product-card">
      <div className="top-inf">
        {renderDiscount(product)}
        {renderTagNew(product)}

        <div className="icon-feature">
          <div
            onClick={() => {
              foundDataCompare
                ? handleRemoveItemCompare(foundDataCompareFetching)
                : handleAddProdToCompare()
            }}
            className={`fav-btn ${foundDataCompare ? 'active' : ''}`}
            style={{
              pointerEvents: `${
                LoadingCreateCompare || LoadingAddCompare || LoadingRemoveItemCompare
                  ? 'none'
                  : 'auto'
              }`,
            }}>
            <i className="las la-sync-alt"></i>
          </div>
          <div
            style={{
              pointerEvents: `${LoadingAddWishList || LoadingRemoveWishList ? 'none' : 'auto'}`,
            }}
            onClick={() =>
              foundItem
                ? handleRemoveProdToWishList(foundItemFetching)
                : handleAddProdToWishList(data)
            }
            className={`fav-btn ${foundItem ? 'active' : ''}`}>
            <i className="las la-heart"></i>
          </div>
        </div>
      </div>
      <Link
        href={`/products/${data?.url_key}`}
        className="img"
        onClick={() => handleAddToRecentlyViewed(data)}>
        <img
          loading="lazy"
          src={product?.image?.url}
          alt={currentVariantAttributes?.product?.image?.label ?? ''}
          className="img-contain main-image"
        />
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

        {renderPrice(product)}

        {renderDailySale(product)}

        {renderTags()}

        {/* {currentVariantAttributes?.product?.stock_status === 'IN_STOCK' ? ( */}
        {product?.stock_status === 'IN_STOCK' ? (
          <p className="fsz-12 mt-2">
            <i className="fas fa-check-circle color-green2 me-1"></i> Còn hàng
          </p>
        ) : (
          <p className="fsz-12 mt-2">
            <i className="fas fa-times-circle color-red1 me-1"></i> Hết hàng
          </p>
        )}

        {/* <div className="meta">
          <a href="#" className="meta-item color-222">
            $2.98 Shipping <span className="bg bg-222"></span>
          </a>
        </div> */}
        {/* <p className="fsz-12 mt-2 text-uppercase"> PRE - ORDER </p>  */}

        {renderSwiperProduct()}

        {renderBtnAddToCart()}
      </div>
    </div>
  )
}

export default ProductCard
