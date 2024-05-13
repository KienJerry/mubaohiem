import { useQuery } from 'react-query'
import orderApi from '@/services/order.queries'
import { useForm } from 'react-hook-form'
import { TextField } from '@/components/inputs/textField'
import { ButtonSubmit } from '@/components/button/btnSubmit'
import { FilterEmpty } from '@/components/filterEmpty'
import { useQueryClient } from 'react-query'
import { useState } from 'react'
import LoadingData from '@/components/boxLayout/LoadingData'
import router from 'next/router'
import Image from 'next/image'
import moment from 'moment'

const MyOrderTab = () => {
  const [fetchLoading, setFetchLoading] = useState(false)

  const queryClient = useQueryClient()
  const { control, handleSubmit, watch } = useForm<any>({
    mode: 'all',
  })

  const { isLoading, data: dataOrder } = useQuery({
    queryKey: ['getOrdersList'],
    queryFn: async () => {
      return await orderApi
        .getHistoryOrder({
          sort: { sort_field: 'CREATED_AT', sort_direction: 'DESC' },
          orderCurrentPage: 1,
          orderPageSize: 20,
          filter: { number: { match: watch('order')?.trim()?.replace(/^#/, '') || '' } },
        })
        .then((response: any) => {
          setFetchLoading(false)
          return response?.customer?.orders
        })
        .catch(() => {})
    },
    staleTime: 30000,
  })

  const onSubmitHandler = handleSubmit(async () => {
    setFetchLoading(true)
    await queryClient.invalidateQueries(['getOrdersList'])
  })

  const handleDirectDetail = (value: any) => {
    router.push(`/profile/?tab=detailOrder&number=${value?.number}`)
  }

  return (
    <div className="orders-tab">
      <h4 className="fw-bold text-capitalize mb-title"> Lịch sử đơn hàng </h4>
      <form onSubmit={onSubmitHandler} className="content">
        <div className="row">
          <div className="col-lg-12">
            <TextField
              name="order"
              type="text"
              placeholder="Nhập mã đơn hàng"
              nameLabel="Nhập mã đơn hàng của bạn"
              control={control}
            />
          </div>
          <div className="col-lg-6">
            <TextField
              name="fromdate"
              type="date"
              placeholder="Chọn ngày bắt đầu"
              nameLabel="Từ ngày"
              control={control}
            />
          </div>
          <div className="col-lg-6">
            <TextField
              name="todate"
              type="date"
              placeholder="Chọn ngày kết thúc"
              nameLabel="Đến ngày"
              control={control}
            />
          </div>
          <div className="col-lg-12">
            <ButtonSubmit
              type="submit"
              className="butn bg-green2 text-white radius-4 fw-500 fsz-12 text-uppercase text-center mt-20 py-3 px-5"
              style={{
                border: 'none',
              }}
              classN="margin-none"
              title="Tra đơn hàng"
              loading={fetchLoading}
            />

            {/* <button
                  onClick={() => handleDirectDetail(1)}
                  style={{
                    border: 'none',
                  }}
                  className={`butn bg-green2 text-white radius-4 fw-500 fsz-14 text-uppercase text-center mt-40 px-5 `}>
                  {' '}
                  <span> Xem trang chi tiết (Demo UI) </span>{' '}
                </button> */}
          </div>
        </div>
      </form>
      <div className="orders">
        {isLoading ? (
          <LoadingData />
        ) : dataOrder?.items?.length > 0 ? (
          dataOrder?.items?.map((val: any, idx: number) => {
            let statusOrder = ''
            switch (val?.state) {
              case 'closed':
              case 'canceled':
                statusOrder = 'cancel'
                break
              case 'complete':
                statusOrder = 'success'
                break
              default:
              // statusOrder = 'cancel'
            }
            return (
              <div key={idx} className="order-card" style={{ cursor: 'pointer' }}>
                <div
                  className={`order-head ${statusOrder}`}
                  onClick={() => handleDirectDetail(val)}>
                  <div className="row align-items-center">
                    <div className="col-lg-6 info-prod">
                      <p className="info-prod-time">
                        <span> NUM: </span> <strong> #{val?.number} </strong>
                      </p>
                      <p className="info-prod-date mb-0">
                        <span> DATE: </span>{' '}
                        <span>{moment(val?.order_date).format('DD/MM/YYYY hh:mm:ss')} </span>
                      </p>
                    </div>
                    <div className="col-lg-6 text-lg-end mt-lg-0 info-prod-status">
                      <span
                        className={`alert mb-0 py-2 ${
                          statusOrder == 'cancel'
                            ? 'txt-status-cancel'
                            : statusOrder == 'success'
                            ? 'txt-status-success'
                            : 'txt-status-pending'
                        }`}
                        role="alert">
                        {val?.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="products">
                  <div className="row gx-3">
                    {val?.items?.map((value: any, index: number) => {
                      return (
                        <div
                          onClick={() => router.push(`/products/${value?.product_url_key}`)}
                          className="col-lg-12 prod-item"
                          key={index}>
                          <div className="product-card">
                            {/* <div className="top-inf">
                                  <small className="fsz-10 py-1 px-2 radius-2 bg-222 text-white text-uppercase">
                                    new
                                  </small>
                                </div> */}
                            <a href="#0" className="img">
                              <Image
                                fill
                                src={
                                  value?.product_image || '/assets/images/inner/products/prod65.png'
                                }
                                alt={value?.product_name}
                                className="img-contain main-image"
                              />
                            </a>
                            <div className="info">
                              {/* <div className="rating">
                                    <div className="stars">
                                      <i className="la la-star"></i>
                                      <i className="la la-star"></i>
                                      <i className="la la-star"></i>
                                      <i className="la la-star"></i>
                                      <i className="la la-star color-999"></i>
                                    </div>
                                    <span className="num"> (5) </span>
                                  </div> */}
                              <h6 className="prod-title">
                                <a href="#" className="fsz-14 fw-bold hover-green2">
                                  {value?.product_sku}
                                </a>
                              </h6>
                              <div className="prod-info">
                                <div className="price ">
                                  <h5 className="fsz-18 fw-600">
                                    {' '}
                                    {value?.product_sale_price?.value?.toLocaleString('VI')}{' '}
                                    {value?.product_sale_price?.currency}{' '}
                                  </h5>
                                </div>
                                <div>Số lượng: {value?.quantity_ordered}</div>
                              </div>

                              <div className="meta">
                                <a href="#" className="meta-item color-green2">
                                  free shipping <span className="bg bg-green2"></span>
                                </a>
                                <a href="#" className="meta-item color-red1">
                                  free gift <span className="bg bg-red1"></span>
                                </a>
                                {value?.discounts?.map((val: any, index: number) => {
                                  return (
                                    <a className="meta-item color-green2 cls-cursor" key={index}>
                                      Voucher: {val?.amount?.value?.toLocaleString('VI')}{' '}
                                      {val?.amount?.currency} <span className="bg bg-red1"></span>
                                    </a>
                                  )
                                })}
                              </div>
                              <p className="fsz-12 in-stock">
                                <i className="fas fa-check-circle color-green2 me-1"></i> Còn hàng
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <FilterEmpty />
        )}
      </div>
    </div>
  )
}

export default MyOrderTab
