/* eslint-disable @next/next/no-img-element */
import Breadcrumb from '@/components/Breadcrumb'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import authenApi from '@/services/authenticate.queries'
import ChangePasswordTab from './changePassword'
import AccountInfoTab from './accountInfo'
import MyOrderTab from './myOrder'
import DetailOrder from './detailOrder'
import { GETTOKEN } from '@/services/graphql'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import useCart from '@/hooks/useCart'
import { COOKIE_KEY } from '@/services/graphql'

const CONTENT_PROFILE_PAGE = [
  {
    title: 'Tài Khoản',
    id: 'profile',
  },
  {
    title: 'Đơn hàng',
    id: 'order',
  },
  {
    title: 'Đổi mật khẩu',
    id: 'changePassword',
  },
]

const ProfilePage = () => {
  const router: any = useRouter()
  const [currentTab, setCurrentTab] = useState<any>(null)
  const { onUserLogout } = useCart()

  useEffect(() => {
    // let defaultTab = parseInt(router?.query?.tab, 10)
    let defaultTab: any = router?.query?.tab
    if (!defaultTab) {
      defaultTab = 'profile'
    }
    setCurrentTab(defaultTab)
  }, [router?.query?.tab])

  const { data: dataInfoCustomer } = useQuery({
    queryKey: ['getCustomer'],
    queryFn: async () => {
      return await authenApi.getInfoCustomer().then((response: any) => {
        return response || null
      })
    },
    enabled: !!GETTOKEN.tokenAuth(),
  })

  const handleRenderTab = (val: any) => {
    if (val.id == router?.query?.tab) return
    router.push({
      query: { tab: val.id },
    })
  }

  const renderNavLink = () => {
    return CONTENT_PROFILE_PAGE.map((item) => (
      <li className="nav-item" role="presentation" key={item.id}>
        <button
          className={`nav-link ${currentTab == item.id ? 'active' : ''}`}
          data-bs-toggle="pill"
          data-bs-target="#pills-prof1"
          onClick={() => handleRenderTab(item)}>
          <span> {item.title} </span> <i className="la la-arrow-right"></i>
        </button>
      </li>
    ))
  }

  const handleLogout = () => {
    Cookies.remove(COOKIE_KEY.ACCESS_TOKEN)
    localStorage.clear()
    onUserLogout()
    window.location.href = '/login'
  }

  return (
    <div className="home-style3 profile-pg-1">
      <Breadcrumb
        items={[
          {
            title: 'Trang chủ',
            href: '/',
          },
          {
            title: 'Tài khoản',
            href: '/profile',
          },
        ]}
      />

      <section className="tc-profile box-wr bg-white mt-3 wow fadeInUp mb-3">
        <div className="row">
          <div className="col-lg-3 bg-profile">
            <div className="tabs-side mb-4 mb-lg-0">
              <div className="main-info">
                <div className="img">
                  <img
                    src="/assets/images/inner/avatar.jpg"
                    alt=""
                    className="main-img img-cover"
                  />
                </div>
                <div className="info-txt">
                  <h5 className="fw-bold info-name"> {dataInfoCustomer?.fullName}</h5>
                  <div className="color-666 lh-lg" style={{ fontSize: '16px' }}>
                    <div>
                      {' '}
                      {dataInfoCustomer?.mailHiden?.length >= 21 ? (
                        <>{dataInfoCustomer?.mailHiden?.slice(0, 21)}...</>
                      ) : (
                        dataInfoCustomer?.mailHiden
                      )}
                    </div>
                    {/* <!-- <li> <a href="#"> Los Angeles, CA </a> </li> --> */}
                  </div>
                </div>
              </div>

              <ul className="nav nav-pills" id="pills-tab" role="tablist">
                {renderNavLink()}
              </ul>
            </div>
            <div className="btn-logout-profile" onClick={() => handleLogout()}>
              Đăng xuất
            </div>
          </div>
          <div className="col-lg-9">
            <div className="tab-content" id="pills-tabContent">
              {currentTab == 'profile' ? (
                <AccountInfoTab dataUserInfo={dataInfoCustomer} />
              ) : currentTab == 'order' ? (
                <MyOrderTab />
              ) : currentTab == 'changePassword' ? (
                <ChangePasswordTab />
              ) : currentTab == 'detailOrder' ? (
                <DetailOrder />
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProfilePage
