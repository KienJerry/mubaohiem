import { FC, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

type ItemNavbar = {
  category: any,
}

const ItemNavbar: FC<ItemNavbar> = ({ category }) => {
  const [active, setActive] = useState(false)

  return (
    <>
      <div className="cat-link">
        {category?.image ? (
          <Image
            src={category?.image}
            alt="category icon"
            width={16}
            height={16}
            className="me-2"
          />
        ) : null}
        <Link href={`/products?category_uid=${category.uid}`}> {category?.name} </Link>
        <i
          onClick={() => setActive(!active)}
          className={`las ${active ? 'la-angle-down' : 'la-angle-right'} arrow cursor-pointer`}></i>
      </div>
      {active &&
        category?.children?.map((val: any) => {
          return (
            <div className="cat-link" key={val?.uid}>
              {val?.image ? (
                <Image
                  src={val?.image}
                  alt="category icon"
                  width={16}
                  height={16}
                  className="me-2"
                />
              ) : null}
              <Link className='txt-child' href={`/products?category_uid=${val.uid}`}> {val?.name} </Link>
            </div>
          )
        })}
    </>
  )
}

export default ItemNavbar
