import { DEFAULT_LIMIT } from '@/constants'
import { useQueryList, UseQueryListProps } from '@/hooks'
import { QueryList } from '@/types'
import classNames from 'classnames'
import { ReactNode } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FilterEmpty, FilterEmptyProps } from '../filterEmpty'
import { Pagination, PaginationProps } from '../pagination'
import { Spinner } from '../spinner'

type RenderComponentProps<T> = {
  params: T
  onChange?: (params: T) => void
}

export type RenderListQueryProps<T, V extends QueryList> = Partial<PaginationProps> &
  Omit<UseQueryListProps<T, V>, 'key'> & {
    swrKey: string
    renderItem: (data: T) => JSX.Element | null
    renderHeaderComponent?: (params: RenderComponentProps<V>) => JSX.Element
    renderLeftComponent?: (params: RenderComponentProps<V>) => JSX.Element
    renderRightComponent?: (params: RenderComponentProps<V>) => JSX.Element
    listType?: 'infiniteScroll' | 'pagination'
    headerComponentClassName?: string
    leftComponentClassName?: string
    rightComponentClassName?: string
    numberOfItemsLoading?: number
    numberOfItemsLoadingMore?: number
    loadingComponent?: JSX.Element
    listClassName?: string
    listContainerClassName?: string
    containerClassName?: string
    paginationClassName?: string
    wrapperClassName?: string
    filterEmptyProps?: FilterEmptyProps
  }

export const RenderListQuery = <T, V extends QueryList>({
  swrKey,
  initialParams,
  config,
  fetcher,
  renderItem,
  renderHeaderComponent,
  renderLeftComponent,
  renderRightComponent,
  listType = 'pagination',
  rightComponentClassName,
  leftComponentClassName,
  headerComponentClassName,
  numberOfItemsLoading = DEFAULT_LIMIT,
  numberOfItemsLoadingMore = DEFAULT_LIMIT,
  listContainerClassName,
  listClassName,
  loadingComponent,
  paginationClassName,
  containerClassName,
  wrapperClassName,
  filterEmptyProps,
  ...props
}: RenderListQueryProps<T, V>) => {
  const { data, total, params, isValidating, hasMore, offset, limit, filter, paginate, getMore } =
    useQueryList<T, V>({
      fetcher,
      key: swrKey,
      config,
      initialParams,
    })

  const handlePaginate = (page: number) => {
    paginate({ params: { page } })
  }

  const handleFilter = (params: V) => {
    filter({ params })
  }

  const handleGetMore = () => {
    getMore()
  }

  const ListWrapper = ({ children }: { children: ReactNode }) => {
    return (
      <div
        className={classNames(
          'grid gap-4 lg:gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5',
          listClassName
        )}
      >
        {children}
      </div>
    )
  }

  const RenderList = () => {
    if (isValidating) return <RenderLoading />
    if (data?.length === 0) return <FilterEmpty {...filterEmptyProps} />

    if (listType === 'infiniteScroll') {
      return (
        <div className={classNames(listContainerClassName)}>
          <InfiniteScroll
            style={{ overflow: 'hidden' }}
            dataLength={data?.length || 0}
            next={handleGetMore}
            hasMore={hasMore}
            loader={<RenderLoading length={numberOfItemsLoadingMore} />}
          >
            <ListWrapper>{data?.map((item) => renderItem(item))}</ListWrapper>
          </InfiniteScroll>
        </div>
      )
    }

    return (
      <div className={classNames(listContainerClassName)}>
        <ListWrapper>{data?.map((item) => renderItem(item))}</ListWrapper>
        <Pagination
          forcePage={offset / limit}
          className={classNames(paginationClassName)}
          pageCount={Math.ceil(total / (params?.limit || DEFAULT_LIMIT))}
          onPageChange={({ selected }) => handlePaginate(selected + 1)}
          {...props}
        />
      </div>
    )
  }

  const RenderLoading = ({ length = numberOfItemsLoading }: { length?: number }) => {
    if (!loadingComponent) {
      return (
        <div className="py-6 flex justify-center">
          <Spinner />
        </div>
      )
    }

    return (
      <ListWrapper>
        {Array.from({ length }).map((_, index) => (
          <div key={index}>{loadingComponent}</div>
        ))}
      </ListWrapper>
    )
  }

  return (
    <div className={classNames(containerClassName)}>
      {renderHeaderComponent ? (
        <div className={classNames(headerComponentClassName)}>
          {renderHeaderComponent({
            params,
            onChange: handleFilter,
          })}
        </div>
      ) : null}

      <div className={classNames(wrapperClassName)}>
        {renderLeftComponent ? (
          <div className={classNames(leftComponentClassName)}>
            {renderLeftComponent({
              params,
              onChange: handleFilter,
            })}
          </div>
        ) : null}

        <RenderList />

        {renderRightComponent ? (
          <div className={classNames(rightComponentClassName)}>
            {renderRightComponent({
              params,
              onChange: handleFilter,
            })}
          </div>
        ) : null}
      </div>
    </div>
  )
}
