import { FC } from 'react'
import { Breadcrumb as BreadcrumbAntd } from 'antd'
import Link from 'next/link'
import { useWindowSize } from '@/hooks/useWindowSize'

type PropsBreadcrumb = {
  items: {
    title: string | React.ReactNode,
    href: string,
  }[],
}

const Breadcrumb: FC<PropsBreadcrumb> = ({ items }) => {
  const { isMobile, isTablet } = useWindowSize()

  const renderItems = () => {
    return items?.map((item, index) => {
      return (
        <li
          key={index}
          className={`breadcrumb-item color-999 ${index + 1 === items?.length ? 'active breadcrumb-active' : ''
            }`}
          style={{ display: 'flex' }}
          aria-current="page">
          {index > 0 && <div style={{ padding: '0 6px 0 0' }}>/</div>}
          <Link href={item?.href}>{item?.title}</Link>
        </li>
      )
    })
  }

  if (isMobile || isTablet) {
    let bcItems
    bcItems = items?.map((item) => {
      return {
        href: item.href ?? '',
        title: item.title,
      }
    })
    // const LENGTH_BC = items.length - 1
    // if (items?.length > 3) {
    //   const child = items?.splice(0, LENGTH_BC - 1)?.map((item) => ({
    //     title: <Link href={item?.href}>{item?.title}</Link>,
    //     href: item?.href,
    //   }))
    //   const listBc = items?.map((item) => ({
    //     title: item?.title,
    //     href: item?.href,
    //   }))
    //   bcItems = [
    //     {
    //       title: '...',
    //       menu: child,
    //     },
    //     ...listBc,
    //   ]
    // } else {
    //   bcItems = items?.map((item) => {
    //     return {
    //       href: item.href ?? '',
    //       title: item.title,
    //     }
    //   })
    // }

    return (
      <section className="tc-breadcrumb-style6  bg-white mt-3 wow fadeInUp MN-breadcrumb">
        <BreadcrumbAntd>
          {bcItems?.map((el: any, index) => {
            if (el?.menu)
              return (
                <BreadcrumbAntd.Item
                  menu={{ items: el?.menu }}
                  key={index}
                  dropdownProps={{ placement: 'bottomLeft' }}>
                  {el?.title}
                </BreadcrumbAntd.Item>
              )
            else
              return (
                <BreadcrumbAntd.Item key={index} dropdownProps={{ placement: 'bottomLeft' }}>
                  <Link href={el?.href ?? ''}>{el?.title}</Link>
                </BreadcrumbAntd.Item>
              )
          })}
        </BreadcrumbAntd>
      </section>
    )
  }

  return (
    <section className="tc-breadcrumb-style6 p-10 radius-4 bg-white mt-3 wow fadeInUp MN-breadcrumb">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb mb-0">{renderItems()}</ol>
      </nav>
    </section>
  )
}

export default Breadcrumb
