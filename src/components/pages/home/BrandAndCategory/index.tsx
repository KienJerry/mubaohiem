/* eslint-disable @next/next/no-img-element */
// import FeaturedBrand from '../FeaturedBrand'
import TopCategories from './TopCategories'

const BrandAndCategory = () => {
  return (
    <section className="tc-features-style3">
      <div className="row gx-3">
        {/* <div className="col-lg-6">
          <FeaturedBrand />
        </div> */}
        <div className="col-lg-12">
          <TopCategories />
        </div>
      </div>
    </section>
  )
}

export default BrandAndCategory
