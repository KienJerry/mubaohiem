/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { useQuery } from 'react-query'
import productApi from '@/services/product'
import Cookies from 'js-cookie'
import { COOKIE_KEY, GETTOKEN } from '@/services/graphql'
import { RootState } from '@/store'
import { useSelector } from 'react-redux'
import { __getDataLocal } from '@/helper/local_helper/localStogare'
import { compareApi } from '@/services'

export const NavIC = () => {
  const { FavoriteLength } = useSelector((state: RootState) => state.favorite)

  const { data: dataLengthWishList } = useQuery({
    queryKey: ['getWishlists'],
    queryFn: async () => {
      return await productApi
        .getWishlist({ currentPage: 1, pageSize: 20 })
        .then((response: any) => {
          return response?.customer?.wishlists || []
        })
    },
    enabled: typeof window !== 'undefined' ? !!Cookies.get(COOKIE_KEY?.ACCESS_TOKEN) : false,
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
  })

  return (
    <div className="icons">
      <Link href="/compare" className="icon-link">
        <i className="las la-sync-alt"></i>
        {dataCompare?.items?.length > 0 && (
          <span className="num">{dataCompare?.items?.length}</span>
        )}
      </Link>
      <Link href="/favorite-product" className="icon-link">
        <i className="lar la-heart"></i>
        {!!GETTOKEN.tokenAuth()
          ? dataLengthWishList?.[0]?.items_count > 0 && (
              <span className="num">{dataLengthWishList?.[0]?.items_count}</span>
            )
          : FavoriteLength > 0 && <span className="num">{FavoriteLength}</span>}
      </Link>
      <Link href="/profile" className="icon-link">
        <i className="las la-user"></i>
      </Link>
    </div>
  )
}
