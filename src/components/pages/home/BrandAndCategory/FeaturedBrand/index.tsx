/* eslint-disable @next/next/no-img-element */
const FeaturedBrand = () => {
  return (
    <div
      className="features-brands p-30 radius-4 bg-white mt-3 wow fadeInUp slow"
      data-wow-delay="0.2s">
      <div className="title">
        <div className="row">
          <div className="col-lg-8">
            <h6 className="fsz-18 fw-bold text-uppercase">featured brands</h6>
          </div>
          <div className="col-lg-4 text-lg-end mt-3 mt-lg-0">
            <a href="#" className="more text-capitalize color-666 fsz-13">
              View All <i className="la la-angle-right ms-1"></i>
            </a>
          </div>
        </div>
      </div>
      <div className="logos">
        <a href="#" className="logo">
          <img src="/assets/images/logos/logo4.png" alt="" />
        </a>
        <a href="#" className="logo">
          <img src="/assets/images/logos/logo5.png" alt="" />
        </a>
        <a href="#" className="logo">
          <img src="/assets/images/logos/logo1.png" alt="" />
        </a>
        <a href="#" className="logo">
          <img src="/assets/images/logos/logo2.png" alt="" />
        </a>
        <a href="#" className="logo">
          <img src="/assets/images/logos/logo3.png" alt="" />
        </a>
        <a href="#" className="logo">
          <img src="/assets/images/logos/logo6.png" alt="" />
        </a>
        <a href="#" className="logo">
          <img src="/assets/images/logos/logo7.png" alt="" />
        </a>
        <a href="#" className="logo">
          <img src="/assets/images/logos/logo8.png" alt="" />
        </a>
        <a href="#" className="logo">
          <img src="/assets/images/logos/logo9.png" alt="" />
        </a>
        <a href="#" className="logo">
          <img src="/assets/images/logos/logo10.png" alt="" />
        </a>
      </div>
    </div>
  )
}

export default FeaturedBrand
