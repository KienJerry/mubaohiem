/* eslint-disable @next/next/no-img-element */
import Breadcrumb from '@/components/Breadcrumb'
import UserReviews from '@/components/pages/about/UserReviews'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const AboutPage = () => {
  return (
    <div className="home-style3 about-pg-1">
      <Breadcrumb
        items={[
          {
            title: 'Trang chủ',
            href: '/',
          },
          {
            title: 'Giới  thiệu',
            href: '#',
          },
        ]}
      />

      <section className="tc-main-about p-30 radius-4 bg-white mt-3 wow fadeInUp">
        <div className="main-card">
          <div className="about-banner">
            <h1 className="fw-400 fsz-45">
              <strong> Best experience </strong> <br /> always wins
            </h1>
            <p className="fsz-14 color-666 mt-30">
              #1 Online Marketplace for Electronic & Technology <br /> in Mahanttan, CA
            </p>
          </div>
          <div className="about-numbers">
            <div className="row">
              <div className="col-lg-5">
                <div className="info-text">
                  <h6 className="fsz-18 text-uppercase fw-bold lh-5">
                    our purpose is to <span className="color-green2"> enrich </span> <br />
                    <span className="color-green2"> and enhance lives </span> through <br />
                    technology
                  </h6>
                </div>
              </div>
              <div className="col-lg-7">
                <div className="numbers">
                  <div className="row justify-content-between">
                    <div className="col-lg-4">
                      <div className="num-card mt-4 mt-lg-0">
                        <h2 className="fsz-40 text-uppercase"> $12,5M </h2>
                        <p className="fsz-12 color-666 text-uppercase">
                          total revenue from <br /> 2001 - 2023
                        </p>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="num-card mt-4 mt-lg-0">
                        <h2 className="fsz-40 text-uppercase"> 12K+ </h2>
                        <p className="fsz-12 color-666 text-uppercase">
                          orders delivered <br /> successful on everyday
                        </p>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="num-card mt-4 mt-lg-0">
                        <h2 className="fsz-40 text-uppercase"> 725+ </h2>
                        <p className="fsz-12 color-666 text-uppercase">
                          store and office in U.S <br /> and worldwide
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="sub-cards">
          <div className="row gx-2">
            <div className="col-lg-6 mt-3">
              <div className="img">
                <img src="/assets/images/inner/about/about2.png" alt="" className="img-cover" />
              </div>
            </div>
            <div className="col-lg-6 mt-3">
              <div className="info-card">
                <div className="cont">
                  <h6 className="fsz-18 fw-bold mb-0">
                    We connect millions of buyers and sellers around the world, empowering people &
                    creating economic opportunity for all.
                  </h6>
                  <p className="fsz-14 color-666 mt-30">
                    Within our markets, millions of people around the world connect, both online and
                    offline, to make, sell and buy unique goods. We also offer a wide range of
                    Seller Services and tools that help creative entrepreneurs start, manage & scale
                    their businesses.
                  </p>
                  <a
                    href="https://www.youtube.com/watch?v=qYgdnM3BC3g"
                    className="butn bg-green2 text-white radius-4 fw-500 fsz-12 text-uppercase text-center mt-40 py-3"
                    data-fancybox="">
                    <span>
                      <i className="la la-play me-1"></i> our showreel
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tc-about-cards">
        <div className="row gx-2">
          <div className="col-lg-4 mt-3">
            <div className="about-card wow fadeInUp">
              <div className="title">
                <h6 className="fsz-18 fw-bold text-uppercase">
                  100% authentic <br /> products
                </h6>
                <span className="icon">
                  <i className="la la-check-circle"></i>
                </span>
              </div>
              <div className="text fsz-14 color-666">
                Swoo Tech Mart just distribute 100% authorized products & guarantee quality. Nulla
                porta nulla nec orci vulputate, id rutrum sapien varius.
              </div>
            </div>
          </div>
          <div className="col-lg-4 mt-3">
            <div className="about-card wow fadeInUp" data-wow-delay="0.2s">
              <div className="title">
                <h6 className="fsz-18 fw-bold text-uppercase">
                  fast <br /> delivery
                </h6>
                <span className="icon">
                  <i className="la la-shipping-fast"></i>
                </span>
              </div>
              <div className="text fsz-14 color-666">
                Fast shipping with a lots of option to delivery. 100% guarantee that your goods
                alway on time and perserve quality.
              </div>
            </div>
          </div>
          <div className="col-lg-4 mt-3">
            <div className="about-card wow fadeInUp" data-wow-delay="0.4s">
              <div className="title">
                <h6 className="fsz-18 fw-bold text-uppercase">
                  affordable <br /> price
                </h6>
                <span className="icon">
                  <i className="la la-hand-holding-usd"></i>
                </span>
              </div>
              <div className="text fsz-14 color-666">
                We offer an affordable & competitive price with a lots of special promotions.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tc-mission-vision p-30 radius-4 bg-white mt-3 wow fadeInUp">
        <div className="main-content pb-30 border-bottom">
          <h6 className="fsz-18 fw-bold text-uppercase mb-30"> our mission and vision </h6>
          <div className="text fsz-14 mb-30">
            Nam maximus nunc a augue pulvinar, non euismod mauris tempus. Cras non elit vel magna
            molestie pellentesque in eu dui. Donec laoreet quis erat vitae finibus. Vestibulum enim
            eros, porta eget quam et, euismod dictum elit. Nullam eu tempus magna. Fusce malesuada
            nisi id felis placerat porta vel sed augue. <strong> Vivamus mollis mauris </strong>
            vitae rhoncus egestas. Pellentesque habitant morbi tristique senectus et netus et
            malesuada fames ac turpis egestas.
          </div>
          <div className="img th-400">
            <img
              src="/assets/images/inner/about/about3.png"
              alt=""
              className="img-cover radius-4"
            />
          </div>
        </div>
        <div className="years-content pt-30 pb-30 border-bottom">
          <h6 className="fsz-18 fw-bold text-uppercase mb-30">
            from a retail store to the global chain of stores
          </h6>
          <div className="text fsz-14 mb-30">
            Pellentesque laoreet justo nec ex sodales euismod. Aliquam orci tortor, bibendum nec
            ultricies ac, auctor nec purus. Maecenas in consectetur erat.
          </div>
          <div className="years">
            <div className="row gx-5">
              <div className="col-lg-6">
                <div className="year-card">
                  <strong className="color-000 me-2"> 1997: </strong>
                  <span> A small store located in Brooklyn Town, USA </span>
                </div>
                <div className="year-card">
                  <strong className="color-000 me-2"> 1998: </strong>
                  <span>
                    It is a long established fact that a reader will be distracted by the readable
                  </span>
                </div>
                <div className="year-card">
                  <strong className="color-000 me-2"> 2000: </strong>
                  <span>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry
                  </span>
                </div>
                <div className="year-card">
                  <strong className="color-000 me-2"> 2002: </strong>
                  <span>
                    Lorem Ipsum has been the industry&apos;s standard dummy text ever since the
                  </span>
                </div>
                <div className="year-card">
                  <strong className="color-000 me-2"> 2004: </strong>
                  <span> Contrary to popular belief, Lorem Ipsum is not simply random text </span>
                </div>
                <div className="year-card">
                  <strong className="color-000 me-2"> 2005: </strong>
                  <span>
                    The point of using Lorem Ipsum is that it has a more-or-less normal distribution
                    of letters, as opposed to using &apos;Content here
                  </span>
                </div>
                <div className="year-card">
                  <strong className="color-000 me-2"> 2006: </strong>
                  <span>
                    There are many variations of passages of Lorem Ipsum available, but the majority
                    have suffered alteration in some form, by injected humour, or randomised words
                    which don&apos;t look even slightly believable.
                  </span>
                </div>
                <div className="year-card">
                  <strong className="color-000 me-2"> 2010: </strong>
                  <span>
                    All the Lorem Ipsum generators on the Internet tend to repeat predefined
                  </span>
                </div>
                <div className="year-card">
                  <strong className="color-000 me-2"> 2013: </strong>
                  <span> Lorem Ipsum comes from sections 1.10.32 </span>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="year-card">
                  <strong className="color-000 me-2"> 2014: </strong>
                  <span>
                    There are many variations of passages of Lorem Ipsum available, but the majority
                    have suffered alteration in some form
                  </span>
                </div>
                <div className="year-card">
                  <strong className="color-000 me-2"> 2016: </strong>
                  <span>
                    All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks
                    as necessary
                  </span>
                </div>
                <div className="year-card">
                  <strong className="color-000 me-2"> 2020: </strong>
                  <span> Lorem Ipsum comes from sections 1.10.32 </span>
                </div>
                <div className="year-card">
                  <strong className="color-000 me-2"> 2021: </strong>
                  <span> Making this the first true generator on the Internet </span>
                </div>
                <div className="year-card">
                  <strong className="color-000 me-2"> 2022: </strong>
                  <span>
                    Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore
                    always free from repetition, injected humour
                  </span>
                </div>
                <div className="year-card">
                  <strong className="color-000 me-2"> 2023: </strong>
                  <span>
                    here are many variations of passages of Lorem Ipsum available, but the majority
                    have suffered alteration in some form
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="leaderships pt-30">
          <div className="title mb-30">
            <div className="row">
              <div className="col-lg-9">
                <h6 className="fsz-18 fw-bold text-uppercase"> leaderships </h6>
              </div>
              <div className="col-lg-3 text-lg-end mt-4 mt-lg-0">
                <a href="#" className="fsz-13 color-666">
                  View All <i className="la la-angle-right ms-1"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="leaderships-content">
            <div className="leader-card">
              <div className="img">
                <a href="#" className="d-block">
                  <img
                    src="/assets/images/inner/about/members/mem1.png"
                    alt=""
                    className="main-img img-cover"
                  />
                </a>
                <div className="social-icons">
                  <a href="#">
                    <FontAwesomeIcon icon={['fab', 'twitter']} className="text-[white]" />
                  </a>
                  <a href="#">
                    <FontAwesomeIcon icon={['fab', 'linkedin']} className="text-[white]" />
                  </a>
                  <a href="#">
                    <FontAwesomeIcon icon={['fab', 'instagram']} className="text-[white]" />
                  </a>
                </div>
              </div>
              <div className="info pt-15">
                <h6 className="fsz-16 fw-bold">
                  <a href="#"> Henry Avery </a>
                </h6>
                <small className="fsz-12 color-666 text-uppercase"> Chairman </small>
              </div>
            </div>
            <div className="leader-card">
              <div className="img">
                <a href="#" className="d-block">
                  <img
                    src="/assets/images/inner/about/members/mem2.png"
                    alt=""
                    className="main-img img-cover"
                  />
                </a>
                <div className="social-icons">
                  <a href="#">
                    <FontAwesomeIcon icon={['fab', 'twitter']} className="text-[white]" />
                  </a>
                  <a href="#">
                    <FontAwesomeIcon icon={['fab', 'linkedin']} className="text-[white]" />
                  </a>
                  <a href="#">
                    <FontAwesomeIcon icon={['fab', 'instagram']} className="text-[white]" />
                  </a>
                </div>
              </div>
              <div className="info pt-15">
                <h6 className="fsz-16 fw-bold">
                  <a href="#"> Michael Edward </a>
                </h6>
                <small className="fsz-12 color-666 text-uppercase"> Vice President </small>
              </div>
            </div>
            <div className="leader-card">
              <div className="img">
                <a href="#" className="d-block">
                  <img
                    src="/assets/images/inner/about/members/mem3.png"
                    alt=""
                    className="main-img img-cover"
                  />
                </a>
                <div className="social-icons">
                  <a href="#">
                    <FontAwesomeIcon icon={['fab', 'twitter']} className="text-[white]" />
                  </a>
                  <a href="#">
                    <FontAwesomeIcon icon={['fab', 'linkedin']} className="text-[white]" />
                  </a>
                  <a href="#">
                    <FontAwesomeIcon icon={['fab', 'instagram']} className="text-[white]" />
                  </a>
                </div>
              </div>
              <div className="info pt-15">
                <h6 className="fsz-16 fw-bold">
                  <a href="#"> Eden Hazard </a>
                </h6>
                <small className="fsz-12 color-666 text-uppercase"> CEO </small>
              </div>
            </div>
            <div className="leader-card">
              <div className="img">
                <a href="#" className="d-block">
                  <img
                    src="/assets/images/inner/about/members/mem4.png"
                    alt=""
                    className="main-img img-cover"
                  />
                </a>
                <div className="social-icons">
                  <a href="#">
                    <FontAwesomeIcon icon={['fab', 'twitter']} className="text-[white]" />
                  </a>
                  <a href="#">
                    <FontAwesomeIcon icon={['fab', 'linkedin']} className="text-[white]" />
                  </a>
                  <a href="#">
                    <FontAwesomeIcon icon={['fab', 'instagram']} className="text-[white]" />
                  </a>
                </div>
              </div>
              <div className="info pt-15">
                <h6 className="fsz-16 fw-bold">
                  <a href="#"> Robert Downey Jr </a>
                </h6>
                <small className="fsz-12 color-666 text-uppercase"> CEO </small>
              </div>
            </div>
            <div className="leader-card">
              <div className="img">
                <a href="#" className="d-block">
                  <img
                    src="/assets/images/inner/about/members/mem5.png"
                    alt=""
                    className="main-img img-cover"
                  />
                </a>
                <div className="social-icons">
                  <a href="#">
                    <FontAwesomeIcon icon={['fab', 'twitter']} className="text-[white]" />
                  </a>
                  <a href="#">
                    <FontAwesomeIcon icon={['fab', 'linkedin']} className="text-[white]" />
                  </a>
                  <a href="#">
                    <FontAwesomeIcon icon={['fab', 'instagram']} className="text-[white]" />
                  </a>
                </div>
              </div>
              <div className="info pt-15">
                <h6 className="fsz-16 fw-bold">
                  <a href="#"> Nathan Drake </a>
                </h6>
                <small className="fsz-12 color-666 text-uppercase"> strategist director </small>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="partners-clients">
        <div className="row gx-2">
          <div className="col-lg-6">
            <div className="partners p-30 radius-4 bg-white mt-3 wow fadeInUp">
              <h6 className="fsz-18 fw-bold text-uppercase mb-10"> our partners </h6>
              <div className="logos">
                <a href="#" className="logo">
                  <img src="/assets/images/inner/about/logos/logo9.png" alt="" />
                </a>
                <a href="#" className="logo">
                  <img src="/assets/images/inner/about/logos/logo10.png" alt="" />
                </a>
                <a href="#" className="logo">
                  <img src="/assets/images/inner/about/logos/logo2.png" alt="" />
                </a>
                <a href="#" className="logo">
                  <img src="/assets/images/inner/about/logos/logo3.png" alt="" />
                </a>
                <a href="#" className="logo">
                  <img src="/assets/images/inner/about/logos/logo8.png" alt="" />
                </a>
                <a href="#" className="logo">
                  <img src="/assets/images/inner/about/logos/logo4.png" alt="" />
                </a>
                <a href="#" className="logo">
                  <img src="/assets/images/inner/about/logos/logo5.png" alt="" />
                </a>
                <a href="#" className="logo">
                  <img src="/assets/images/inner/about/logos/logo1.png" alt="" />
                </a>
                <a href="#" className="logo">
                  <img src="/assets/images/inner/about/logos/logo2.png" alt="" />
                </a>
                <a href="#" className="logo">
                  <img src="/assets/images/inner/about/logos/logo3.png" alt="" />
                </a>
                <a href="#" className="logo">
                  <img src="/assets/images/inner/about/logos/logo6.png" alt="" />
                </a>
                <a href="#" className="logo">
                  <img src="/assets/images/inner/about/logos/logo7.png" alt="" />
                </a>
                <a href="#" className="logo">
                  <img src="/assets/images/inner/about/logos/logo8.png" alt="" />
                </a>
                <a href="#" className="logo">
                  <img src="/assets/images/inner/about/logos/logo9.png" alt="" />
                </a>
                <a href="#" className="logo">
                  <img src="/assets/images/inner/about/logos/logo10.png" alt="" />
                </a>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <UserReviews />
          </div>
        </div>
      </section>

      <section className="tc-banner-style3 mt-3 mb-3">
        <div className="banner-card text-center">
          <h6 className="d-block d-lg-inline-flex align-items-center fw-400 fsz-18 lh-5">
            <img src="/assets/images/inner/star.png" alt="" className="icon-30 me-2" /> Member get
            <span className="text-uppercase text-color"> FREE SHIPPING* </span> with no order
            minimum!. *Restriction apply
            <a href="#" className="fsz-14 text-decoration-underline ms-2">
              Try free 30-days trial!
            </a>
          </h6>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
