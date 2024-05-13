import { AxiosPromise } from 'axios'
import type { KeyedMutator } from 'swr'

export type HTTPResponse<T> = {
  success: boolean
  status: number
  message: string
  response: T
  exception?: any
  arguments?: any
  context?: any
}

export interface HTTPConfig {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  showBackdrop?: boolean
  errorMsg?: string
  successMsg?: string
  showErrorMsg?: boolean
  showSuccessMsg?: boolean
  setLoadingState?: boolean
  disabledLoading?: boolean
}

export interface AsyncHandler<T> {
  fetcher: AxiosPromise<HTTPResponse<T>>
  config?: HTTPConfig
  onSuccess?: (params: T) => void
  onError?: (data: any) => void
}

export interface AsyncHandlerParams<Params, Response> {
  params: Params
  onError?: (data: any) => void
  onSuccess?: (params: Response) => void
  config?: HTTPConfig
}

export type AsyncHandlerNoFetcher<T> = Omit<AsyncHandler<T>, 'fetcher'>

export type QueryListFunction<T, V> = QueryListFetchMoreFunction<T, V> & {
  params: V
}

export type QueryListFetchMoreFunction<T, V> = {
  fetcher?: (params?: V) => AxiosPromise<HTTPResponse<ListRes<T>>>
}

export type QueryListPaginateFunction<T, V> = QueryListFetchMoreFunction<T, V> & {
  params: { page: number }
}

export interface UseQueryListRes<T, V extends QueryList> {
  isValidating: boolean // for both loading and filter
  isLoading: boolean // first loading
  hasMore: boolean
  isLoadingMore: boolean
  offset: number
  data: T[] | undefined
  error: any
  total: number
  params: V
  limit: number
  mutate: KeyedMutator<any>
  getMore: (_?: QueryListFetchMoreFunction<T, V>) => Promise<void>
  paginate: (_: QueryListPaginateFunction<T, V>) => Promise<void>
  filter: (_: QueryListFunction<T, V>) => Promise<void>
  refresh: () => void
}

export interface QueryList {
  limit?: number | undefined
  offset?: number | undefined
}

export interface ListRes<T> {
  total: number
  products: T[]
}
