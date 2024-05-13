/* eslint-disable @next/next/no-img-element */
import { blogApi } from '@/services'
import Link from 'next/link'
import { useRef } from 'react'
import { useQuery } from 'react-query'

import SwiperCore from 'swiper'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

const CHUNK_SIZE = 4
const TechNews = () => {
  const swiperRef = useRef<SwiperCore | any>(null)

  const { data: blogPosts } = useQuery<ResBlogPost>({
    queryKey: ['BLOG_POSTS'],
    queryFn: async () => {
      return await blogApi
        .getItemBlog({
          filter: {},
          pageSize: 12,
          currentPage: 1,
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
    staleTime: 30000,
  })

  const goToNextSlide = () => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper?.slideNext()
    }
  }

  const goToPrevSlide = () => {
    if (swiperRef.current?.swiper) {
      swiperRef.current.swiper?.slidePrev()
    }
  }

  const renderSlidePosts = () => {
    const chunkedDataPost = blogPosts?.items?.reduce<TPost[][]>((result, item, index) => {
      const chunkIndex = Math.floor(index / CHUNK_SIZE)
      if (!result[chunkIndex]) {
        result[chunkIndex] = []
      }
      result[chunkIndex]?.push(item)
      return result
    }, [])

    const hoursPassedSince = (input: string): string => {
      const inputDate = new Date(input)
      const currentDate = new Date()
      const timeDiff = Math.abs(currentDate.getTime() - inputDate.getTime())
      const hoursPassed = timeDiff / (1000 * 60 * 60)

      if (hoursPassed >= 24) {
        const day = inputDate.getDate()
        const month = inputDate.getMonth() + 1
        const year = inputDate.getFullYear()
        return `${day < 10 ? '0' + day : day}-${month < 10 ? '0' + month : month}-${year}`
      } else {
        return `${hoursPassed.toFixed(0)} giờ trước`
      }
    }

    return chunkedDataPost?.map((blogPosts, index) => {
      return (
        <SwiperSlide key={index}>
          <div className="slider-card">
            {blogPosts?.map((post) => (
              <a
                href={`/blog/${post?.identifier}`}
                className="post-card"
                key={post?.post_id}
                rel="noreferrer">
                <div className="img">
                  <img
                  loading="lazy"
                    src={
                      post?.featured_image
                        ? post?.featured_image
                        : post?.first_image
                        ? post?.first_image
                        : ''
                    }
                    alt=""
                    className="img-cover"
                  />
                </div>
                <div className="inf">
                  <strong className="title">{post?.title}</strong>
                  <small className="fsz-12 color-777 mt-10">
                    {hoursPassedSince(post?.publish_time)}
                  </small>
                </div>
              </a>
            ))}
          </div>
        </SwiperSlide>
      )
    })
  }

  if (!blogPosts) return null
  return (
    <div
      className="news-box box-wr bg-white mt-3 wow fadeInUp slow short-news"
      data-wow-delay="0.4s">
      <div className="title title-hd">
        <div className="row align-items-center">
          <div className="col-lg-8">
            <h6 className="mb-0 fsz-18 fw-bold text-uppercase">Tin tức</h6>
          </div>
          <div className="col-lg-4 d-flex text-lg-end mt-3 mt-lg-0">
            <div className="arrows">
              <div className="swiper-button-next" onClick={goToNextSlide}>
                <i className="la la-angle-right"></i>
              </div>
              <div className="swiper-button-prev" onClick={goToPrevSlide}>
                <i className="la la-angle-left"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="posts-slider3 position-relative overflow-hidden">
        <Swiper
          ref={swiperRef}
          slidesPerView={1}
          spaceBetween={5}
          loop={true}
          pagination={{
            clickable: true,
          }}
          navigation={true}
          modules={[Navigation]}
          className="swiper-wrapper-flex">
          {renderSlidePosts()}
        </Swiper>
      </div>
      <Link href="/blog" className="more text-capitalize fsz-13">
        Xem thêm <i className="la la-angle-right ms-1"></i>
      </Link>
    </div>
  )
}

export default TechNews
