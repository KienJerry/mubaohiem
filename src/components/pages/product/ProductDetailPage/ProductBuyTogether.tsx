/* eslint-disable @next/next/no-img-element */
const ProductBuyTogether = () => {
  return (
    <section className="product-together">
      <div className="row gx-2">
        <div className="col-lg-9">
          <div className="buy-together p-30 radius-4 bg-white mt-3 wow fadeInUp">
            <h6 className="fsz-18 fw-bold text-uppercase mb-0"> frequently bought together </h6>
            <div className="row">
              <div className="col-lg-9">
                <div className="products-imgs mt-20">
                  <div className="img">
                    <img src="/assets/images/inner/sin_product/prod1.jpg" alt="" />
                  </div>
                  <span className="plus">
                    <i className="la la-plus"></i>
                  </span>
                  <div className="img">
                    <img src="/assets/images/inner/sin_product/prod6.jpg" alt="" />
                  </div>
                  <span className="plus">
                    <i className="la la-plus"></i>
                  </span>
                  <div className="img op-3">
                    <img src="/assets/images/inner/sin_product/prod7.jpg" alt="" />
                  </div>
                </div>
                <ul className="mt-30">
                  <li>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="together1"
                        value="option1"
                      />
                      <label className="form-check-label color-333 text-[14px]" htmlFor="together1">
                        <strong> This item: </strong> Somseng Galatero X6 Ultra LTE 4G/128 Gb, Black
                        Smartphone ( <strong className="text-danger"> $569.00 </strong> )
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="together2"
                        value="option1"
                      />
                      <label className="form-check-label color-333 text-[14px]" htmlFor="together2">
                        BOSO 2 Wireless On Ear Headphone (
                        <strong className="text-danger"> $369.00 </strong> )
                      </label>
                    </div>
                  </li>
                  <li>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="together3"
                        value="option1"
                      />
                      <label className="form-check-label color-333 text-[14px]" htmlFor="together3">
                        Opplo Watch Series 8 GPS + Cellular Stainless Stell Case with Milanese Loop
                        ( <strong className="text-danger"> $129.00 </strong> )
                      </label>
                    </div>
                  </li>
                </ul>
              </div>
              <div className="col-lg-3">
                <div className="total-price">
                  <small className="fsz-12 color-666 text-uppercase mb-2"> Total Price: </small>
                  <h5 className="fsz-30 fw-bold"> $609.00 </h5>
                  <a
                    href="#"
                    className="butn bg-green2 text-white radius-4 fw-500 fsz-12 text-uppercase text-center mt-30 w-100 py-3">
                    <span> Add To Cart </span>
                  </a>
                  <a href="#" className="color-666 mt-3">
                    <i className="la la-heart me-2 color-999"></i> Ad all to Wishlist
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-3">
          <div className="banners mt-3">
            <a href="#" className="img th-200 mb-2 d-block">
              <img src="/assets/images/inner/ban1.png" alt="" className="img-cover radius-5" />
            </a>
            <a href="#" className="banner th-200 d-block">
              <img src="/assets/images/inner/ban2.png" alt="" className="img-cover radius-5" />
              <div className="info">
                <h6 className="fsz-22">
                  <strong> oPad Pro </strong> <br /> Mini 5
                </h6>
                <div className="price">
                  <small className="fsz-10 color-999 text-uppercase"> from </small>
                  <h5 className="fsz-24 fw-200 color-green2"> $169 </h5>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProductBuyTogether
