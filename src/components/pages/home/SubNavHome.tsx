import Link from 'next/link'

const SubNavHome = () => {
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
        <Link href={link.url} key={link.title}>
          {link.title}
        </Link>
      )
    })
  }

  return (
    <div className="tc-recently-viewed-style3 radius-4 mn-sub-nav">{renderLinks()}</div>
  )
}

export default SubNavHome
