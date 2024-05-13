import { FormatNumber } from '@/helper'
import { COOKIE_KEY } from '@/services/graphql'
import orderApi from '@/services/order.queries'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useQuery } from 'react-query'

const OrderSuccess = () => {
  const searchParams = useSearchParams()
  const result = searchParams.get('result')

  const accessToken = Cookies?.get(COOKIE_KEY?.ACCESS_TOKEN)

  const decodeBase64 = (str: string): string => {
    return Buffer?.from(str, 'base64')?.toString('utf-8')
  }

  const decodedResult = decodeBase64(result ?? '') ?? ''
  let resultObj: any = null

  try {
    resultObj = JSON?.parse(decodedResult) ?? {}
  } catch (error) {}

  const { data: dataTrackingOrder } = useQuery({
    queryKey: ['TRACKING_ORDER', resultObj?.orderCode],
    queryFn: async () => {
      return await orderApi
        .trackingOrder({
          orderId: resultObj?.orderCode,
          emailOrPhone: resultObj?.email,
        })
        .then((response: any) => {
          return response?.trackingOrder?.order ?? null
        })
    },
    enabled: !!resultObj?.email && !!resultObj?.orderCode,
  })

  const convertDateFormat = (inputDate: string | undefined): string => {
    if (!inputDate) return ''

    const [datePart = ''] = inputDate?.split(' ')
    const [year, month, day] = datePart?.split('-')

    const newDateFormat = `${parseInt(day ?? '')} tháng ${parseInt(month ?? '')} ${year}`

    return newDateFormat
  }

  const isSuccess = result === null || (resultObj !== null && resultObj?.status === 'success')
  const shippingAddress = dataTrackingOrder?.shipping_address

  const renderStatus = () => {
    if (!isSuccess)
      return (
        <>
          <h1 className="fsz-24 mb-5">Thất bại! Vui lòng thử lại sau.</h1>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            color="#eb4227"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-circle-x mb-3">
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          </svg>
          <p className="fsz-16">{resultObj?.message}</p>
        </>
      )

    return (
      <>
        <h1 className="fsz-24 mb-5">
          {dataTrackingOrder?.status
            ? `${dataTrackingOrder?.status} đơn hàng của bạn`
            : 'Thành công!'}
        </h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          color="#1aba1a"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          className="lucide lucide-circle-check-big mb-3">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <path d="m9 11 3 3L22 4" />
        </svg>
        <p className="fsz-16">
          {resultObj?.message ? resultObj?.message : 'Cảm ơn bạn đã mua hàng từ chúng tôi.'}
        </p>
      </>
    )
  }

  const renderOrderInfo = () => {
    if (resultObj === null || resultObj?.status !== 'success' || dataTrackingOrder === undefined)
      return null
    return (
      <div className="order-info">
        <div className="box-order-info">
          <h2 className="fsz-20 mb-3">Tóm tắt đơn hàng</h2>
          <div className="info-items">
            <div className="item">
              <p className="title">Mã đơn hàng</p>
              <p>{resultObj?.orderCode}</p>
            </div>

            <div className="item">
              <p className="title">Ngày mua hàng</p>
              <p>{convertDateFormat(dataTrackingOrder?.order_date)}</p>
            </div>

            <div className="item">
              <p className="title">Tổng cộng</p>
              <p>
                {FormatNumber(dataTrackingOrder?.total?.base_grand_total?.value, '.')}{' '}
                {dataTrackingOrder?.total?.base_grand_total?.currency}
              </p>
            </div>

            <div className="item">
              <p className="title">Hình thức thanh toán</p>
              <p>{dataTrackingOrder?.payment_methods?.[0]?.name}</p>
            </div>

            <div className="item">
              <p className="title">Đơn vị vận chuyển</p>
              <p>{dataTrackingOrder?.shipping_method}</p>
            </div>
          </div>
        </div>

        <div className="box-order-info">
          <h2 className="fsz-20 mb-3">Thông tin người nhận</h2>
          <div className="info-items">
            <div className="item">
              <p className="title">Tên khách hàng</p>
              <p>{`${shippingAddress?.lastname} ${shippingAddress?.firstname}`}</p>
            </div>

            <div className="item address">
              <p className="title">Địa chỉ</p>
              <p>{`${shippingAddress?.street?.[0]}, ${shippingAddress?.ward}, ${shippingAddress?.district}, ${shippingAddress?.city}`}</p>
            </div>

            <div className="item">
              <p className="title">Email</p>
              <p>{dataTrackingOrder?.customer_email}</p>
            </div>

            <div className="item">
              <p className="title">Số điện thoại</p>
              <p>{shippingAddress?.telephone}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="MN-order-success p-md-5 radius-4 bg-white mt-3 mb-3">
      {renderStatus()}
      <div className="box-redirect">
        <Link href="/" className="butn">
          Về trang chủ
        </Link>
        <Link href={!!accessToken ? '/profile/?tab=order' : '/order-lookup'} className="butn">
          Xem đơn hàng
        </Link>
      </div>

      {renderOrderInfo()}
    </section>
  )
}

export default OrderSuccess
