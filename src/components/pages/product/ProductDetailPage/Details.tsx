/* eslint-disable @next/next/no-img-element */
import { FC, useState } from 'react'

import Cookies from 'js-cookie'
import classNames from 'classnames'
import { useQuery } from 'react-query'
import reviewAPI from '@/services/review'

import ReviewsProduct from './ReviewsProduct'
import { COOKIE_KEY } from '@/services/graphql'
import authenApi from '@/services/authenticate.queries'
import EmptyData from '@/components/boxLayout/EmptyData'

type Details = {
  urlKey: string,
  product: ProductDetail | undefined,
}

const TABS = [
  {
    id: 1,
    title: 'Mô tả',
    typeContent: 'description',
  },
  {
    id: 2,
    title: 'Đánh giá',
    typeContent: 'reviews',
  },
  {
    id: 3,
    title: 'Thông tin chi tiết',
    typeContent: 'details',
  },
]

const Details: FC<Details> = ({ product, urlKey }) => {
  const [currentTab, setCurrentTab] = useState(TABS[0])

  const { data: dataInfoCustomer } = useQuery({
    queryKey: ['getCustomer'],
    queryFn: async () => {
      return await authenApi.getInfoCustomer().then((response: any) => {
        return response || null
      })
    },
    enabled: typeof window !== 'undefined' ? !!Cookies.get(COOKIE_KEY?.ACCESS_TOKEN) : false,
    staleTime: 30000,
  })

  const { data: dataReviewProduct, refetch } = useQuery<ResReviewProduct>(['GET_REVIEWS_PRODUCT', urlKey], {
    queryFn: async () => {
      return await reviewAPI
        .getReviewsProduct({
          url_key: urlKey,
          pageSize: 20,
          currentPage: 1,
        })
        .then((res: any) => res?.products?.items?.[0]?.reviews)
    },
    enabled: urlKey !== '',
  })

  const { data: dataReviewRatings } = useQuery<ReviewRating[]>(['GET_REVIEWS_RATING_METADATA'], {
    queryFn: async () => {
      return await reviewAPI
        .getReviewRatingsMetadata()
        .then((res: any) => res?.productReviewRatingsMetadata?.items)
    },
    staleTime: 30000,
  })

  const renderTabsTitle = () => {
    return TABS.map((tab) => {
      return (
        <li className="nav-item" role="presentation" key={tab.id}>
          <button
            className={classNames('nav-link', { active: tab.id === currentTab?.id })}
            id="pills-tab1-tab"
            data-bs-toggle="pill"
            data-bs-target="#pills-tab1"
            onClick={() => setCurrentTab(tab)}>
            {tab.title}
          </button>
        </li>
      )
    })
  }

  const contentTabs: Record<string, React.ReactNode> = {
    description: (
      <div className="tab-pane fade show active" id="pills-tab1">
        {product?.description?.html ? (
          <div dangerouslySetInnerHTML={{ __html: product?.description?.html ?? '' }} />
        ) : (
          <div className="text-center">
            <EmptyData />
            <h5 className='mt-3 mb-5'>Hiện chưa có thông tin về sản phẩm!</h5>
          </div>
        )}
      </div>
    ),
    reviews: (
      <ReviewsProduct
        sku={product?.sku ?? ''}
        dataReviewRatings={dataReviewRatings ?? []}
        dataReviewProduct={dataReviewProduct ?? {items: []}}
        customerInfo={dataInfoCustomer}
        onRefetch={refetch}
      />
    ),
    details: (
      <div className="tab-pane fade show active" id="pills-tab4">
        <div className="row justify-content-center">
          <div className="col-lg-7">
            <div className="additional-info">
              <ul className="p-0">
                {product?.attributes?.map((attribute, index) => (
                  <li key={index}>
                    <strong>{attribute?.label}</strong>
                    <span> {attribute?.value} </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    ),
  }

  return (
    <section className="product-text-details p-30 radius-4 bg-white mt-3 wow fadeInUp mb-3">
      <ul className="nav nav-pills mb-50" id="pills-tab" role="tablist">
        {renderTabsTitle()}
      </ul>
      <div className="tab-content" id="pills-tabContent">
        {contentTabs[currentTab!.typeContent]}
      </div>
    </section>
  )
}

export default Details
