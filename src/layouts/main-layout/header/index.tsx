/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from 'react'

// import gsap from 'gsap'
import Link from 'next/link'
import Image from 'next/image'
import { Dropdown } from 'antd'

import { useQuery } from 'react-query'
import useCart from '@/hooks/useCart'
import { FormatNumber } from '@/helper'
import authenApi from '@/services/authenticate.queries'
import { InfoCustomerHeader } from './infoCustomer'
import Cookies from 'js-cookie'
import { COOKIE_KEY } from '@/services/graphql'
import { NavIC } from './navICHeader'
import { NavMenu } from './navMenu'
import { EMPTY_ITEM } from '@/components/pages/product/constants'
import ItemMiniCart from './itemMiniCart'
import { useWindowSize } from '@/hooks/useWindowSize'
import classNames from 'classnames'
import { TYPE_CART } from '@/store/cartSlice'
import { useRouter } from 'next/router'
import { contactApi, homeApi } from '@/services'
import EmptyData from '@/components/boxLayout/EmptyData'

export const Header = () => {
  const [isShowSearchMobile, setIsShowSearchMobile] = useState(false)

  const searchRef = useRef<HTMLInputElement>(null)
  const searchTableRef = useRef<HTMLInputElement>(null)

  const router = useRouter()

  const { isMobile } = useWindowSize()
  const { cartData, cartId, onCreateCartId, onUpdateCartId } = useCart()

  const accessToken = Cookies?.get(COOKIE_KEY?.ACCESS_TOKEN)

  const { data: InforMationStore } = useQuery({
    queryKey: ['getInforMationStore'],
    queryFn: async () => {
      return await contactApi.getInfoMationStore().then((response: any) => {
        if (!!response?.storeAddress) {
          return response?.storeAddress || []
        }
      })
    },
    staleTime: 30000,
  })

  const { data: listDeliveryFeatures } = useQuery({
    queryKey: ['delivery-features'],
    queryFn: async () => {
      return await homeApi
        .getMenu({
          identifiers: ['delivery-features'],
        })
        .then((response: any) => {
          return response?.snowdogMenus
        })
    },
    staleTime: 30000,
    select(data) {
      return data?.items?.[0]?.nodes?.items
    },
  })

  useEffect(() => {
    if (!cartId) {
      onCreateCartId()
      return
    }

    if (!!cartId && cartData === null) {
      onUpdateCartId({
        cartId: '',
        type: !!accessToken ? TYPE_CART.USER : TYPE_CART.GUEST,
      })
      onCreateCartId()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartId, cartData])

  // useEffect(() => {
  //   // const svg = document.getElementById('svg')
  //   // const tl = gsap.timeline()
  //   const tl2 = gsap.timeline()
  //   // const curve = 'M0 502S175 272 500 272s500 230 500 230V0H0Z'
  //   // const flat = 'M0 2S175 1 500 1s500 1 500 1V0H0Z'

  //   // tl.to('.loader-wrap-heading .load-text , .loader-wrap-heading .cont', {
  //   //   delay: 1.5,
  //   //   y: -100,
  //   //   opacity: 0,
  //   // })
  //   // tl.to(svg, {
  //   //   duration: 0.5,
  //   //   attr: { d: curve },
  //   //   ease: 'power2.easeIn',
  //   // }).to(svg, {
  //   //   duration: 0.5,
  //   //   attr: { d: flat },
  //   //   ease: 'power2.easeOut',
  //   // })
  //   // tl.to('.loader-wrap', {
  //   //   y: -1500,
  //   // })
  //   // tl.to('.loader-wrap', {
  //   //   zIndex: -1,
  //   //   display: 'none',
  //   // })
  //   // tl.from(
  //   //   'header',
  //   //   {
  //   //     y: 200,
  //   //   },
  //   //   '-=1.5'
  //   // )
  //   // tl.from(
  //   //   'header .container',
  //   //   {
  //   //     y: 40,
  //   //     opacity: 0,
  //   //     delay: 0.3,
  //   //   },
  //   //   '-=1.5'
  //   // )

  //   // tl2
  //   //   .to('header', {
  //   //     y: 200,
  //   //   })
  //   //   .to('header', {
  //   //     delay: 0.3,
  //   //     y: 0,
  //   //   })
  // }, [])

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

  const handleResetInput = () => {
    if (searchRef.current) searchRef.current.value = ''
    if (searchTableRef.current) searchTableRef.current.value = ''
  }

  const handleRedirectSearch = (value: string | undefined) => {
    if (!value || !router?.isReady) return

    const encodedSearch = encodeURIComponent(value)
    const newPath = `/products?search=${encodedSearch}`
    handleResetInput()
    if (isShowSearchMobile) setIsShowSearchMobile(false)

    return router?.push(newPath)
  }

  const handleKeyDown = (event: any) => {
    if (event?.key === 'Enter') {
      handleRedirectSearch(event?.target?.value)
    }
  }

  const MiniCart =
    cartData?.items?.length !== EMPTY_ITEM && !!cartData ? (
      <div className="MN-mini-cart">
        <div className="box-items">
          {cartData?.items?.map((item) => {
            return <ItemMiniCart data={item} key={item?.id} />
          })}
        </div>
        <div className="footer-mini-cart">
          <span>
            <b>
              Tổng:{' '}
              {`${FormatNumber(cartData?.prices?.grand_total?.value ?? 0, '.')} ${
                cartData?.prices?.grand_total?.currency ?? ''
              }`}
            </b>
          </span>
          <Link className="butn mb-0" href={`/cart`}>
            Xem Giỏ Hàng
          </Link>
        </div>
      </div>
    ) : (
      <div className="MN-mini-cart">
        <EmptyData />
        <h5 className="fsz-16 text-center mb-4">Chưa có sản phẩm</h5>
      </div>
    )

  useEffect(() => {
    const hd: any = document.querySelector('.hd')
    const body: any = document.querySelector('.app-main')
    let lastScrollTop = 0
    let scrollDown = 0
    window.onscroll = function () {
      if (hd) {
        if (window.scrollY > 0) {
          hd.classList.add('active')
        } else {
          hd.classList.remove('active')
        }
        let st = window.pageYOffset || document.documentElement.scrollTop
        if (!isMobile ? st >= 300 : st >= 70 && st > lastScrollTop) {
          scrollDown = window.pageYOffset
          hd.classList.add('out')
          hd.classList.remove('in')
          body.classList.add('out')
          body.classList.remove('out')
        } else {
          if (scrollDown > window.pageYOffset - 100) {
            hd.classList.remove('out')
            hd.classList.add('in')
            body.classList.remove('out')
            body.classList.add('out')
          }
        }
        // lastScrollTop = st <= 0 ? 0 : st
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <header className='hd-mb mt-20 mx-3'>
        <div className="hd tc-navbar-container-style3 MN-navbar">
          <div className="box-wr wh-box bg-white ">
            {/* <!--  Start top-navbar  --> */}
            {!isMobile && (
              <div className="top-navbar top-navbar-style3">
                <div>
                  <div className="row align-items-center">
                    <div className="col-lg-6 top-navbar-left">
                      <div className="hot-line">
                        <small>
                          <i className="las la-tty"></i> Hotline 24/7
                        </small>
                        <a href={`tel:${InforMationStore?.[0]?.telephone_1}`} className="fw-bold">
                          {InforMationStore?.[0]?.telephone_1}
                        </a>
                        {InforMationStore?.[0]?.telephone_2 && (
                          <a href={`tel:${InforMationStore?.[0]?.telephone_2}`} className="fw-bold">
                            {' - '}
                            {InforMationStore?.[0]?.telephone_2}
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-6 mt-4 mt-lg-0 top-navbar-right">
                      <div className="top-nav-side justify-content-lg-end">
                        <div className="side-links">
                          <Link href="/order-lookup" className="link-order">
                            <span className="icon">
                              <i className="fa-solid fa-cart-shopping"></i>
                            </span>
                            <span className="text">Tra Cứu Đơn Hàng</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* <!--  End top-navbar  --> */}

            {/* <!--  Start navbar  --> */}
            <nav className="navbar navbar-expand-lg navbar-light tc-navbar-style3">
              <div className="container full-page">
                <Link className="navbar-brand" href="/">
                  <Image
                    src="/assets/images/logo.png"
                    alt=""
                    width={isMobile ? 48 : 72}
                    height={isMobile ? 48 : 72}
                    className="logo"
                  />
                </Link>
                <div className="search-nav-style3 is-mobile">
                  <div>
                    <div className="row align-items-center gx-0">
                      <div className="col-lg-5">
                        <div className="search-cat">
                          <div className="input-group flex-nowrap bg-white">
                            {/* <select name="name" className="form-select">
                            <option value="">All Categories</option>
                            <option value="">Categories 1</option>
                            <option value="">Categories 2</option>
                          </select> */}
                          <input
                            ref={searchTableRef}
                            type="text"
                            className="form-control"
                            placeholder="Bạn tìm gì..."
                            // onKeyDown={handleKeyDown}
                            onKeyPress={handleKeyDown}
                          />
                          <div
                            className="search-btn"
                            onClick={() => {
                              handleRedirectSearch(searchTableRef.current?.value)
                            }}>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              stroke-width="2"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              color="#000"
                              className="lucide lucide-search hover-primary">
                              <circle cx="11" cy="11" r="8" />
                              <path d="m21 21-4.3-4.3" />
                            </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-7 d-none d-lg-block">
                        <div className="delivery-features ps-lg-5">
                          <div className="row">
                            {listDeliveryFeatures?.map((val: any, idx: number) => {
                              const shippingFeature = IcDeliveryFeatures.find(
                                (feature) => feature?.type == val?.url_key
                              )
                              return (
                                <div className="col-lg-4" key={idx}>
                                  <a href="#" className="feat-link">
                                    {!!shippingFeature && shippingFeature?.ic}
                                    <span> {val?.title}</span>
                                  </a>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <NavMenu
                  InforMationStore={InforMationStore}
                  isShowMobile={isShowSearchMobile}
                  handleSetSearch={setIsShowSearchMobile}
                />
                <div className="side-nav d-none d-lg-flex">
                  <NavIC />
                  <InfoCustomerHeader data={dataInfoCustomer} />
                  <Dropdown dropdownRender={() => MiniCart} placement="bottomLeft">
                    <div className="d-flex">
                      <div className="icons ms-4">
                        <Link href="/cart" className="icon-link">
                          <i className="las la-shopping-bag"></i>
                          {cartData?.items?.length && cartData?.items?.length !== 0 ? (
                            <span className="num">{cartData?.items?.length}</span>
                          ) : null}
                        </Link>
                      </div>
                      <div className="text-item ms-3 d-flex align-items-center ">
                        <Link href="/cart" className="fsz-14 text-uppercase fw-bold">
                          <small className="fsz-11 color-666 text-uppercase d-block">Giỏ hàng</small>
                          {cartData?.items?.length
                            ? `${FormatNumber(cartData?.prices?.grand_total?.value ?? 0, '.')} 
                          ${cartData?.prices?.grand_total?.currency ?? ''}`
                            : null}
                        </Link>
                      </div>
                    </div>
                  </Dropdown>
                </div>
              </div>
            </nav>
            {/* <!--  End navbar  --> */}
          </div>
          {/* <!--  Start search nav  --> */}
          <div
            className={classNames('search-nav-style3 is-des', { active: isShowSearchMobile })}>
            <div>
              <div className="row align-items-center gx-0">
                <div className="col-lg-5">
                  <div className="search-cat">
                    <div className="input-group flex-nowrap bg-white">
                      {/* <select name="name" className="form-select">
                      <option value="">All Categories</option>
                      <option value="">Categories 1</option>
                      <option value="">Categories 2</option>
                    </select> */}
                    <input
                      ref={searchRef}
                      type="text"
                      className="form-control"
                      placeholder="Bạn tìm gì..."
                      // onKeyDown={handleKeyDown}
                      onKeyPress={handleKeyDown}
                    />
                    <div
                      className="search-btn"
                      onClick={() => {
                        handleRedirectSearch(searchRef.current?.value)
                      }}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        color="#000"
                        className="lucide lucide-search hover-primary">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.3-4.3" />
                      </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-7 d-none d-lg-block">
                  <div className="delivery-features ps-lg-5">
                    <div className="row">
                      {listDeliveryFeatures?.map((val: any, idx: number) => {
                        const shippingFeature = IcDeliveryFeatures.find(
                          (feature) => feature?.type == val?.url_key
                        )
                        return (
                          <div className="col-lg-4" key={idx}>
                            <a href="#" className="feat-link">
                              {!!shippingFeature && shippingFeature?.ic}
                              <span> {val?.title} </span>
                            </a>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <!--  End search nav  --> */}
        </div>
      </header>
      {/* {renderBannerAdvertisement()} */}
    </>
  )
}

const IcDeliveryFeatures = [
  {
    type: 'shipping',
    ic: <i className="la la-shipping-fast fs-6 me-2"></i>,
  },
  {
    type: 'back',
    ic: <i className="las la-redo-alt fs-6 me-2"></i>,
  },
  {
    type: 'payment',
    ic: <i className="las la-shield-alt fs-6 me-2"></i>,
  },
]
