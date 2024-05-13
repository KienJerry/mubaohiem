/* eslint-disable @next/next/no-img-element */
import React, { FC, useEffect, useState } from 'react'
import Link from 'next/link'
import { FormatNumber, isCurrentTimeInRange } from '@/helper'
import { CONFIGURABLE_PRODUCT } from '../pages/product/constants'
import { __getDataLocal, __CreateDataLocal } from '@/helper/local_helper/localStogare'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { compareApi } from '@/services'
import { toast } from 'react-toastify'

type ProductCardShort = {
  data: Product,
}

const ProductCardShort: FC<ProductCardShort> = ({ data }) => {
  const queryClient = useQueryClient()
  const SimpleProduct: any = data?.variants?.[0] // Default sản phẩm con
  const [stateCompore, setStateCompore] = useState<any>([])
  const isConfigurableProduct = data?.__typename === CONFIGURABLE_PRODUCT
  const productActive = isConfigurableProduct ? data?.variants?.[0]?.product : data

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
    onError: () => { },
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
    onError: () => { },
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
    onError: () => { },
  })

  const dataitemCompare = dataCompare?.items || []
  useEffect(() => {
    if (dataitemCompare?.length > 0 && stateCompore?.length == 0) {
      const field_Sku = dataitemCompare?.map((item: any) => ({ sku: item?.sku, uid: item?.uid }))
      setStateCompore(field_Sku)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataitemCompare])

  const handleAddProdToCompare = () => {
    changeStateCompore(SimpleProduct?.product?.sku, SimpleProduct?.product?.uid, 'create')
    const getID = __getDataLocal({ key: 'compare-product', type: 'string' })
    const decodedString = Buffer?.from(SimpleProduct?.product?.uid, 'base64').toString('utf-8')
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
    changeStateCompore(SimpleProduct?.product?.sku, val?.uid, 'remove')
    RemoveItemCompare([val?.uid])
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

  const renderTopInfo = () => {
    let percentOff = productActive?.price_range?.maximum_price?.discount?.percent_off
    const isNewItem = isCurrentTimeInRange(data?.new_from_date, data?.new_to_date)

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

    const foundDataCompare = stateCompore?.find(
      (item: any) => item?.sku === SimpleProduct?.product?.sku
    )

    const foundDataCompareFetching = dataitemCompare?.find(
      (item: any) => item?.sku === SimpleProduct?.product?.sku
    )

    return (
      <div className="top-inf">
        {!!percentOff ? (
          <div className="dis-card">
            <small className="fsz-10 d-block text-uppercase">save</small>
            <h6 className="fsz-10 mb-0">{percentOff}%</h6>
          </div>
        ) : isNewItem ? (
          <small className="fsz-10 py-1 px-2 radius-2 bg-222 text-white text-uppercase">Mới</small>
        ) : null}

        <div
          onClick={() => {
            foundDataCompare
              ? handleRemoveItemCompare(foundDataCompareFetching)
              : handleAddProdToCompare()
          }}
          className={`fav-btn ${foundDataCompare ? 'active' : ''}`}
          style={{
            pointerEvents: `${LoadingCreateCompare || LoadingAddCompare || LoadingRemoveItemCompare
              ? 'none'
              : 'auto'
              }`,
          }}>
          <i className="las la-sync-alt"></i>
        </div>
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
                  index + 1 <= data.rating_summary
                    ? 'la la-star'
                    : index < data.rating_summary
                      ? 'la la-star-half'
                      : 'la la-star color-999'
                }
                key={index}></i>
            ))}
        </div>
        <span className="num"> ({data.review_count}) </span>
      </div>
    )
  }

  const renderPrice = () => {
    const dailySale = productActive?.daily_sale
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

    const isInTimeDailySale = isCurrentTimeInRange(
      dailySale?.start_date ?? null,
      dailySale?.end_date ?? null
    )
    if (dailySale !== null && isInTimeDailySale) {
      const priceSale = FormatNumber(dailySale?.sale_price ?? 0, '.')

      return (
        <h6 className="fsz-16 fw-bold mb-0">
          <span className="color-red1 fw-600"> {`${priceSale}${finalCurrency} `} </span>
          <span className="old fsz-14 color-666 text-decoration-line-through ms-2">
            {`${regularPrice}${data?.price_range.maximum_price.regular_price.currency}`}
          </span>
        </h6>
      )
    }

    if (isHaveAmountOff) {
      return (
        <h6 className="fsz-16 fw-bold">
          <span className="color-red1 fw-600"> {`${finalValue}${finalCurrency} `} </span>
          <span className="old fsz-14 color-666 text-decoration-line-through ms-2">
            {`${regularPrice}${data?.price_range.maximum_price.regular_price.currency}`}
          </span>
        </h6>
      )
    }

    return <h6 className="fsz-16 fw-bold">{`${finalValue} ${finalCurrency}`}</h6>
  }

  if (!data) return null
  return (
    <div className="product-card">
      {renderTopInfo()}

      <div className="row gx-0">
        <div className="col-5">
          <Link href={`/products/${data?.url_key}`} className="img">
            <img loading="lazy" src={data?.image?.url} alt="" className="img-contain" />
          </Link>
        </div>
        <div className="col-7">
          <div className="info">
            {renderRating()}

            <Link
              href={`/products/${data?.url_key}`}
              className="title fsz-13 fw-bold mb-8 hover-green2 pe-4">
              {data?.name}
            </Link>

            {renderPrice()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCardShort
