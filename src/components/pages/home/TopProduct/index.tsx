/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import productAPI from '@/services/product'
import SwiperListProduct from '../../../Swiper/SwiperListProduct'
import LoadingData from '@/components/boxLayout/LoadingData'
import Link from 'next/link'
import { useRouter } from 'next/router'

const TABS = [
  {
    id: 1,
    title: 'Bán chạy',
    variable: {
      sort: {
        best_seller: 'DESC',
      },
    },
  },
  {
    id: 2,
    title: 'Mới nhất',
    variable: {},
  },
  {
    id: 3,
    title: 'Nổi bật',
    variable: {
      sort: {
        most_viewed: 'DESC',
      },
    },
  },
]

const TopProduct = () => {
  const router = useRouter()
  const [currentTab, setCurrentTab] = useState(TABS[router?.asPath == '/#OUTSTANDING' ? 2 : 0])

  const { data: dataProduct, isLoading } = useQuery<ResProduct>(
    ['getProducts', currentTab?.title],
    {
      queryFn: async () => {
        return await productAPI
          .getProducts({
            filter: {},
            pageSize: 20,
            currentPage: 1,
            ...currentTab?.variable,
          })
          .then((res: any) => res?.products)
      },
    }
  )

  useEffect(() => {
    if(router?.asPath == '/#OUTSTANDING'){
      setCurrentTab(TABS[2])
    }
  },[router?.asPath])

  const renderTabs = () => {
    return TABS.map((tab) => (
      <li className="nav-item" role="presentation" key={tab.id} id="OUTSTANDING">
        <button
          className={currentTab?.id === tab.id ? 'nav-link active' : 'nav-link'}
          id="pills-cat1-tab"
          data-bs-toggle="pill"
          data-bs-target="#pills-cat1"
          type="button"
          role="tab"
          onClick={() => setCurrentTab(tab)}>
          {tab.title}
        </button>
      </li>
    ))
  }

  const renderContent = () => {
    if (isLoading) return <LoadingData />

    return (
      <SwiperListProduct
        className="products-content"
        childrenClassName="products-slider"
        slidesPerView={5}
        products={dataProduct?.items}
      />
    )
  }

  return (
    <section
      className="tc-product-tabs-style3 box-wr bg-white mt-3 wow fadeInUp slow"
      data-wow-delay="0.2s"
      id="BEST_SELLER">
      <div className="title">
        <div className="row flex-mobile ">
          <div className="col-lg-8">
            <ul className="nav nav-pills" id="pills-tab" role="tablist">
              {renderTabs()}
            </ul>
          </div>
          <div className="col-lg-4 mt-lg-0 text-lg-end">
            <Link
              passHref
              href="/products/#PRODUCT_SELLING"
              className="more text-capitalize color-666 fsz-13">
              Xem thêm <i className="la la-angle-right"></i>
            </Link>
          </div>
        </div>
      </div>
      <div className="tab-content" id="pills-tabContent">
        <div
          className="tab-pane fade show active"
          id="pills-cat1"
          role="tabpanel"
          aria-labelledby="pills-cat1-tab">
          {renderContent()}
        </div>
      </div>
    </section>
  )
}

export default TopProduct
