/* eslint-disable @next/next/no-img-element */
import { FC } from 'react'
import { useQuery } from 'react-query'
import categoryApi from '@/services/categories'
import { MAX_POPULAR_ITEMS } from '../constants'
import classNames from 'classnames'

type PopularCategories = {
  currentCategory: CategoryMainChildren | null,
  onChangeCategory: (category: CategoryMainChildren | null) => void,
}

const PopularCategories: FC<PopularCategories> = ({ currentCategory, onChangeCategory }) => {
  const { data: categories } = useQuery<Category>(['GET_CATEGORIES'], {
    queryFn: async () => {
      return await categoryApi.getCategories({}).then((res: any) => res?.categories?.items?.[0])
    },
    staleTime: 30000,
  })

  const renderCategories = () => {
    if (!categories?.children) return null
    return categories?.children.map((category, index) => {
      if (index + 1 > MAX_POPULAR_ITEMS) return null
      return (
        <button
          className={classNames('number-item btn-format-bg btn-popular-category', {
            active: category?.uid === currentCategory?.uid,
          })}
          key={category.uid}
          onClick={() => onChangeCategory(category)}>
          <div className="inf">
            <h6 className="fsz-14 fw-bold mb-0 sm-title title"> {category.name} </h6>
            <small className="fsz-12 color-666"> {category.product_count} Sản phẩm </small>
          </div>
          <div className="img">
            {category?.image_banner ? (
              <img src={category.image_banner} alt="" className="img-contain" />
            ) : null}
          </div>
        </button>
      )
    })
  }

  return (
    <section className="tc-categories-style6 box-wr bg-white mt-3 wow fadeInUp">
      <h6 className="fsz-18 fw-bold text-uppercase mb-title" id="POPULAR_CATEGORIES">
        Danh mục phổ biến
      </h6>
      <div className="content">{renderCategories()}</div>
    </section>
  )
}

export default PopularCategories
