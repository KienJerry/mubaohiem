import useCart from '@/hooks/useCart'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Cookies from 'js-cookie'
import { COOKIE_KEY } from '@/services/graphql'
import Image from 'next/image'

type IInfoCusstomerProps = {
  type?: string,
  data: any,
  hideSubMenu?: (val: boolean) => void,
}

export const InfoCustomerHeader = ({ type, data, hideSubMenu }: IInfoCusstomerProps) => {
  const [width, setWidth] = useState(0)

  const { onUserLogout } = useCart()

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = () => {
    Cookies.remove(COOKIE_KEY.ACCESS_TOKEN)
    localStorage.clear()
    onUserLogout()
    window.location.href = '/login'
  }
  const handleHideSubMenu = () => {
    if (hideSubMenu) {
      hideSubMenu(false)
    }
  }
  return (
    <>
      {width > 991 ? (
        type != 'mobile' &&
        (data ? (
          <div className="text-item ms-3 wrp-active-profile">
            <Link href={'/profile'} className="active-profile">
              {data?.fullName}
            </Link>
            <div className="box-profile" id="profile-header-id">
              <Link href={'/profile'} className="item">
                Thông tin tài khoản
              </Link>
              <div className="item" onClick={() => handleLogout()}>
                Đăng xuất
              </div>
            </div>
          </div>
        ) : (
          <div className="text-item ms-3 box-title-login-desktop">
            <Link href="/login" className="fsz-14 text-uppercase fw-bold txt-auth">
              Đăng nhập
            </Link>
            {' / '}
            <Link href="/register" className="fsz-14 text-uppercase fw-bold txt-auth">
              Đăng ký
            </Link>
          </div>
        ))
      ) : data ? (
        <div className="nav-item d-lg-none">
          <div className="info-user">
            <div className="img">
              <Image
                fill
                src="/assets/images/inner/avatar.jpg"
                alt=""
                className="main-img img-cover"
              />
            </div>
            <Link href={'/profile'} className="nav-link" onClick={handleHideSubMenu}>
              <p className="name-user">{data?.fullName}</p>
              <p className="mail-user">{data?.mailHiden}</p>
            </Link>
          </div>
          {/* <div
            style={{ color: 'red', fontSize: '14px', cursor: 'pointer' }}
            onClick={() => handleLogout()}>
            Đăng xuất
          </div> */}
        </div>
      ) : (
        <>
          {/* <li className="nav-item d-block d-lg-none">
            <Link className="nav-link" href="/login" onClick={handleHideSubMenu}>
              Đăng nhập
            </Link>
          </li>
          <li className="nav-item d-block d-lg-none">
            <Link className="nav-link" href="/register" onClick={handleHideSubMenu}>
              Đăng ký
            </Link>
          </li> */}
          <div className="text-item box-title-login-desktop">
            <div className="img">
              <Image
                fill
                src="/assets/images/user-avt.jpg"
                alt=""
                className="main-img img-cover"
              />
            </div>
            <div >
              <Link
                href="/login"
                className="fsz-14 text-uppercase fw-5 txt-auth"
                onClick={handleHideSubMenu}>
                Đăng nhập
              </Link>
              {' / '}
              <Link
                href="/register"
                className="fsz-14 text-uppercase fw-5 txt-auth"
                onClick={handleHideSubMenu}>
                Đăng ký
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  )
}
