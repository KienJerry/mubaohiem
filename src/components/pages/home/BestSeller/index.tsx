/* eslint-disable @next/next/no-img-element */
import { FC, useEffect, useRef } from 'react'

import Link from 'next/link'
import SwiperCore from 'swiper'
import { useQuery } from 'react-query'
import productAPI from '@/services/product'
import categoryApi from '@/services/categories'

import { Swiper, SwiperSlide } from 'swiper/react'
import ProductCard from '@/components/productCard'
import { EMPTY_ITEM } from '../../product/constants'
import { Navigation, Autoplay } from 'swiper/modules'

import { useWindowSize } from '@/hooks/useWindowSize'

type PropsBestSeller = {
  categoryId: string,
  id?: string
}

const BestSeller: FC<PropsBestSeller> = ({ categoryId, id }) => {
  const swiperRef = useRef<SwiperCore | any>(null)
  const swiperRefBottom = useRef<SwiperCore | any>(null)

  const slidesPerViewRef = useRef<number>(5)

  const { width } = useWindowSize()

  useEffect(() => {
    if (!width) return

    if (width > 1024) {
      slidesPerViewRef.current = 5
      return
    }
    if (width > 640) {
      slidesPerViewRef.current = 3
      return
    }

    slidesPerViewRef.current = 1
  }, [width])

  const { data: productData } = useQuery<ResProduct>(['GET_PRODUCTS', categoryId], {
    queryFn: async () => {
      return await productAPI
        .getProducts({
          pageSize: 40,
          currentPage: 1,
          filter: {
            category_uid: {
              in: [categoryId],
            },
          },
        })
        ?.then((res: any) => res?.products)
    },
    staleTime: 30000,
    enabled: !!categoryId,
  })

  const { data: categories } = useQuery<Category>(['GET_CATEGORIES'], {
    queryFn: async () => {
      return await categoryApi.getCategories({}).then((res: any) => res?.categories?.items?.[0])
    },
    staleTime: 30000,
  })

  const currentCategory = categories?.children?.filter((item) => item.uid === categoryId)?.[0]

  const firstHalfProducts = productData?.items?.slice(0, 20)
  const secondHalfProducts = productData?.items?.slice(20)

  const goToNextSlide = (swiper: any) => {
    if (swiper) {
      swiper?.slideNext()
    }
  }

  const goToPrevSlide = (swiper: any) => {
    if (swiper) {
      swiper?.slidePrev()
    }
  }

  // const renderSubCategories = () => {
  //   return currentCategory?.children?.map((category) => {
  //     return (
  //       <div className="col-lg-4 col-6" key={category?.uid}>
  //         <Link href={`/products/?category_uid=${category?.uid}`} className="number-item">
  //           <div className="inf">
  //             <h6 className="fsz-14 fw-bold mb-0 sm-title">{category?.name}</h6>
  //             <small className="fsz-12 color-666"> {categories?.product_count} Sản phẩm </small>
  //           </div>
  //           <div className="img">
  //             <img
  //               src={category?.image_banner ? category?.image_banner : '/assets/images/logo.png'}
  //               alt=""
  //               className="img-contain"
  //             />
  //           </div>
  //         </Link>
  //       </div>
  //     )
  //   })
  // }

  const renderListProductCard = (products: Product[] | undefined) => {
    if (!products || products?.length === EMPTY_ITEM) return null

    return products?.map((product) => {
      return (
        <SwiperSlide key={product?.uid}>
          <ProductCard data={product} />
        </SwiperSlide>
      )
    })
  }

  const renderSwiperProducts = (products: Product[] | undefined, ref: SwiperCore | any) => {
    if (!products || products?.length === EMPTY_ITEM) return null

    return (
      <div className="products-content wow fadeInUp slow" data-wow-delay="0.2s">
        <div className="products-slider">
          <Swiper
            ref={ref}
            slidesPerView={1}
            spaceBetween={5}
            loop={true}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            breakpoints={{
              640: {
                slidesPerView: 3,
              },
              1024: {
                slidesPerView: 5,
              },
            }}
            modules={[Navigation, Autoplay]}
            className="swiper-wrapper-flex">
            {renderListProductCard(products)}
          </Swiper>
        </div>
        {products?.length > slidesPerViewRef.current ? (
          <>
            <div className="swiper-button-next" onClick={() => goToNextSlide(ref.current?.swiper)}>
              <i className="la la-angle-right"></i>
            </div>
            <div className="swiper-button-prev" onClick={() => goToPrevSlide(ref.current?.swiper)}>
              <i className="la la-angle-left"></i>
            </div>
          </>
        ) : null}
      </div>
    )
  }

  if (!categoryId) return null
  return (
    <section className="tc-brand-box-style3 box-wr bg-white mt-3 MN-padding" id={id}>
      <div className="title mb-title wow fadeInUp slow" data-wow-delay="0.2s">
        <div className="row flex-mobile">
          <div className="col-lg-8">
            <h6 className="fsz-18 fw-bold text-uppercase mb-0 h-mobile">{currentCategory?.name}</h6>
          </div>
          <div className="col-lg-4 text-lg-end mt-lg-0">
            <Link
              href={`/products/?category_uid=${currentCategory?.uid}`}
              className="more text-capitalize color-666 fsz-13">
              Xem thêm <i className="la la-angle-right ms-1"></i>
            </Link>
          </div>
        </div>
      </div>

      {/* <div className="top-info wow fadeInUp slow" data-wow-delay="0.2s">
        <div className="row">
          <div className="col-lg-6">
            <div className="banner">
              <div className="img">
                <img
                  src={
                    currentCategory?.image_banner
                      ? currentCategory?.image_banner
                      : '/assets/images/products/prod18.png'
                  }
                  alt=""
                  className="img-cover"
                />
              </div>
              <Link
                href={`/products/?category_uid=${currentCategory?.uid}`}
                className="butn btn-bottom text-white bg-222 radius-3 fw-500 fsz-11 text-uppercase text-center mt-2 hover-bg-green2 py-2 px-3">
                <span> Xem thêm </span>
              </Link>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="brand-numbers">
              <div className="row gx-2">{renderSubCategories()}</div>
            </div>
          </div>
        </div>
      </div> */}

      {renderSwiperProducts(firstHalfProducts, swiperRef)}

      {renderSwiperProducts(secondHalfProducts, swiperRefBottom)}
    </section>
  )
}

export default BestSeller
