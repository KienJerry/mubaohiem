/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @next/next/no-img-element */
import authenApi from '@/services/authenticate.queries'
import { COOKIE_KEY } from '@/services/graphql'
import homeApi from '@/services/home'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { Fragment } from 'react'
import { useQuery } from 'react-query'
// import dynamic from 'next/dynamic'

// const FontAwesomeIcon = dynamic(() => import('@fortawesome/react-fontawesome').then((mod) => mod.FontAwesomeIcon), {
//   ssr: false,
// })
export const Footer = () => {
  const router = useRouter()
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

  const { data: listFooter } = useQuery({
    queryKey: ['menu-footer'],
    queryFn: async () => {
      return await homeApi
        .getMenu({
          identifiers: ['menu-footer'],
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

  const listLinks = [
    {
      title: 'Tài khoản',
      url: dataInfoCustomer ? '/profile/' : '/login/',
      icon: <i className="las la-user"></i>,
    },
    {
      title: 'So sánh',
      url: '/compare/',
      icon: <i className="las la-sync-alt"></i>,
    },
    {
      title: 'Yêu thích',
      url: '/favorite-product/',
      icon: <i className="lar la-heart"></i>,
    },
    // {
    //   title: 'Trang chủ',
    //   url: '/',
    //   icon: <i className="las la-home"></i>,
    // },
    // {
    //   title: 'Tra cứu đơn hàng',
    //   url: '/order-lookup/',
    //   icon: <i className="fa-solid fa-clipboard-check"></i>,
    // },

  ]

  const getChildNodes = (parentId: any, allNodes: any) => {
    const childNodes = allNodes
      ?.filter((node: any) => node?.parent_id === parentId)
      ?.map((childNode: any) => ({
        ...childNode,
        child: getChildNodes(childNode?.node_id, allNodes),
      }))
    return childNodes
  }

  const getListLinks = () => {
    const listHeading = listFooter
      ?.filter((el: any) => el?.parent_id == 0)
      ?.sort((a: any, b: any) => a?.position - b?.position)
    // const listChild = listHeading?.map((el: any) => ({
    //   ...el,
    //   child: listFooter
    //     ?.filter((item: any) => item?.parent_id == el?.node_id)
    //     ?.sort((a: any, b: any) => a?.position - b?.position),
    // }))

    const listChild = listHeading?.map((el: any) => ({
      ...el,
      child: getChildNodes(el?.node_id, listFooter),
    }))

    return listChild
  }

  // const items: CollapseProps['items'] = [
  //   {
  //     key: '1',
  //     label: title,
  //     children: <p>{children}</p>,
  //   },
  // ]

  return (
    <>
      <footer className="tc-footer-style3">
        <div className="container">
          <div className="footer-content">
            <div className="row">
              {getListLinks()?.map((el: any) => {
                if (el?.position == 0) {
                  return (
                    <div key={el?.node_id} className="col-lg-4 footer-it-xl">
                      <div className="foot-info">
                        <h6 className="fz-18 fw-bold text-uppercase">{el?.title}</h6>
                        {el?.child?.map((val: any, idx: number) => {
                          return (
                            <React.Fragment key={idx}>
                              <p className="text-uppercase " style={{ marginTop: '24px' }}>{val?.title}</p>
                              {val?.child?.map((children: any, index: number) => {
                                const child_Title = children?.title
                                return (
                                  <Fragment key={index}>
                                    {children?.url_key == 'mail' ? (
                                      <Link
                                        className="fsz-14 color-000"
                                        href={`${children?.url_key}:`}>
                                        {child_Title}
                                      </Link>
                                    ) : children?.url_key == 'phone' ? (
                                      <h4 className="fz-18 fw-bold color-green2 ">
                                        {child_Title}
                                      </h4>
                                    ) : (
                                      <p className="fsz-14 color-000">{child_Title}</p>
                                    )}
                                  </Fragment>
                                )
                              })}
                            </React.Fragment>
                          )
                        })}
                        {/* <p className="text-uppercase">{el?.child?.[0]?.title}</p>
                        <h4 className="fsz-30 fw-bold color-green2 mb-title">
                          {el?.child?.[1]?.title}
                        </h4>
                        {el?.child?.slice(2)?.map((element: any) => {
                          if (element?.url_key == 'mail')
                            return (
                              <Link
                                key={element?.node_id}
                                className="fsz-14 color-000"
                                href={`${element?.url_key}:`}>
                                {element?.title}
                              </Link>
                            )
                          return (
                            <p key={element?.node_id} className="fsz-14 color-000">
                              {element?.title}
                            </p>
                          )
                        })} */}
                        <div className="foot-social mt-cus">
                          <Link href="https://www.facebook.com/mubaohiemchinhhang.com.vn/">
                            <FontAwesomeIcon icon={['fab', 'facebook']} />
                          </Link>
                          <Link href="https://www.instagram.com/mubaohiemchinhhangvn/">
                            <FontAwesomeIcon icon={['fab', 'instagram']} />
                          </Link>
                          <Link href="https://www.youtube.com/@thegioimubaohiem7307">
                            <FontAwesomeIcon icon={['fab', 'youtube']} />
                          </Link>
                          <Link href="https://www.tiktok.com/@vuamu">
                            <FontAwesomeIcon icon={['fab', 'tiktok']} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                }
                return (
                  <div key={el?.node_id} className="col-lg-2 footer-it-sm">
                    <div className="links">
                      <h6 className="fz-18 fw-bold mb-title text-uppercase">{el?.title}</h6>
                      <ul className="links-list">
                        {el?.child?.map((item: any) => {
                          return (
                            <Fragment key={item?.node_id * item?.menu_id}>
                              <li>
                                <Link href={item?.type == 'category' ? '' : item?.url_key}>
                                  {item?.title}
                                </Link>
                              </li>
                            </Fragment>
                          )
                        })}
                      </ul>
                    </div>
                  </div>
                )
              })}

              {/* <div className="col-lg-2">
                <div className="links">
                  <h6 className="fsz-18 fw-bold mb-30 text-uppercase">top Categories</h6>
                  <ul className="links-list">
                    <li>
                      <a href="#"> Laptops </a>
                    </li>
                    <li>
                      <a href="#"> PC & Computers </a>
                    </li>
                    <li>
                      <a href="#"> Cell Phones </a>
                    </li>
                    <li>
                      <a href="#"> Tablets </a>
                    </li>
                    <li>
                      <a href="#"> Gaming & VR </a>
                    </li>
                    <li>
                      <a href="#"> networks </a>
                    </li>
                    <li>
                      <a href="#"> Cameras </a>
                    </li>
                    <li>
                      <a href="#"> Sounds </a>
                    </li>
                    <li>
                      <a href="#"> Office </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-2">
                <div className="links">
                  <h6 className="fsz-18 fw-bold mb-30 text-uppercase">company</h6>
                  <ul className="links-list">
                    <li>
                      <a href="#"> About Swoo </a>
                    </li>
                    <li>
                      <a href="#"> Contact </a>
                    </li>
                    <li>
                      <a href="#"> Career </a>
                    </li>
                    <li>
                      <a href="/blog"> Blog </a>
                    </li>
                    <li>
                      <a href="#"> Sitemap </a>
                    </li>
                    <li>
                      <a href="#"> Store Locations </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-2">
                <div className="links">
                  <h6 className="fsz-18 fw-bold mb-30 text-uppercase">help center</h6>
                  <ul className="links-list">
                    <li>
                      <a href="#"> Customer Service </a>
                    </li>
                    <li>
                      <a href="#"> Policy </a>
                    </li>
                    <li>
                      <a href="#"> Terms & Conditions </a>
                    </li>
                    <li>
                      <a href="#"> Trach Order </a>
                    </li>
                    <li>
                      <a href="#"> FAQs </a>
                    </li>
                    <li>
                      <a href="#"> My Account </a>
                    </li>
                    <li>
                      <a href="#"> Product Support </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-2">
                <div className="links">
                  <h6 className="fsz-18 fw-bold mb-30 text-uppercase">partner</h6>
                  <ul className="links-list">
                    <li>
                      <a href="#"> Become Seller </a>
                    </li>
                    <li>
                      <a href="#"> Affiliate </a>
                    </li>
                    <li>
                      <a href="#"> Advertise </a>
                    </li>
                    <li>
                      <a href="#"> Partnership </a>
                    </li>
                  </ul>
                </div>
              </div> */}
            </div>
            {/* <div className="footer-btm-info mt-60">
            <div className="row">
              <div className="col-lg-4">
                <div className="dropdowns">
                  <ul className="links-ul">
                    <li className="dropdown">
                      <a
                        className="dropdown-toggle"
                        href="#"
                        id="navbarDropdown"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <i className="la la-dollar-sign me-1"></i> USD
                      </a>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="navbarDropdown"
                      >
                        <li><a className="dropdown-item" href="#">USD</a></li>
                        <li><a className="dropdown-item" href="#">USD</a></li>
                      </ul>
                    </li>
                    <li className="dropdown">
                      <a
                        className="dropdown-toggle"
                        href="#"
                        id="navbarDropdown1"
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                      >
                        <img
                          src="/assets/images/eng.png"
                          alt=""
                          className="me-1 icon-15"
                        />
                        Eng
                      </a>
                      <ul
                        className="dropdown-menu"
                        aria-labelledby="navbarDropdown1"
                      >
                        <li><a className="dropdown-item" href="#">Arabic</a></li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-8">
                <div className="subscribe-content">
                  <h6 className="fsz-18 fw-bold mb-30 text-uppercase">
                    subscribe & get
                    <span className="color-red1"> 10% off </span> for your first
                    order
                  </h6>
                  <div className="form-group">
                    <span className="icon"> <i className="la la-envelope"></i> </span>
                    <input type="text" placeholder="Enter your email address" />
                    <button>
                      subscribe
                      <i className="la la-long-arrow-right ms-2 fsz-18"></i>
                    </button>
                  </div>
                  <p className="fsz-13 fst-italic color-666 mt-2">
                    By subscribing, you’re accepted the our
                    <a href="#" className="color-000 text-decoration-underline">
                      Policy
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div> */}
          </div>
          <div className="foot">
            <div className="row align-items-center">
              <div className="col-lg-4 text-center text-lg-start">
                <p className="color-666">
                  © 2023 <strong className="color-000"> mubaohiemchinhhang </strong>. Đã đăng ký bản quyền
                </p>
              </div>
              <div className="col-lg-4">
                <div className="pay-imgs text-center my-3 my-lg-0">
                  <img src="/assets/images/payment/pay1.png" alt="" />
                  <img src="/assets/images/payment/pay2.png" alt="" />
                  <img src="/assets/images/payment/pay3.png" alt="" />
                  <img src="/assets/images/payment/pay4.png" alt="" />
                  <img src="/assets/images/payment/pay5.png" alt="" />
                </div>
              </div>
              <div className="col-lg-4 text-center text-lg-end">
                {/* <a href="#" className="text-primary">
                <i className="la la-mobile me-1 fsz-16"></i> Mobile Site
              </a> */}
              </div>
            </div>
          </div>
        </div>
        <div className="mob-navigation d-lg-none">
          <ul className="p-0">
            {listLinks?.map((el) => (
              <li key={el?.url} className={`list ${router.asPath == el?.url ? 'active' : ''}`}>
                <Link href={el?.url}>
                  <span className="icon">{el?.icon}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </footer>
    </>
  )
}
