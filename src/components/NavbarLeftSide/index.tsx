import { FC } from 'react'
import ItemNavbar from './itemNavabr'

type NavbarLeftSide = {
  categories: Category,
}

const NavbarLeftSide: FC<NavbarLeftSide> = ({ categories }) => {
  // const renderItemsCategory = () => {
  //   return categories?.children
  //     ?.sort((a, b) => a.position - b.position)
  //     ?.map((category) => {
  //       return (
  //         <li key={category.uid} className="container-hover">
  //           <Link href={category.url_path} className="cat-link main-content-hover">
  //               {/* <i className="la la-laptop me-2 fs-6"></i> */}
  //               {category?.image ? (
  //                 <Image src={category.image} alt="category icon" width={16} height={16} />
  //               ) : null}
  //               <span> {category.name} </span>
  //               <i className="las la-angle-right arrow"></i>
  //             </Link>
  //             <div className='sub-content-hover'>children content</div>
  //         </li>

  //       )
  //     })
  // }

  const renderItemsCategory = () => {
    return categories?.children
      ?.sort((a, b) => a.position - b.position)
      ?.map((category) => {
        return (
          <li key={category.uid}>
            <ItemNavbar category={category} />{' '}
          </li>
        )
      })
  }

  return (
    <div className="cat-list h-100">
      {/* <a href="#" className="fw-700 color-red1 text-uppercase mb-2">
        <i className="la la-fire me-2 fs-6"></i> SALE 40% OFF
      </a> */}
      <ul className="p-0">{renderItemsCategory()}</ul>
    </div>
  )
}

export default NavbarLeftSide
