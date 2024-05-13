/* eslint-disable @next/next/no-img-element */
import { FC, useState } from 'react'

import Link from 'next/link'
import { useQuery } from 'react-query'
import authenApi from '@/services/authenticate.queries'
import homeApi from '@/services/home'
import { InfoCustomerHeader } from './infoCustomer'
import Cookies from 'js-cookie'
import { COOKIE_KEY } from '@/services/graphql'
import { ChildMenu } from './childNavMenu'
import { useRouter } from 'next/router'
import { Drawer } from 'antd'
// import Image from 'next/image'
import useCart from '@/hooks/useCart'
// import { GETTOKEN } from '@/services/graphql'
type NavMenu = {
  isShowMobile: boolean,
  handleSetSearch: (value: boolean) => void
  InforMationStore?: any,
}

export const NavMenu: FC<NavMenu> = ({ isShowMobile, handleSetSearch, InforMationStore }) => {
  const router = useRouter()
  const [isShowSubMenuMobile, setIsShowSubMenuMobile] = useState(false)
  const { cartData } = useCart()
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


  // const { data: categories } = useQuery<Category>(['GET_CATEGORIES'], {
  //   queryFn: async () => {
  //     return await categoryApi.getCategories({}).then((res: any) => res?.categories?.items?.[0])
  //   },
  //   staleTime: 30000,
  // })

  const { data: dataMenu } = useQuery({
    queryKey: ['getMenu'],
    queryFn: async () => {
      return await homeApi
        .getMenu({
          identifiers: ['main-menu'],
        })
        .then((response: any) => {
          return response?.snowdogMenus
        })
    },
    staleTime: 30000,
  })

  const onClose = () => {
    setIsShowSubMenuMobile(false)
  }


  const data = transformData(dataMenu?.items?.[0]?.nodes?.items)

  const LINKS = [
    {
      title: 'GIẢM GIÁ',
      url: '#FLASH_SALE',
    },
    {
      title: 'BÁN CHẠY',
      url: '#BEST_SELLER',
    },
    {
      title: 'NỔI BẬT',
      url: '#OUTSTANDING',
    },
    {
      title: 'SẢN PHẨM',
      url: '#PRODUCT',
    },
    {
      title: 'PHỤ KIỆN',
      url: '#ACCESSORY'
    },
  ]

  const renderLinks = () => {
    return LINKS.map((link) => {
      return (
        <>
          <li className='nav-item-viewed'>
            <Link
              key={link.title}
              className="nav-link-viewed"
              onClick={() => {
                setIsShowSubMenuMobile(false);
              }}
              href={link?.url}>
              {link?.title}
            </Link>
          </li>
        </>
      )
    })
  }



  const renderListLink = () => {
    // const categoryLinks = categories?.children?.map((el: any, index:number) =>({
    //   title: el?.name,
    //   node_id: index + 1,
    //   position: el?.position,
    //   url_key: `/products/?category_uid=${el?.uid}/`
    // }))
    // const newLinks = [{title: "Danh mục", childData: categoryLinks, node_id: data.length + 1, url_key: null},
    // {title: "Yêu thích", childData: [], node_id: data.length + 2, url_key: "/favorite-product/"},
    // {title: "So sánh", childData: [], node_id: data.length + 3, url_key: "/compare/"},
    // {title: "Tra cứu đơn hàng", childData: [], node_id: data.length + 4, url_key: "/order-lookup/"}
    // ]
    // const newListLinks = isMobile ? [...data, ...newLinks]: data
    return data?.map((val: any) => {
      return (
        <li className="nav-item" key={val?.node_id} style={{ position: 'relative' }}>
          {val?.childData?.length > 0 ? (
            <ChildMenu data={val} path={router?.asPath} hideSubMenu={setIsShowSubMenuMobile} />
          ) : (
            <Link
              onClick={() => setIsShowSubMenuMobile(false)}
              className={`nav-link ${val?.url_key == router?.asPath ? 'active' : ''}`}
              href={`${val?.url_key}`}>
              {val?.title}
            </Link>
          )}
        </li>
      )
    })
  }

  // const handleLogout = () => {
  //   Cookies.remove(COOKIE_KEY.ACCESS_TOKEN)
  //   localStorage.clear()
  //   onUserLogout()
  //   window.location.href = '/login'
  // }

  return (
    <>
      <div className='wrap-action-submenu d-lg-none'>
        <div
          className='btn-search-nav icon-link'
          onClick={() => handleSetSearch(!isShowMobile)}>
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
        <Link href="/cart" className="icons">
          <div className="icon-link">
            <i className="las la-shopping-bag"></i>
            {cartData?.items?.length && cartData?.items?.length !== 0 ? (
              <span className="num">{cartData?.items?.length}</span>
            ) : null}
          </div>
        </Link>
        <button
          className="navbar-toggler btn-toggle-drawer"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setIsShowSubMenuMobile(!isShowSubMenuMobile)}>
          <span className="navbar-toggler-icon"></span>
        </button>
      </div>
      <div
        className={`collapse navbar-collapse ms-lg-5 show-only-desktop box-nav-link-desktop ${isShowSubMenuMobile ? 'show' : ''
          }`}
        id="navbarSupportedContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          {renderListLink()}
          <InfoCustomerHeader type="mobile" data={dataInfoCustomer} hideSubMenu={setIsShowSubMenuMobile} />
        </ul>
      </div>

      <Drawer
        open={isShowSubMenuMobile}
        placement="left"
        className="MN-drawer-nav"
        onClose={onClose}>
        <div className="box-content">
          <div className="box-header">
            <div className="act-mobile">
              <InfoCustomerHeader type="mobile" data={dataInfoCustomer} hideSubMenu={setIsShowSubMenuMobile} />
            </div>
            <div className='bt-close'>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                className="lucide lucide-x"
                onClick={onClose}>
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </div>
          </div>

          <div className="nav-content">
            <ul className="navbar-nav me-auto mb-lg-0">
              {renderListLink()}
            </ul>
            <ul className='navbar-nav-viewed mb-lg-0'>
              {renderLinks()}
            </ul>
          </div>
          <div className="hot-line item-bottom">
            <small>
              <i className="las la-tty"></i> &#160;
              <span >Hotline</span>
              <span className='is-des'>&#160;24/7 </span>
            </small>
            <div className='tel-list'>
              <a href={`tel:${InforMationStore?.[0]?.telephone_1}`} className="tel-item">
                <img src="/assets/images/icon-phone.svg" alt="" className='icon ' />
                <span className='tel-number'>{InforMationStore?.[0]?.telephone_1}</span>
              </a>
              <span className='line'>&#160;{' - '}&#160;</span>
              {InforMationStore?.[0]?.telephone_2 && (
                <a href={`tel:${InforMationStore?.[0]?.telephone_2}`} className="tel-item">
                  <img src="/assets/images/icon-phone.svg" alt="" className='icon' />
                  <span className='tel-number'>{InforMationStore?.[0]?.telephone_2}</span>
                </a>
              )}
            </div>
          </div>
          <div className='order-lookup'>
            <Link
              href="/order-lookup/"
              onClick={() => setIsShowSubMenuMobile(false)}
              className='order-lookup-link'>
              <i className="fa-solid fa-clipboard-check icon" ></i>
              <span className='txt'>Tra cứu đơn hàng</span>
            </Link>
          </div>
        </div>
      </Drawer>
    </>
  )
}

const transformData = (data: any) => {
  const output: any = []

  data?.forEach((item: any) => {
    if (item?.parent_id === 0) {
      output?.push({ ...item, childData: [] })
    } else {
      const parentIndex = output?.findIndex((parent: any) => parent?.node_id === item?.parent_id)

      if (parentIndex !== -1) {
        if (!output[parentIndex]?.childData) {
          output[parentIndex].childData = []
        }
        output[parentIndex]?.childData?.push(item)
      }
    }
  })

  return output
}
