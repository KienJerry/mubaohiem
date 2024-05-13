import Link from "next/link"

const NotFoundPage = () => {
  return (
    <div className="MN-Empty-page bg-white">
      <h1>404</h1>
      <h2 className="text-uppercase">Trang không tồn tại</h2>
      <Link
        href="/"
        className="butn bg-green2 text-white radius-4 fw-500 fsz-14 text-uppercase text-center mt-40 px-5">
        <span> Trở về trang chủ </span>
      </Link>
    </div>
  )
}

export default NotFoundPage
