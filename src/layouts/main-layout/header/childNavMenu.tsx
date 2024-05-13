/* eslint-disable @next/next/no-img-element */
import { useState } from 'react'

import Link from 'next/link'

export const ChildMenu = ({ data, path, hideSubMenu }: any) => {
  const [isSubMenuActive, setIsSubMenuActive] = useState(false)

  const handleNavClick = () => {
    setIsSubMenuActive(!isSubMenuActive)
  }

  return (
    <>
      <div className="nav-link menu" style={{ cursor: 'pointer' }} onClick={() => handleNavClick()}>
        {data?.title}
        <span className="arrow" style={{ marginLeft: '5px' }}>
          {isSubMenuActive ? (
            <i className="la la-angle-up"></i>
          ) : (
            <i className="la la-angle-down"></i>
          )}
        </span>
      </div>
      {data?.childData?.length > 0 && (
        <div className={`sub-menu-items ${isSubMenuActive && `active`}`} id="sub-menu-items">
          {data?.childData?.map((val: any, idx: number) => {
            return (
              <Link
                onClick={() => hideSubMenu(false)}
                href={`${val?.url_key}`}
                className={`item nav-menu ${val?.url_key == path ? 'active' : ''}`}
                key={idx}>
                {val?.title}
              </Link>
            )
          })}
        </div>
      )}
    </>
  )
}
