import Image from 'next/image'

type IEmptyData = {
  title?: string,
}
const EmptyData = ({ title }: IEmptyData) => {
  return (
    <div className="MN-box-empty fz-16">
      {/* <h5>Không có dữ liệu!</h5> */}
      <Image src="/assets/images/no-cart-product.jpg" width={200} height={50} alt="Empty data" />
      {title && <h5>{title}</h5>}
    </div>
  )
}

export default EmptyData
