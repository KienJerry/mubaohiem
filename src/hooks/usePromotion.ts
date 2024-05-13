import useCart from './useCart'
import { toast } from 'react-toastify'
import { useMutation } from 'react-query'
import { useSelector } from 'react-redux'

import promotionAPI from '@/services/promotion'
import { RootState, useAppDispatch } from '@/store'
import { updateLoading } from '@/store/loadingHookSlice'

const usePromotion = () => {
  const dispatch = useAppDispatch()

  const { onRefreshCart } = useCart()

  const { isLoadingHandleVoucher: isLoadingHookHandleVoucher } = useSelector(
    (state: RootState) => state?.loading
  )

  const { mutate: mutateApplyVoucher, isLoading: isLoadingApplyVoucher } = useMutation({
    mutationFn: async (variable: { cart_id: string, coupon_code: string }) => {
      return await promotionAPI.apply(variable)
    },
    onSuccess: (response: any) => {
      if (!response?.applyCouponToCart) {
        handleSetLoading(false)
        return response
      }

      toast.success('Thành công! Đã áp dụng mã giảm giá.')
      onRefreshCart()
    },
  })

  const { mutate: mutateRemoveVoucher, isLoading: isLoadingRemoveVoucher } = useMutation({
    mutationFn: async (variable: { cartId: string, callBackFn?: () => void }) => {
      return await promotionAPI.remove(variable.cartId).then((res) => {
        variable?.callBackFn?.()
        return res
      })
    },
    onSuccess: () => {
      onRefreshCart()
    },
  })

  const handleSetLoading = (isLoading: boolean) => {
    dispatch(
      updateLoading({
        isLoadingHandleVoucher: isLoading,
      })
    )
  }

  const handleApplyVoucher = (variable: { cart_id: string, coupon_code: string }) => {
    if (!isLoadingHookHandleVoucher) handleSetLoading(true)
    return mutateApplyVoucher(variable)
  }

  const handleRemoveVoucher = (variable: { cartId: string, callBackFn?: () => void }) => {
    if (!isLoadingHookHandleVoucher) handleSetLoading(true)
    return mutateRemoveVoucher(variable)
  }

  return {
    isLoadingHandleVoucher: isLoadingApplyVoucher || isLoadingRemoveVoucher,
    onApplyVoucher: handleApplyVoucher,
    onRemoveVoucher: handleRemoveVoucher,
  }
}

export default usePromotion
