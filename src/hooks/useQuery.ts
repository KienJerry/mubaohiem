import { useState } from 'react'
import useSWR from 'swr'

import { DEFAULT_LIMIT } from '@/constants'
import type {
  HTTPResponse,
  ListRes,
  QueryList,
  QueryListFetchMoreFunction,
  QueryListFunction,
  QueryListPaginateFunction,
  UseQueryListRes,
} from '@/types'
import { AxiosPromise } from 'axios'
import { PublicConfiguration } from 'swr/_internal'

// KDL khi khởi tạo custom hook này: sẽ có 2 types cần truyền vào: Res là KDL của data, Req là KDL của params
export interface UseQueryListProps<Res, Req extends QueryList = any> {
  fetcher: (params?: any) => AxiosPromise<HTTPResponse<ListRes<Res>>>
  key: string | null
  initialParams?: Req
  config?: Partial<PublicConfiguration<any, any, (args_0: string) => any>>
}

export const useQueryList = <Res, Req extends QueryList = any>({
  fetcher,
  key,
  initialParams,
  config,
}: UseQueryListProps<Res, Req>): UseQueryListRes<Res, Req> => {
  const {
    isValidating: _isValidating,
    isLoading,
    data,
    error,
    mutate,
  } = useSWR<Res[], any, any>(key, fetcherHandler as any, config)
  const limit = initialParams?.limit || DEFAULT_LIMIT
  const [total, setTotal] = useState<number>(0)
  const hasMore = (data?.length || 0) < total
  const [offset, setOffset] = useState<number>(0)
  const [isValidating, setValidating] = useState<boolean>(false)
  const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false)
  const [params, setParams] = useState<Req>({
    ...initialParams,
    limit,
    offset: 0,
  } as any)

  async function fetcherHandler(): Promise<Res[]> {
    try {
      const res = await fetcher(params)
      return getDataResponse(res)
    } catch (error) {
      return []
    }
  }

  const getDataResponse = <Res>(res: any): Res[] => {
    setTotal(res?.data?.result?.data?.total_product)
    return res?.data?.result?.data?.products || []
  }

  const refresh = () => {
    mutate()
    setOffset(0)
    setValidating(false)
    setIsLoadingMore(false)
    setParams(initialParams || ({ limit, offset: 0 } as any))
  }

  const filter = async (_params: QueryListFunction<Res, Req>) => {
    try {
      setValidating(true)
      const newParams = { ...params, ..._params, limit, offset: 0 }
      const res = await (_params?.fetcher?.(newParams) || fetcher(newParams))
      const dataRes = getDataResponse<Res>(res)

      setParams(newParams)
      setValidating(false)
      setOffset(0)
      // setHasMore(products?.length >= limit)

      mutate(dataRes, false)
    } catch (error) {
      setValidating(false)
    }
  }

  const getMore = async (_params?: QueryListFetchMoreFunction<Res, Req>) => {
    if (!hasMore || isLoadingMore || isValidating || isLoading) return

    try {
      setIsLoadingMore(true)
      const newOffset = offset + limit
      const newParams = { ...params, limit, offset: newOffset } as Req

      const res = await (_params?.fetcher?.(newParams) || fetcher(newParams))
      const dataRes = getDataResponse<Res>(res)

      setIsLoadingMore(false)
      setParams(newParams)
      setOffset(offset + limit)

      mutate([...(data || []), ...dataRes], false)
    } catch (error) {
      setIsLoadingMore(false)
    }
  }

  const paginate = async (_params: QueryListPaginateFunction<Res, Req>) => {
    try {
      setValidating(true)
      const newOffset = (_params.params.page - 1) * limit
      const newParams = { ...params, limit, offset: newOffset } as Req

      const res = await (_params?.fetcher?.(newParams) || fetcher(newParams))
      const dataRes = getDataResponse<Res>(res)

      setValidating(false)
      setParams(newParams)
      setOffset(newOffset)

      mutate(dataRes, false)
    } catch (error) {
      setValidating(false)
    }
  }

  return {
    data,
    total,
    isValidating: isValidating || _isValidating,
    isLoading,
    isLoadingMore,
    hasMore,
    offset,
    error,
    params,
    limit,
    paginate,
    getMore,
    filter,
    mutate,
    refresh,
  }
}
