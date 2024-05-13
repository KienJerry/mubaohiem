import { useRouter } from 'next/router'
import orderApi from '@/services/order.queries'
import { useQuery } from 'react-query'
import LoadingData from '@/components/boxLayout/LoadingData'
import { FilterEmpty } from '@/components/filterEmpty'
import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import moment from 'moment'

const DetailOrder = () => {
  const router = useRouter()
  const [isFetching, setIsFetching] = useState(false)
  const data: any = router.query

  const { isLoading, data: dataDetailOrder } = useQuery({
    queryKey: ['getDetailOrderList'],
    queryFn: async () => {
      setIsFetching(true)
      return await orderApi
        .getHistoryDetailOrder({
          orderId: data?.number,
        })
        .then((response: any) => {
          setIsFetching(false)
          return response?.orderDetailCustomer
        })
        .catch(() => {})
    },
    enabled: !!data?.number,
  })

  const statusOrder = (status: string) => {
    switch (status) {
      case 'closed':
      case 'canceled':
        return 'cancel'
      case 'complete':
        return 'success'
      default:
        return 'pending'
    }
  }

  return (
    <div className="wrapper-detail-order">
      <div className='bg-title-header'>
        <Link passHref href="/profile?tab=order">
        <i className="fa-solid fa-chevron-left"></i>
        </Link>
        <h4 className="fw-bold text-capitalize title-header-detail-order"> Chi tiết đơn hàng </h4>
      </div>

      {isLoading || isFetching ? (
        <LoadingData />
      ) : !dataDetailOrder ? (
        <FilterEmpty />
      ) : (
        <>
          <div className="div-list-history">
            <div className="child-items">
              <div className="txt-name">Mã đơn hàng:</div>
              <div className="txt-value">#{dataDetailOrder?.number}</div>
            </div>
            <div className="child-items">
              <div className="txt-name">Ngày đặt hàng:</div>
              <div className="txt-value">{moment(dataDetailOrder?.order_date).format('DD/MM/YYYY hh:mm:ss')}</div>
            </div>
            <div className="child-items">
              <div className="txt-name">Phương thức thanh toán:</div>
              {dataDetailOrder?.payment_methods?.map((val: any, idx: number) => {
                return (
                  <div className="txt-value" key={idx}>
                    {val?.name}
                  </div>
                )
              })}
            </div>
            <div className="child-items">
              <div className="txt-name">Tình trạng:</div>
              <div className={`txt-value ${statusOrder(dataDetailOrder?.state)}`}>
                {dataDetailOrder?.status}
              </div>
            </div>
            {dataDetailOrder?.comments && (
              <div className="child-items">
                <div className="txt-name">Lưu ý đơn hàng:</div>
                <div className="txt-value">{dataDetailOrder?.comments}</div>
              </div>
            )}
          </div>
          <div className="desc-items">
            <div className="txt-desc-h">THÔNG TIN ĐƠN HÀNG</div>

            <div className="d-list-order-items">
              {dataDetailOrder?.items?.map((val: any) => {
                return (
                  <div
                    style={{ cursor: 'pointer' }}
                    key={val?.id}
                    className="child-item"
                    onClick={() => router.push(`/products/${val?.product_url_key}`)}>
                    <Image
                      fill
                      src={`${val?.product_image || '/assets/images/products/prod11.png'}`}
                      alt={`${val?.product_sku}`}
                    />
                    <div className="name-prod">
                      <div className="txt-title">{val?.product_sku}</div>
                      <div className="txt-price">
                        {val?.quantity_ordered}x{' '}
                        {val?.product_sale_price?.value?.toLocaleString('VI')}{' '}
                        {val?.product_sale_price?.currency}
                      </div>
                    </div>
                    <div className="txt-total-price">
                      {(val?.quantity_ordered * val?.product_sale_price?.value)?.toLocaleString(
                        'VI'
                      )}{' '}
                      {val?.product_sale_price?.currency}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="bg-bill">
              <div className="item-bill">
                <div className="txt-name">Thành tiền</div>
                <div className="txt-value">
                  {dataDetailOrder?.total?.subtotal?.value?.toLocaleString('VI')}{' '}
                  {dataDetailOrder?.total?.subtotal?.currency}
                </div>
              </div>
              <div className="item-bill">
                <div className="txt-name">Giảm giá</div>
                {dataDetailOrder?.total?.discounts?.length == 0 ? (
                  <div className="txt-value">0 VNĐ</div>
                ) : (
                  dataDetailOrder?.total?.discounts?.map((val: any, idx: number) => {
                    return (
                      <div className="txt-value" key={idx}>
                        {val?.amount?.value.toLocaleString('VI')} {val?.amount?.currency}
                      </div>
                    )
                  })
                )}
              </div>
              <div className="item-bill">
                <div className="txt-name">Phí vận chuyển</div>
                <div className="txt-value">
                  {dataDetailOrder?.total?.total_shipping?.value?.toLocaleString('VI')}
                  {dataDetailOrder?.total?.total_shipping?.currency}
                </div>
              </div>
              <div className="item-bill">
                <div className="txt-name">Hình thức thanh toán</div>
                {dataDetailOrder?.payment_methods?.map((val: any, idx: number) => {
                  return (
                    <div className="txt-value" key={idx}>
                      {val?.name}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="total-price-order">
              <div className="txt-name">Tổng cộng</div>
              <div className="txt-value">
                {dataDetailOrder?.total?.grand_total?.value?.toLocaleString('VI')}{' '}
                {dataDetailOrder?.total?.grand_total?.currency}
              </div>
            </div>

            <div className="box-profile-order">
              <div className="txt-header">THÔNG TIN NGƯỜI NHẬN</div>
              <div className="box-desc">
                <div className="desc-txt">
                  <div className="txt-title">Người nhận hàng</div>
                  <div className="txt-value">
                    {dataDetailOrder?.shipping_address?.lastname}{' '}
                    {dataDetailOrder?.shipping_address?.firstname}
                  </div>
                </div>
                <div className="desc-txt">
                  <div className="txt-title">Số điện thoại</div>
                  <div className="txt-value">{dataDetailOrder?.shipping_address?.telephone}</div>
                </div>
                <div className="desc-txt">
                  <div className="txt-title">Email</div>
                  <div className="txt-value">{dataDetailOrder?.customer_email || ''}</div>
                </div>
              </div>
              <div className="txt-address">
                <div className="txt-title">Địa chỉ</div>
                <div className="txt-value">
                  {dataDetailOrder?.shipping_address?.street?.map((val: any) => {
                    return <>{val}, </>
                  })}
                  {dataDetailOrder?.shipping_address?.ward &&
                    `${dataDetailOrder?.shipping_address?.ward}, `}
                  {dataDetailOrder?.shipping_address?.district &&
                    `${dataDetailOrder?.shipping_address?.district}, `}
                  {dataDetailOrder?.shipping_address?.city &&
                    `${dataDetailOrder?.shipping_address?.city}`}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default React.memo(DetailOrder)
