/* eslint-disable @next/next/no-img-element */
import { useMutation, useQueryClient } from 'react-query'
import { compareApi } from '@/services'
import cartApi from '@/services/cart'
import { toast } from 'react-toastify'
import { __getDataLocal, __RemoveSingleItemLocal } from '@/helper/local_helper/localStogare'
import { Spinner } from '@/components/spinner'

export const CompareBtn = ({ val, cartId, dataCompare }: any) => {
  const queryClient = useQueryClient()
  const { isLoading: LoadingRemoveItemCompare, mutate: RemoveItemCompare } = useMutation({
    mutationFn: async (data: any) => {
      return await compareApi.removeItemCompare({
        input: {
          products: data,
          uid: __getDataLocal({ key: 'compare-product', type: 'string' }),
        },
      })
    },
    onSuccess: (response: any) => {
      if (response.removeProductsFromCompareList) {
        toast.success('Xóa thành công')
        queryClient.invalidateQueries(['getCompare'])
      }
    },
    onError: () => {},
  })

  const { isLoading: isLoadingAddProductToCart, mutate: mutateAddProductToCart } = useMutation({
    mutationFn: async (parameter: any) => {
      return await cartApi.addProduct(parameter)
    },
    onSuccess: async (res: any) => {
      const res_data = res?.addProductsToCart
      if (res_data?.user_errors?.length > 0) {
        toast.error(res_data?.user_errors?.[0]?.message)
        return
      }
      if (!!res_data?.cart) {
        await queryClient.refetchQueries(['GET_CART', cartId])
        // removeItemLocal(param?.val, false)
        toast.success('Thêm sản phẩm vào giỏ hàng thành công!')
      }
    },
    onError: () => {
      toast.error('Lỗi! Đã có lỗi xảy ra, vui lòng thử lại.')
    },
  })

  const handleRemoveItem = (val: any) => {
    RemoveItemCompare([val?.uid])
  }

  const handleAddToCart = (val: any) => {
    const paramData = {
      cartId: cartId,
      cartItems: [
        {
          sku: val?.sku,
          quantity: 1,
        },
      ],
    }
    mutateAddProductToCart(paramData)
  }

  let labelAttributes: any = {}
  dataCompare?.attributes?.map((attribute: any) => {
    labelAttributes = {
      ...labelAttributes,
      [attribute?.code]: attribute?.label,
    }
  })

  return (
    <div className="item_detail btn-compare">
      <div className="ic-remove" onClick={() => handleRemoveItem(val)}>
        {LoadingRemoveItemCompare ? (
          <Spinner className="w-[16px] h-[16px] mr-[8px]" />
        ) : (
          <svg
            stroke="currentColor"
            fill="none"
            stroke-width="2"
            viewBox="0 0 24 24"
            stroke-linecap="round"
            stroke-linejoin="round"
            height="22"
            width="22"
            xmlns="http://www.w3.org/2000/svg">
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <path
              d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007h16zm-9.489 5.14a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z"
              stroke-width="0"
              fill="currentColor"></path>
            <path
              d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005h4z"
              stroke-width="0"
              fill="currentColor"></path>
          </svg>
        )}
      </div>
      <div
        onClick={() => handleAddToCart(val)}
        style={{
          border: 'none',
          cursor: 'pointer',
          margin: 0,
          pointerEvents: isLoadingAddProductToCart ? 'none' : 'auto',
        }}
        className="butn bg-green2 text-white radius-4 fw-500 fsz-14 text-uppercase text-center px-5">
        {isLoadingAddProductToCart && <Spinner className="w-[16px] h-[16px] mr-[8px]" />}
        Thêm vào giỏ hàng
      </div>
    </div>
  )
}
