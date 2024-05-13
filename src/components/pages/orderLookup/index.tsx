import Breadcrumb from '@/components/Breadcrumb'
import { TextField } from '@/components/inputs/textField'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import * as Yup from 'yup'
import { ButtonSubmit } from '@/components/button/btnSubmit'
import { useQuery } from 'react-query'
import orderApi from '@/services/order.queries'
import { useRouter } from 'next/router'
import { Steps } from 'antd'
import moment from 'moment'
import Image from 'next/image'

export const OrderLookupPage = () => {
  const router = useRouter()
  const { control, handleSubmit, watch, reset } = useForm<any>({
    mode: 'all',
    defaultValues: {
      orderId: '',
    },
    resolver: yupResolver(schemaValidate),
  })

  const {
    isFetching: isLoadingTrackingOrder,
    data: dataTrackingOrder,
    refetch: refetchTrackingOrder,
  }: any = useQuery({
    queryKey: ['trackingOrder'],
    queryFn: async () => {
      return await orderApi
        .trackingOrder({
          orderId: watch('orderId')?.trim()?.replace(/^#/, ''),
          emailOrPhone: watch('emailOrPhone'),
        })
        .then((response: any) => {
          if (!!response?.trackingOrder?.order) {
            reset()
            const element = document?.getElementById('emailOrPhone')
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
            return response?.trackingOrder?.order || null
          }
          return null
        })
    },
    enabled: false,
  })

  const onSubmitHandler = handleSubmit(() => {
    refetchTrackingOrder()
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

  const stateOrder = (status: string) => {
    switch (status) {
      case 'new':
        return 0
      case 'holded':
      case 'processing':
        return 1
      case 'complete':
        return 2
      case 'closed':
      case 'canceled':
        return 3
      default:
        return 4
    }
  }

  return (
    <div className="home-style3 wrapper-order-lookup">
      <Breadcrumb
        items={[
          {
            title: 'Trang chủ',
            href: '/',
          },
          {
            title: 'Tra cứu hành trình đơn hàng',
            href: '/order-lookup',
          },
        ]}
      />

      <div className="ctn-order">
        <div className="ctn-form-order-lookup">
          <form onSubmit={onSubmitHandler} className="form d-block">
            <TextField
              required
              name="orderId"
              type="text"
              placeholder="Mã đơn hàng"
              nameLabel="Nhập mã đơn hàng"
              control={control}
              disabled={isLoadingTrackingOrder}
            />
            <TextField
              required
              name="emailOrPhone"
              type="text"
              placeholder="Nhập email hoặc số điện thoại cần tra cứu"
              nameLabel="Nhập email hoặc Số điện thoại"
              control={control}
              disabled={isLoadingTrackingOrder}
            />
            <div className="btns" id="ORDER_LOOKUP">
              <ButtonSubmit
                type="submit"
                style={{ border: 'none' }}
                title="Tra cứu ngay"
                icon={
                  <i className="fa-solid fa-arrow-right-long" style={{ marginLeft: '4px' }}></i>
                }
                mt={4}
                loading={isLoadingTrackingOrder}
              />
            </div>
          </form>
        </div>

        {dataTrackingOrder && (
          <div className="wrapper-detail-order" id="ORDER_LOOKUP">
            <div className="line"></div>
            <h4 className="fw-bold text-capitalize mb-30 title-header-detail-order" style={{ marginBottom: '16px' }}>
              {' '}
              Chi tiết đơn hàng{' '}
            </h4>
            <div className="wrapper-steps">
              <div className="bg-steps">
                <Steps
                  current={stateOrder(dataTrackingOrder?.state)}
                  items={[
                    {
                      title: 'Mới nhận',
                      icon:
                        stateOrder(dataTrackingOrder?.state) > 0 ? null : (
                          <i className="fa fa-box-open"></i>
                        ),
                    },
                    {
                      title: 'Đã xử lý',
                      icon:
                        stateOrder(dataTrackingOrder?.state) > 1 ? null : (
                          <i className="fa-solid fa-box"></i>
                        ),
                    },
                    {
                      title: 'Đã giao',
                      icon:
                        stateOrder(dataTrackingOrder?.state) > 2 ? null : (
                          <i className="fa-solid fa-people-carry-box"></i>
                        ),
                    },
                    {
                      title: 'Hủy',
                      icon:
                        stateOrder(dataTrackingOrder?.state) > 3 ? null : (
                          <i className="fa-solid fa-person-circle-xmark"></i>
                        ),
                    },
                  ]}
                />
              </div>
            </div>
            <div className="div-list-history">
              <div className="child-items">
                <div className="txt-name">Mã đơn hàng:</div>
                <div className="txt-value">#{dataTrackingOrder?.increment_id}</div>
              </div>
              <div className="child-items">
                <div className="txt-name">Ngày đặt hàng:</div>
                <div className="txt-value">
                  {moment(dataTrackingOrder?.order_date).format('DD/MM/YYYY hh:mm:ss')}
                </div>
              </div>
              <div className="child-items">
                <div className="txt-name">Phương thức thanh toán:</div>
                {dataTrackingOrder?.payment_methods?.map((val: any, idx: number) => {
                  return (
                    <div className="txt-value" key={idx}>
                      {val?.name}
                    </div>
                  )
                })}
              </div>
              <div className="child-items">
                <div className="txt-name">Tình trạng:</div>
                <div className={`txt-value ${statusOrder(dataTrackingOrder?.state)}`}>
                  {dataTrackingOrder?.status}
                </div>
              </div>
              {dataTrackingOrder?.comments && (
                <div className="child-items">
                  <div className="txt-name">Lưu ý đơn hàng:</div>
                  <div className="txt-value">{dataTrackingOrder?.comments}</div>
                </div>
              )}
            </div>
            <div className="desc-items">
              <div className="txt-desc-h">THÔNG TIN ĐƠN HÀNG</div>

              <div className="d-list-order-items">
                {dataTrackingOrder?.products?.map((val: any, idx: number) => {
                  return (
                    <div
                      style={{ cursor: 'pointer' }}
                      className="child-item"
                      key={idx}
                      onClick={() => router.push(`/products/${val?.product_url_key}`)}>
                      <Image
                        fill
                        src={`${val?.product_image || '/assets/images/products/prod11.png'}`}
                        alt={`Order img`}
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

              <div className="total-price-order tracking">
                <div className="txt-name">Tổng cộng:</div>
                <div className="txt-value">
                  {dataTrackingOrder?.total?.grand_total?.value?.toLocaleString('VI')}{' '}
                  {dataTrackingOrder?.total?.grand_total?.currency}
                </div>
              </div>

              <div className="box-profile-order tracking">
                <div className="txt-header">THÔNG TIN NGƯỜI NHẬN</div>
                <div className="box-desc">
                  <div className="desc-txt">
                    <div className="txt-title">Người nhận hàng</div>
                    <div className="txt-value">
                      {dataTrackingOrder?.shipping_address?.lastname}{' '}
                      {dataTrackingOrder?.shipping_address?.firstname}
                    </div>
                  </div>
                  <div className="desc-txt">
                    <div className="txt-title">Số điện thoại</div>
                    <div className="txt-value">
                      {dataTrackingOrder?.shipping_address?.telephone}
                    </div>
                  </div>
                  <div className="desc-txt">
                    <div className="txt-title">Email</div>
                    <div className="txt-value">{dataTrackingOrder?.customer_email}</div>
                  </div>
                </div>
                <div className="txt-address">
                  <div className="txt-title">Địa chỉ</div>
                  <div className="txt-value">
                    {dataTrackingOrder?.shipping_address?.street?.map((val: any) => {
                      return <>{val}, </>
                    })}
                    {dataTrackingOrder?.shipping_address?.ward &&
                      `${dataTrackingOrder?.shipping_address?.ward}, `}
                    {dataTrackingOrder?.shipping_address?.district &&
                      `${dataTrackingOrder?.shipping_address?.district}, `}
                    {dataTrackingOrder?.shipping_address?.city &&
                      `${dataTrackingOrder?.shipping_address?.city}`}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const schemaValidate: Yup.ObjectSchema<any> = Yup.object().shape({
  orderId: Yup.string().required('Trường này không được bỏ trống'),
  emailOrPhone: Yup.string()
    .required('Trường này không được bỏ trống')
    .matches(
      /^([a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+|0\d{9})$/,
      'Email hoặc số điện thoại không đúng định dạng'
    ),
})
