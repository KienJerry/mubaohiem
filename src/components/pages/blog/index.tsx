import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import Breadcrumb from '@/components/Breadcrumb'
import PageTabMenu from './pageTabMenu'
import { PageItemTab } from './pageItem'
import { ItemBlog } from './Item'
import { useQuery } from 'react-query'
import { blogApi } from '@/services'
import { Pagination } from 'antd'
import Image from 'next/image'

const defaultPageSize = 12
export const BlogPage = () => {
  const [dataCategoryItem, setDataCategoryItem] = useState<any>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const { data: dataCategoryTotal, isLoading: LoadingDataCategoryTotal } = useQuery({
    queryKey: ['getCategoryBlog'],
    queryFn: async () => {
      return await blogApi.getCategory().then((response: any) => {
        if (response?.blogCategories) {
          return response?.blogCategories || null
        }
      })
    },
    staleTime: 30000,
  })

  const { data: dataItemBlogs, isLoading: LoadingItemBlogs } = useQuery({
    queryKey: ['getItemBlog', currentPage, dataCategoryItem?.category_id],
    queryFn: async () => {
      return await blogApi
        .getItemBlog({
          filter: { category_id: { eq: dataCategoryItem?.category_id } },
          pageSize: defaultPageSize,
          currentPage: currentPage,
          sortFiled: 'publish_time',
          allPosts: false,
          sort: ['DESC'],
        })
        .then((response: any) => {
          if (response?.blogPosts) {
            return response?.blogPosts || null
          }
        })
    },
    enabled: !!dataCategoryItem,
  })

  useEffect(() => {
    if (dataCategoryTotal?.items?.length > 0) {
      setDataCategoryItem(dataCategoryTotal?.items?.[0])
    }
  }, [dataCategoryTotal])

  const changeDataCategoryItem = (type: any) => {
    setDataCategoryItem(type)
  }

  const onChangeCurrentPage = (type: any) => {
    setCurrentPage(type)
  }

  return (
    <div className="home-style3 wrapper-blog">
      <Breadcrumb
        items={[
          {
            title: 'Trang chủ',
            href: '/',
          },
          {
            title: 'Bài viết',
            href: '/blog',
          },
        ]}
      />
      {/* {LoadingDataCategoryTotal ? ( */}
      {LoadingDataCategoryTotal ? (
        <div className="wrapper-blog-section loading">
          <Image
            fill
            src="/assets/images/products/prod19.png"
            className="img-banner"
            alt="default img"></Image>
          {defaultPage()}
        </div>
      ) : (
        <div className="wrapper-blog-section">
          <Image
            fill
            className="img-banner"
            src={`${dataCategoryItem?.featured_img || '/assets/images/products/prod19.png'}`}
            alt={`${dataCategoryItem?.title}`}
          />
          <PageItemTab
            changePageItem={changeDataCategoryItem}
            pageItem={dataCategoryItem}
            data={dataCategoryTotal?.items || []}
          />

          {LoadingItemBlogs ? (
            <div className="wrapper-blog-section loading">{defaultPage()}</div>
          ) : (
            <>
              <h1 className="txt-page-title categories pb-32 mb-0 bg-white wow fadeInUp slow ">
                {dataCategoryItem?.title}
              </h1>

              <section className="sec-feature">
                <div className="box-blog-header">
                  {dataItemBlogs?.items?.slice(0, 1)?.map((val: any) => {
                    return (
                      <Link href={`blog/${val?.identifier}`} className="item" key={val?.post_id}>
                        <Image
                          fill
                          src={`${val?.first_image || '/assets/images/products/cl_1.jpg'}`}
                          alt="img blog"
                        />
                        <div className="bg-backgroundtxt">
                          <p className="title"> {val?.title}</p>
                        </div>
                      </Link>
                    )
                  })}
                  <PageTabMenu />
                </div>
                <div className="box-blog-items">
                  {dataItemBlogs?.items?.slice(0, 4)?.map((val: any) => {
                    return (
                      <div className="item" key={val?.post_id}>
                        <Link href={`blog/${val?.identifier}`} className="img-item-blog">
                          <Image
                            fill
                            src={val?.first_image || '/assets/images/products/prod47.png'}
                            alt="img blog"
                          />
                        </Link>
                        <div className="content">
                          <div className="txt-date">
                            {val?.creation_time} {/* publish_time */}
                          </div>
                          <Link className="txt-title" href={`blog/${val?.identifier}`}>
                            {val?.title}
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </section>

              <div className="wp-bg-blog-item">
                <div className="list-item-blog ">
                  {dataItemBlogs?.items?.map((val: any) => {
                    return (
                      <React.Fragment key={val?.post_id}>
                        <ItemBlog data={val} />
                      </React.Fragment>
                    )
                  })}
                </div>

                {dataItemBlogs?.total_count > defaultPageSize && (
                  <div className="page-numbers">
                    <nav aria-label="Page navigation example">
                      <Pagination
                        defaultCurrent={currentPage}
                        pageSize={defaultPageSize}
                        total={dataItemBlogs?.total_count || 0}
                        onChange={onChangeCurrentPage}
                      />
                    </nav>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

const defaultPage = () => {
  return (
    <>
      <h1 className="txt-page-title categories box-wr bg-white wow fadeInUp slow"></h1>
      <section className="sec-feature">
        <div className="box-blog-header">
          <div className="item">
            <Image fill src={'/assets/images/products/prod47.png'} alt="img blog" className="img" />
            <div className="bg-backgroundtxt">
              <p className="title"></p>
            </div>
          </div>
          <div className="page-content"></div>
        </div>
        <div className="box-blog-items">
          {Array.from({ length: 4 })?.map((val: any) => {
            return (
              <div className="item" key={val?.post_id}>
                <div className="img-item-blog">
                  <Image fill src={'/assets/images/products/prod47.png'} alt="img blog" />
                </div>
                <div className="content">
                  <div className="txt-date"></div>
                  <div className="txt-title"></div>
                </div>
              </div>
            )
          })}
        </div>
      </section>
      <div className="wp-bg-blog-item">
        <div className="list-item-blog ">
          {Array.from({ length: 8 })?.map((val: any) => {
            return (
              <div key={val?.id}>
                <Image
                  fill
                  src={'/assets/images/products/prod47.png'}
                  alt="img blog"
                  className="item-blog"></Image>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
