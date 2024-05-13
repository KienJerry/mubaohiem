/* eslint-disable @next/next/no-img-element */
import React, { FC, useRef, useState, useEffect } from 'react'

import Link from 'next/link'
import Details from './Details'
import SwiperCore from 'swiper'
import classNames from 'classnames'
import { useMutation, useQueryClient, useQuery } from 'react-query'
import { toast } from 'react-toastify'

import { FormatNumber, isCurrentTimeInRange } from '@/helper'
import { Navigation } from 'swiper/modules'
import Breadcrumb from '@/components/Breadcrumb'
import { Swiper, SwiperSlide } from 'swiper/react'

// import ProductBuyTogether from './ProductBuyTogether'
import RecentlyViewed from '@/components/RecentlyViewed'
import RelatedProducts from '@/components/RelatedProducts'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import productApi from '@/services/product'
import { GETTOKEN } from '@/services/graphql'
import {
  __CreateDataLocal,
  __getDataLocal,
  __RemoveSingleItemLocal,
} from '@/helper/local_helper/localStogare'

import useCart from '@/hooks/useCart'
import { createFavorite } from '@/store/favoriteSlice'
import { useAppDispatch } from '@/store'
import { compareApi, contactApi } from '@/services'
import { ATTRIBUTE_CODE, CONFIGURABLE_PRODUCT } from '../constants'
import ListCardPayment from './ListCardPayment'
import { Spinner } from '@/components/spinner'
import { useRouter } from 'next/router'

type ProductDetailPage = {
  res: {
    productDetail: ResProductDetail,
  },
}

const ProductDetailPage: FC<ProductDetailPage> = ({ res }) => {
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  const router = useRouter()
  const urlKey = router?.query?.detail

  const { productDetail } = res
  const product = productDetail?.items?.[0]
  const isConfigurableProduct = product?.__typename === CONFIGURABLE_PRODUCT

  console.log({ productDetail })

  const configurableOptions =
    product?.configurable_product_options_selection?.configurable_options ?? []

  const isViewSimpleProduct = urlKey !== product?.url_key
  const itemSelectedDefault = !isViewSimpleProduct
    ? configurableOptions?.reduce((accumulator, currentValue) => {
        const value = currentValue?.values?.filter((value) => value?.is_available === true)?.[0]
        return { ...accumulator, [currentValue?.attribute_code]: value }
      }, {})
    : product?.variants
        ?.filter((variant) => variant?.product?.url_key === urlKey)?.[0]
        ?.attributes?.reduce((accumulator, currentValue) => {
          return {
            ...accumulator,
            [currentValue?.code]: {
              uid: currentValue?.uid,
              label: currentValue?.abel,
              is_use_default: false,
              is_available: true,
              swatch: null,
            },
          }
        }, {}) ?? {}

  const [quantity, setQuantity] = useState<number>(1)
  const [itemSelected, setItemSelected] =
    useState<Record<string, ValueConfigurableOption>>(itemSelectedDefault)

  const [stateWishList, setStateWishList] = useState<any>([])
  const [stateCompore, setStateCompore] = useState<any>([])
  const [dataFavoriteLocal, setDataFavoriteLocal] = useState<any>([])

  const [isExpanded, setIsExpanded] = useState(false)
  const contentRef: any = useRef(null)

  const swiperGalleryTopRef = useRef<SwiperCore | any>(null)

  const { onAddProducts, isCartLoading } = useCart()

  const productDescription = product?.short_description?.html ?? ''

  const setActiveSlider = (index: number) => {
    if (swiperGalleryTopRef?.current && swiperGalleryTopRef?.current?.swiper) {
      swiperGalleryTopRef?.current?.swiper?.slideTo(index)
    }
  }

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

  const { data: InforMationStore } = useQuery({
    queryKey: ['getInforMationStore'],
    queryFn: async () => {
      return await contactApi.getInfoMationStore().then((response: any) => {
        if (!!response?.storeAddress) {
          return response?.storeAddress || []
        }
      })
    },
    staleTime: 30000,
  })

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

  const dataitemCompare = dataCompare?.items || []
  useEffect(() => {
    if (dataitemCompare?.length > 0 && stateCompore?.length == 0) {
      const field_Sku = dataitemCompare?.map((item: any) => ({ sku: item?.sku, uid: item?.uid }))
      setStateCompore(field_Sku)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataitemCompare])

  useEffect(() => {
    if (!GETTOKEN.tokenAuth()) {
      getDataFavorite()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const contentHeight = contentRef?.current?.clientHeight
    if (contentHeight >= 5 * 16) {
      setIsExpanded(true)
    }
  }, [productDescription])

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

  const getDataFavorite = () => {
    const getLength = __getDataLocal({ key: 'favorite-product', type: 'array' }) || []
    setDataFavoriteLocal(getLength)
    dispatch(createFavorite(getLength?.length))
  }

  const handleGetVariantAttributes = (itemFilter: Record<string, any>): Variant | any => {
    return (
      product?.variants?.filter((variant) => {
        let valueReturn = true
        variant?.attributes?.map((attribute) => {
          if (attribute?.uid !== itemFilter?.[attribute?.code]?.uid) valueReturn = false
        })

        return valueReturn
      })?.[0] ?? {}
    )
  }
  const currentVariantAttributes = handleGetVariantAttributes({ ...itemSelected })

  const handleAddProdToWishList = (value: any) => {
    const field_Val = [
      {
        selected_options: [
          itemSelected?.color?.uid, // uid color
          itemSelected?.size?.uid, // uid size
        ],
        parent_sku: value?.sku, // sku parent
        sku: currentVariantAttributes?.product?.sku, //sku child
        quantity: 1,
      },
    ]

    if (!GETTOKEN.tokenAuth()) {
      const ConvertData = {
        id: currentVariantAttributes?.product?.sku,
        added_at: new Date(),
        defaultData: field_Val,
        bindData: {
          value,
          currentVariantAttributes,
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
      changeStateWishList(currentVariantAttributes?.product?.sku, value?.id, 'create')
      mutate(field_Val)
    }
  }

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

  const handleRemoveProdToWishList = (val: any) => {
    if (!GETTOKEN.tokenAuth()) {
      __RemoveSingleItemLocal({ key: 'favorite-product', data: { id: val?.id } })
        ? toast.success('Đã hủy sản phẩm yêu thích')
        : toast.error('Xóa thất bại')
      getDataFavorite()
    } else {
      changeStateWishList(currentVariantAttributes?.product?.sku, val?.id, 'remove')
      RemoveWishList([val?.id])
    }
  }

  const handleAddProdToCompare = () => {
    changeStateCompore(
      currentVariantAttributes?.product?.sku,
      currentVariantAttributes?.product?.uid,
      'create'
    )
    const getID = __getDataLocal({ key: 'compare-product', type: 'string' })
    const decodedString = Buffer?.from(currentVariantAttributes?.product?.uid, 'base64').toString(
      'utf-8'
    )
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
    changeStateCompore(currentVariantAttributes?.product?.sku, val?.uid, 'remove')
    RemoveItemCompare([val?.uid])
  }

  const foundItem = !GETTOKEN.tokenAuth()
    ? dataFavoriteLocal?.find((item: any) => item?.id === currentVariantAttributes?.product?.sku)
    : stateWishList?.find((item: any) => item?.sku === currentVariantAttributes?.product?.sku)

  const changeStateWishList = (sku: string, id: string, type: string) => {
    if (type == 'create') {
      const addState = [...stateWishList, { sku: sku, id: id }]
      setStateWishList(addState)
    } else {
      const removeItemState = stateWishList.filter((item: any) => item.sku !== sku)
      setStateWishList(removeItemState)
    }
  }

  const foundDataCompare = stateCompore?.find(
    (item: any) => item?.sku === currentVariantAttributes?.product?.sku
  )

  const changeStateCompore = (sku: string, uid: string, type: string) => {
    if (type == 'create') {
      const addState = [...stateCompore, { sku: sku, uid: uid }]
      setStateCompore(addState)
    } else {
      const removeItemState = stateCompore.filter((item: any) => item.sku !== sku)
      setStateCompore(removeItemState)
    }
  }

  const currentProduct = isConfigurableProduct ? currentVariantAttributes?.product : product

  const currentDailySale = currentProduct?.daily_sale
  const isCurrentInTimeDailySale = isCurrentTimeInRange(
    currentDailySale?.start_date ?? null,
    currentDailySale?.end_date ?? null
  )

  const finalValue =
    currentDailySale !== null && isCurrentInTimeDailySale
      ? currentDailySale?.sale_price
      : currentProduct?.price_range?.maximum_price?.final_price?.value ?? 0
  const finalCurrency = currentProduct?.price_range?.maximum_price?.final_price?.currency

  const renderTagNew = () => {
    const isNew = isCurrentTimeInRange(product?.new_from_date, product?.new_to_date)

    if (!isNew) return <div />
    return <small className="fsz-10 py-1 px-2 radius-2 bg-222 text-white text-uppercase">mới</small>
  }

  const renderRating = () => {
    if (product?.rating_summary === undefined) return null
    return (
      <div className="rating">
        <div className="stars">
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <i
                className={
                  index + 1 <= product.rating_summary
                    ? 'la la-star'
                    : index < product.rating_summary
                    ? 'la la-star-half'
                    : 'la la-star color-999'
                }
                key={index}></i>
            ))}
        </div>
        <span className="num"> ({product.review_count}) </span>
      </div>
    )
  }

  const renderPrice = () => {
    const _product = isConfigurableProduct ? currentVariantAttributes?.product : product

    const maximumPrice = _product?.price_range?.maximum_price
    const isHaveDailySale = _product?.daily_sale !== null
    const isHaveAmountOff = maximumPrice?.discount?.amount_off
    const _finalValue = FormatNumber(finalValue, '.')
    const regularPrice = FormatNumber(maximumPrice?.regular_price?.value ?? 0, '.')

    const isInTimeDiscount = isCurrentTimeInRange(
      _product?.daily_sale?.start_date ?? null,
      _product?.daily_sale?.end_date ?? null
    )
    if (isHaveDailySale && isInTimeDiscount) {
      const dailySale = _product?.daily_sale
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
          <h5 className="fsz-22 color-red1 fw-600">
            {`${_finalValue}${finalCurrency} `}
            <span className="old fsz-14 color-666 text-decoration-line-through">
              {`${regularPrice}${_product?.price_range.maximum_price.regular_price.currency}`}
            </span>
          </h5>
        </div>
      )
    }

    return (
      <div className="price mt-15">
        <h5 className="fsz-22 fw-600">{` ${_finalValue} ${finalCurrency}`}</h5>
      </div>
    )
  }

  const renderTags = () => {
    const tagsAttribute = product?.attributes?.filter(
      (attribute) => attribute?.attribute_code === 'tags'
    )?.[0]
    if (tagsAttribute?.value === '') return null

    const tags = tagsAttribute?.value?.split(', ')
    return (
      <div className="meta pb-20 d-flex flex-wrap">
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

  const renderImgGallery = () => {
    const mediaGallery = [
      ...(product?.media_gallery?.sort((a, b) => a?.position - b?.position) ?? []),
    ]
    const listImgSlider = isConfigurableProduct
      ? [{ ...currentVariantAttributes?.product?.image, disabled: false }, ...mediaGallery]
      : mediaGallery

    return listImgSlider?.map((item, index) => {
      if (item?.disabled === true) return null
      return (
        <SwiperSlide key={index}>
          <div className="img">
            <img src={item?.url} alt={item?.label ?? ''} onClick={() => setActiveSlider(index)} />
          </div>
        </SwiperSlide>
      )
    })
  }

  console.log(currentVariantAttributes, 'currentVariantAttributes')

  const renderConfigurableOptions = () => {
    if (!isConfigurableProduct) return null

    return product?.configurable_options
      ?.sort((a, b) => b?.position - a?.position)
      ?.map((optionConfig) => {
        return configurableOptions
          ?.filter((item) => item?.attribute_code === optionConfig?.attribute_code)
          ?.map((option) => {
            if (option?.attribute_code === ATTRIBUTE_CODE.COLOR) {
              return (
                <div key={option?.uid} className="mb-20">
                  <p className="color-666 mb-0">
                    <strong className="color-000 text-uppercase me-1"> Màu sắc: </strong>
                    <span> {itemSelected?.[option?.attribute_code]?.label} </span>
                  </p>
                  <div className="color-choose">
                    <div className="row gx-2 prod-list">
                      {option?.values?.map((value) => {
                        if (!value?.is_available) return null

                        const variantAttributes = handleGetVariantAttributes({
                          ...itemSelected,
                          color: value,
                        })

                        const dailySale = variantAttributes?.product?.daily_sale
                        const isInTimeDailySale = isCurrentTimeInRange(
                          dailySale?.start_date ?? null,
                          dailySale?.end_date ?? null
                        )
                        const _price =
                          dailySale !== null && isInTimeDailySale
                            ? dailySale?.sale_price
                            : variantAttributes?.product?.price_range?.maximum_price?.final_price
                                ?.value

                        return (
                          <div className="col-lg-4 prod-item" key={value?.uid}>
                            <div className="form-check">
                              <label
                                className="form-check-label w-full"
                                htmlFor={`color${value?.uid}`}
                                onClick={() => {
                                  setItemSelected({
                                    ...itemSelected,
                                    [option?.attribute_code]: value,
                                  }),
                                    setActiveSlider(0)
                                }}>
                                <div
                                  className={classNames('color-item', {
                                    'MN-border-active':
                                      value?.uid === itemSelected?.[option?.attribute_code]?.uid,
                                  })}>
                                  <div className="img">
                                    <img
                                      src={variantAttributes?.product?.image?.url}
                                      alt={variantAttributes?.product?.image?.label}
                                    />
                                  </div>
                                  <div className="inf">
                                    <p className="fsz-12 mb-0"> {value?.label} </p>
                                    <strong className="fsz-11">
                                      {FormatNumber(_price, '.')}{' '}
                                      {
                                        variantAttributes?.product?.price_range?.maximum_price
                                          ?.final_price?.currency
                                      }
                                    </strong>
                                  </div>
                                </div>
                              </label>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <div key={option?.uid} className="mb-20">
                <p className="color-666 mb-0">
                  <strong className="color-000 text-uppercase me-1"> {option?.label}: </strong>
                  <span> {itemSelected?.[option?.attribute_code]?.label} </span>
                </p>
                <div className="memory-choose mt-10 d-flex gap-1 flex-wrap">
                  {option?.values?.map((value) => {
                    // if(!value?.is_available) return null;
                    return (
                      <div className="form-check form-check-inline" key={value?.uid}>
                        <label
                          className={classNames('form-check-label', {
                            disable: !value?.is_available,
                            'MN-border-active':
                              value?.uid === itemSelected?.[option?.attribute_code]?.uid,
                          })}
                          htmlFor={`memory${value?.uid}`}
                          onClick={() =>
                            setItemSelected({
                              ...itemSelected,
                              [option?.attribute_code]: value,
                            })
                          }>
                          {value?.label}
                        </label>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })
      })
  }

  const renderCategoryBrand = () => {
    let categories: ProductDetailCategory | any = []
    let brands: ProductDetailCategory | any = []

    product?.categories?.map((category) => {
      if (category?.url_path === 'thuong-hieu') return
      if (category?.url_path?.includes('thuong-hieu')) return brands.push(category)
      return categories?.push(category)
    })

    return (
      <>
        <p className="color-666 mb-0">
          <strong className="color-000 text-uppercase me-1"> Danh mục: </strong>
          {categories?.map((category: ProductDetailCategory, index: number) => (
            <Link
              href={`/products/?category_uid=${category?.uid}`}
              key={category?.uid}
              className="me-2 hover-color">
              {category?.name}
              {index + 1 !== categories?.length ? ',' : '.'}
            </Link>
          ))}
        </p>
        <p className="color-666 mb-0">
          <strong className="color-000 text-uppercase me-1"> Thương hiệu: </strong>
          {brands?.map((brand: ProductDetailCategory, index: number) => (
            <Link
              href={`/products/?category_uid=${brand?.uid}`}
              key={brand?.uid}
              className="me-2 hover-color">
              {brand?.name}
              {index + 1 !== brands?.length ? ',' : '.'}
            </Link>
          ))}
        </p>
      </>
    )
  }

  const foundItemFetching = !GETTOKEN.tokenAuth()
    ? dataFavoriteLocal?.find((item: any) => item?.id === currentVariantAttributes?.product?.sku)
    : dataInfoCus?.find(
        (item: any) => item?.configured_variant?.sku === currentVariantAttributes?.product?.sku
      )

  const foundDataCompareFetching = dataitemCompare?.find(
    (item: any) => item?.sku === currentVariantAttributes?.product?.sku
  )

  return (
    <div className="home-style3 sin-prod-pg-1">
      <Breadcrumb
        items={[
          {
            title: 'Trang chủ',
            href: '/',
          },
          {
            title: 'Sản phẩm',
            href: '/products',
          },
          {
            title: product?.categories?.[0]?.name ?? '',
            href: product?.categories?.[0]
              ? `/products/?category_uid=${product?.categories?.[0]?.uid}`
              : '#',
          },
          {
            title: product?.name ?? '',
            href: '#',
          },
        ]}
      />

      <section className="product-main-details p-30 radius-4 bg-white mt-3 wow fadeInUp">
        <div className="row">
          <div className="col-lg-5">
            <div className="img-slider">
              <div className="top-title">
                {renderTagNew()}

                <div className="icons">
                  <span className="icon icon-plus">
                    <i className="la la-plus"></i>
                  </span>
                  <div className="collapse-icons">
                    {/* <span className="icon icon-plus">
                      <i className="la la-eye"></i>
                    </span> */}
                    <span
                      className={`icon icon-plus ${foundDataCompare ? 'active' : ''}`}
                      onClick={() => {
                        foundDataCompare
                          ? handleRemoveItemCompare(foundDataCompareFetching)
                          : handleAddProdToCompare()
                      }}
                      style={{
                        pointerEvents: `${
                          LoadingCreateCompare || LoadingAddCompare || LoadingRemoveItemCompare
                            ? 'none'
                            : 'auto'
                        }`,
                      }}>
                      {' '}
                      <i className="la la-sync"></i>{' '}
                    </span>
                    <span
                      className="icon icon-plus"
                      onClick={() => {
                        const selectedOptions =
                          Object.values(itemSelected)?.map((option) => option?.uid) ?? []
                        onAddProducts([
                          { sku: product?.sku ?? '', quantity, selected_options: selectedOptions },
                        ])
                      }}>
                      {isCartLoading ? <Spinner /> : <i className="la la-shopping-cart"></i>}
                    </span>
                    <span
                      className={`icon icon-plus fav-btn  ${foundItem ? 'active' : ''}`}
                      style={{
                        pointerEvents: `${
                          LoadingAddWishList || LoadingRemoveWishList ? 'none' : 'auto'
                        }`,
                      }}
                      onClick={() =>
                        foundItem
                          ? handleRemoveProdToWishList(foundItemFetching)
                          : handleAddProdToWishList(product)
                      }>
                      <i className="las la-heart"></i>
                    </span>
                  </div>
                </div>
              </div>
              <div className="swiper-container gallery-top">
                <Swiper
                  ref={swiperGalleryTopRef}
                  slidesPerView={1}
                  spaceBetween={0}
                  loop={false}
                  pagination={{
                    clickable: true,
                  }}
                  navigation={true}
                  modules={[Navigation]}
                  className="swiper-wrapper-flex">
                  {renderImgGallery()}
                </Swiper>
              </div>
              <div className="swiper-container gallery-thumbs">
                <Swiper
                  slidesPerView={5}
                  spaceBetween={0}
                  loop={false}
                  pagination={{
                    clickable: true,
                  }}
                  navigation={true}
                  modules={[Navigation]}
                  className="swiper-wrapper-flex">
                  {renderImgGallery()}
                </Swiper>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="info">
              {renderRating()}
              <h4 className="product_title">
                <a href="#"> {product?.name} </a>
              </h4>

              {renderPrice()}

              <div className="wrapper-desc-detail">
                <div
                  ref={contentRef}
                  className={isExpanded ? 'clamped-content' : 'content-detail-prod'}
                  dangerouslySetInnerHTML={{ __html: productDescription ?? '' }}
                />
                {isExpanded && (
                  <span onClick={() => setIsExpanded(!isExpanded)} className="txt-see-more">
                    xem thêm
                  </span>
                )}
              </div>

              {renderTags()}

              {isConfigurableProduct ? (
                <div className="color-content">{renderConfigurableOptions()}</div>
              ) : null}

              {/* <div className="gift-card mb-20">
                <div className="gift-img">
                  <img src="/assets/images/inner/gift.png" alt="" />
                </div>
                <div className="gift-info">
                  <ul className="p-0">
                    <li className="fsz-14">
                      <i className="icon-3 bg-000 me-1"></i> Buy{' '}
                      <span className="color-red2 fw-bold"> 02 </span> boxes get a
                      <strong> Snack Tray </strong>
                    </li>
                    <li className="fsz-14">
                      <i className="icon-3 bg-000 me-1"></i> Buy{' '}
                      <span className="color-red2 fw-bold"> 04 </span> boxes get a free
                      <strong> Block Toys </strong>
                    </li>
                  </ul>
                  <p className="fsz-12 color-666 mt-20 fst-italic">
                    Promotion will expires in: 9h00pm, 25/5/2024
                  </p>
                </div>
              </div> */}

              <p className="color-666 mt-3 mb-0">
                <strong className="color-000 text-uppercase me-1"> SKU: </strong>
                <span> {product?.sku} </span>
              </p>
              {renderCategoryBrand()}
              <div className="social-icons social-icons mt-20 mb-20">
                <a href="https://www.facebook.com/mubaohiemchinhhang.com.vn/">
                  {' '}
                  <FontAwesomeIcon icon={['fab', 'facebook']} />{' '}
                </a>
                <a href="https://www.instagram.com/mubaohiemchinhhangvn/">
                  {' '}
                  <FontAwesomeIcon icon={['fab', 'instagram']} />{' '}
                </a>
                <a href="https://www.youtube.com/@thegioimubaohiem7307">
                  {' '}
                  <FontAwesomeIcon icon={['fab', 'youtube']} />{' '}
                </a>
                <a href="https://www.tiktok.com/@vuamu">
                  {' '}
                  <FontAwesomeIcon icon={['fab', 'tiktok']} />{' '}
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-3">
            <div className="payment-side">
              <div className="payment-card">
                <small className="fsz-12 color-666 text-uppercase mb-2"> Tông giá: </small>
                <h5 className="fsz-30 fw-bold">
                  {FormatNumber(finalValue * quantity, '.')} {finalCurrency}
                </h5>
                {/* <div className="affirm fsz-12 lh-1 d-flex align-items-end py-3 border-bottom">
                  <img src="/assets/images/inner/affirm.png" alt="" className="logo me-3 pb-1" />
                  <strong className="text-danger me-1"> $49/m </strong>
                  <span> in 12 months. </span>
                  <a href="#" className="text-decoration-underline text-primary">
                    See more
                  </a>
                </div> */}

                {/* {currentVariantAttributes?.product?.stock_status == 'IN_STOCK' ? (
                  <p className="fsz-12 mt-3">
                    <i className="fas fa-check-circle color-green2 me-1"></i> Còn hàng
                  </p>
                ) : (
                  <p className="fsz-12 mt-3"> */}

                {currentProduct?.stock_status === 'IN_STOCK' ? (
                  <p className="fsz-12 mt-2">
                    <i className="fas fa-check-circle color-green2 me-1"></i> Còn hàng
                  </p>
                ) : (
                  <p className="fsz-12 mt-2">
                    <i className="fas fa-times-circle color-red1 me-1"></i> Hết hàng
                  </p>
                )}
                <div className="add-more">
                  <span
                    className="qt-minus pointer"
                    onClick={() => {
                      if (quantity > 1) setQuantity(quantity - 1)
                    }}>
                    <i className="fas fa-minus"></i>
                  </span>
                  <input
                    type="text"
                    className="qt border-0"
                    value={quantity}
                    min="1"
                    onChange={(e) => {
                      const value = Number(e?.target?.value)
                      if (!isNaN(value)) setQuantity(Number(value))
                    }}
                  />
                  <span className="qt-plus pointer" onClick={() => setQuantity(quantity + 1)}>
                    <i className="fas fa-plus"></i>
                  </span>
                </div>
                <button
                  className="butn none-border bg-green2 text-white radius-4 fw-500 fsz-12 text-uppercase text-center mt-10 w-100 py-3 mb-0"
                  onClick={() => {
                    const selectedOptions =
                      Object.values(itemSelected)?.map((option) => option?.uid) ?? []
                    onAddProducts([
                      { sku: product?.sku ?? '', quantity, selected_options: selectedOptions },
                    ])
                  }}>
                  {isCartLoading && <Spinner />}
                  <span className="text-white"> Thêm vào giỏ hàng </span>
                </button>
                {/* <a
                  href="#"
                  className="butn bg-orange1 color-000 radius-4 fw-500 fsz-12 text-uppercase text-center mt-10 w-100 py-3">
                  <span>
                    Mua với <img src="/assets/images/inner/paypal.png" alt="" className="ms-1" />
                  </span>
                </a> */}
                <div className="d-flex color-666 fsz-13 py-3 border-bottom">
                  <div
                    className="me-4 pe-4 border-end cls-cursor"
                    style={{
                      pointerEvents: `${
                        LoadingAddWishList || LoadingRemoveWishList ? 'none' : 'auto'
                      }`,
                    }}
                    onClick={() =>
                      foundItem
                        ? handleRemoveProdToWishList(foundItemFetching)
                        : handleAddProdToWishList(product)
                    }>
                    <i className={`fas fa-heart ${foundItem ? 'color-green2' : ''} me-1`}></i> Yêu
                    thích
                  </div>
                  <div
                    className="cls-cursor"
                    onClick={() => {
                      foundDataCompare
                        ? handleRemoveItemCompare(foundDataCompareFetching)
                        : handleAddProdToCompare()
                    }}
                    style={{
                      pointerEvents: `${
                        LoadingCreateCompare || LoadingAddCompare || LoadingRemoveItemCompare
                          ? 'none'
                          : 'auto'
                      }`,
                    }}>
                    <i className={`fas la-sync ${foundDataCompare ? 'color-green2' : ''} me-1`}></i>{' '}
                    So sánh
                  </div>
                </div>
                <ListCardPayment />
              </div>
              <div className="payment-card">
                <span className="q-order py-2 px-3 radius-3 bg-333 text-white">
                  <i className="la la-tty me-1"></i> <small> Đặt hàng nhanh 24/7 </small>
                </span>
                {/* <h5 className="fsz-22 mt-3 fw-bold">{InforMationStore?.[0]?.telephone_1}</h5>
                {InforMationStore?.[0]?.telephone_2 && (
                  <h5 className="fsz-22 mt-3 fw-bold">{InforMationStore?.[0]?.telephone_2}</h5>
                )} */}
                {InforMationStore?.map((val: any, idx: number) => {
                  return (
                    <React.Fragment key={idx}>
                      <p className="text-uppercase mt-3 p-0 m-0 mb-1">{val?.name}</p>
                      <h5 className="fsz-16 fw-bold">
                        {[val?.telephone_1, val?.telephone_2].filter(Boolean).join(' - ')}
                      </h5>
                    </React.Fragment>
                  )
                })}
              </div>
              <p className="color-000 mt-15">
                <i className="fas fa-shipping-fast me-2"></i>
                <span className="color-666"> Ships from </span> <strong> United States </strong>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* <ProductBuyTogether /> */}
      <Details product={product} urlKey={product?.url_key ?? ''} />
      <RelatedProducts products={product?.related_products} />
      <RecentlyViewed />
    </div>
  )
}

export default ProductDetailPage
