import { setBackdropVisible } from '@/store'
import type { AsyncHandler } from '@/types'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toast'

interface Res {
  asyncHandler: <T>(params: AsyncHandler<T>) => void
  isLoading: boolean
}

const useAsync = (): Res => {
  const dispatch = useDispatch()
  const [isLoading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    return () => {
      dispatch(setBackdropVisible(false))
    }
  }, [dispatch])

  // const backdropHandler = (showBackdrop: boolean, show: boolean) => {
  //   showBackdrop && dispatch(setBackdropVisible(show))
  // }

  const asyncHandler = useCallback(
    async <T>(params: AsyncHandler<T>) => {
      const { fetcher, config, onSuccess, onError } = params
      const method = config?.method || 'POST'
      const {
        errorMsg,
        successMsg,
        showBackdrop = method !== 'GET',
        showErrorMsg = method !== 'GET',
        showSuccessMsg = method !== 'GET',
        setLoadingState,
        disabledLoading = true,
      } = config || {}

      try {
        setLoadingState && setLoading(true)
        showBackdrop && dispatch(setBackdropVisible(true))
        const res = await fetcher
        setLoadingState && setLoading(false)
        showBackdrop && disabledLoading && dispatch(setBackdropVisible(false))

        if (res?.data?.success) {
          showSuccessMsg && toast.success(successMsg || res?.data?.message)
          onSuccess?.(res?.data?.response)
        } else {
          onError?.(res)
          showErrorMsg && toast.error(errorMsg || res?.data?.message || 'Có lỗi xảy ra')
        }
      } catch (error) {
        showErrorMsg && toast.error(errorMsg || 'Có lỗi xảy ra')
        showBackdrop && disabledLoading && dispatch(setBackdropVisible(false))
        setLoadingState && setLoading(false)
        onError?.(undefined)
      }
    },
    [dispatch]
  )

  return {
    asyncHandler,
    isLoading,
  }
}

export { useAsync }
