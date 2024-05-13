import Breadcrumb from '@/components/Breadcrumb'
import EmptyData from '@/components/boxLayout/EmptyData'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import productApi from '@/services/product'
import { toast } from 'react-toastify'
import LoadingData from '@/components/boxLayout/LoadingData'
import { __getDataLocal, __RemoveSingleItemLocal } from '@/helper/local_helper/localStogare'
import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/store'
import { COOKIE_KEY } from '@/services/graphql'
import Cookies from 'js-cookie'
import { createFavorite } from '@/store/favoriteSlice'
import FavoriteCard from './CardFavorite'

export const FavoriteProductPage = () => {
  const queryClient = useQueryClient()
  const dispatch = useAppDispatch()
  const [fieldData, setFieldData] = useState([])
  const { data: dataInfoCustomer, isLoading } = useQuery({
    queryKey: ['getWishlists'],
    queryFn: async () => {
      return await productApi
        .getWishlist({ currentPage: 1, pageSize: 20 })
        .then((response: any) => {
          return response?.customer?.wishlists || []
        })
    },
    enabled: !!Cookies.get(COOKIE_KEY?.ACCESS_TOKEN) || false,
  })

  const { mutate } = useMutation({
    mutationFn: async (data: any) => {
      return await productApi.removeItemWishList({
        wishlistId: dataInfoCustomer?.[0]?.id,
        wishlistItemsIds: data,
      })
    },
    onSuccess: (response: any) => {
      if (!!response?.removeProductsFromWishlist?.wishlist) {
        toast.success('Xóa thành công')
        queryClient.invalidateQueries(['getWishlists'])
      }
    },
    onError: () => {},
  })

  useEffect(() => {
    let convertGetData =
      dataInfoCustomer?.[0]?.items_v2?.items ||
      __getDataLocal({ key: 'favorite-product', type: 'array' }) ||
      []
    setFieldData(convertGetData)
  }, [dataInfoCustomer])

  const handleRemoveItem = (val: any) => {
    if (!Cookies.get(COOKIE_KEY?.ACCESS_TOKEN)) {
      removeItemLocal(val, true)
      return
    }
    mutate([val])
  }

  const removeItemLocal = (val: any, showMesage: boolean) => {
    if (showMesage) {
      __RemoveSingleItemLocal({ key: 'favorite-product', data: { id: val?.id } })
        ? toast.success('Xóa thành công')
        : toast.error('Xóa thất bại')
    } else {
      __RemoveSingleItemLocal({ key: 'favorite-product', data: { id: val?.id } })
    }
    const getLength = __getDataLocal({ key: 'favorite-product', type: 'array' }) || []
    setFieldData(getLength)
    dispatch(createFavorite(getLength?.length))
  }

  const handleCopy = (text: any) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success('Đã sao chép thành công')
      })
      .catch((error) => {
        toast.error('Sao chép thất bại:', error)
      })
  }

  const getLinkShare = `${window.location.href}?code=123`

  return (
    <div className="home-style3 wrapper-favorite-product">
      <Breadcrumb
        items={[
          {
            title: 'Trang chủ',
            href: '/',
          },
          {
            title: 'Sản phẩm yêu thích',
            href: '/favorite-product',
          },
        ]}
      />

      <div className="wrapper-bg">
        {fieldData?.length > 0 ? (
          <div className="list-items">
            <div className="cart-pg-1 favorite-items">
              {fieldData?.map((val: any) => {
                return (
                  <FavoriteCard
                    key={val?.id}
                    data={
                      val?.bindData?.currentVariantAttributes?.product ??
                      val?.bindData?.dataItemSelected?.product ??
                      val?.configured_variant
                    }
                    parameterSelected={val?.defaultData}
                    onRemoveFavorites={() =>
                      handleRemoveItem(
                        !Cookies.get(COOKIE_KEY?.ACCESS_TOKEN) || false ? val : val?.id
                      )
                    }
                  />
                )
              })}
            </div>

            <div className="favorite_search">
              <div className="txt-text">Link sản phẩm yêu thích:</div>
              <div className="search_form">
                <input type="text" placeholder={getLinkShare} disabled />
                <div className="btn-copy" onClick={() => handleCopy(getLinkShare)}>
                  Sao chép
                </div>
              </div>
            </div>
          </div>
        ) : isLoading ? (
          <LoadingData />
        ) : (
          <div className="bg-no-data">
            <EmptyData />
            <h5>Không có sản phẩm yêu thích</h5>
          </div>
        )}
      </div>
    </div>
  )
}
