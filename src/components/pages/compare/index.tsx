/* eslint-disable @next/next/no-img-element */
import Breadcrumb from '@/components/Breadcrumb'
// import EmptyData from '@/components/boxLayout/EmptyData'
import { useQuery } from 'react-query'
import { compareApi } from '@/services'
import LoadingData from '@/components/boxLayout/LoadingData'
import { __getDataLocal, __RemoveSingleItemLocal } from '@/helper/local_helper/localStogare'
import { useSelector } from 'react-redux'
import { RootState } from '@/store'
import { useWindowSize } from '@/hooks/useWindowSize'
import EmptyData from '@/components/boxLayout/EmptyData'
import { CompareBtn } from './btnCompare'

export const ComparePage = () => {
  const { width } = useWindowSize()
  const { cartId = '' } = useSelector((state: RootState) => state.cart)
  const { data: dataCompare, isLoading: LoadingDataCompare } = useQuery({
    queryKey: ['getCompare'],
    queryFn: async () => {
      return await compareApi
        .getCompare({
          uid: __getDataLocal({ key: 'compare-product', type: 'string' }),
        })
        .then((response: any) => {
          if (response?.compareList) {
            let data: any = response?.compareList
            data?.attributes.push({
              code: 'typeBtn',
              label: 'typeBtn',
            })

            let revertItem: any = data?.items?.map((item: any) => {
              const newObj: any = { ...item }

              item.attributes.forEach((attr: any) => {
                newObj[attr.code] = attr.value
              })

              return newObj
            })
            response.compareList.items = revertItem
            return response?.compareList || null
          }
        })
    },
    enabled: !!__getDataLocal({ key: 'compare-product', type: 'string' }),
    staleTime: 30000,
  })

  let labelAttributes: any = {}
  dataCompare?.attributes?.map((attribute: any) => {
    labelAttributes = {
      ...labelAttributes,
      [attribute?.code]: attribute?.label,
    }
  })

  return (
    <div className="home-style3 wrapper-compare">
      <Breadcrumb
        items={[
          {
            title: 'Trang chủ',
            href: '/',
          },
          {
            title: 'So sánh sản phẩm',
            href: '/compare',
          },
        ]}
      />
      <div className="bg-compare">
        {LoadingDataCompare ? (
          <div className="wrapper-loading-layout">
            <LoadingData />
          </div>
        ) : null}
        {dataCompare?.items?.length > 0 ? (
          <div className="bg-compare-wr">
            <div className="wp-bg-compare">
              <table className="compare_list">
                <tbody className="compare_list">
                  <tr className="compare_list_items">
                    <th className="item_label">Tên Sản Phẩm</th>
                    {dataCompare?.items?.map((val: any, idx: number) => {
                      if (!val) return null
                      return (
                        <td className="item_detail" key={idx}>
                          {val?.product?.name}
                        </td>
                      )
                    })}
                  </tr>
                  <tr className="compare_list_items">
                    <th className="item_label">Hình Ảnh</th>
                    {dataCompare?.items?.map((val: any, idx: number) => {
                      if (!val) return null
                      return (
                        <td className="item_detail" key={idx}>
                          <img src={val?.product?.image?.url} alt="img " />
                        </td>
                      )
                    })}
                  </tr>
                  <tr className="compare_list_items">
                    <th className="item_label">Giá</th>
                    {dataCompare?.items?.map((val: any, idx: number) => {
                      if (!val) return null
                      return (
                        <td className="item_detail" key={idx}>
                          {val?.product?.price_range?.maximum_price?.final_price?.value?.toLocaleString(
                            'vi'
                          )}{' '}
                          {val?.product?.price_range?.maximum_price?.final_price?.currency}
                        </td>
                      )
                    })}
                  </tr>
                  <tr className="compare_list_items">
                    <th className="item_label">SKU</th>
                    {dataCompare?.items?.map((val: any, idx: number) => {
                      if (!val) return null
                      return (
                        <td className="item_detail" key={idx}>
                          {val?.sku}
                        </td>
                      )
                    })}
                  </tr>
                  {width > 991 ? (
                    <tr className="compare_list_items">
                      <th className="item_label">Thông số kỹ thuật</th>
                      {dataCompare?.items?.map((val: any, idx: number) => {
                        if (!val) return null
                        return (
                          <td className="item_detail" key={idx}>
                            <table className="table-detail">
                              <tbody>
                                <tr>
                                  <td className="details">
                                    <div className="txt-header">Đặc tính</div>
                                  </td>
                                  <td>
                                    <div className="txt-header">Thông số</div>
                                  </td>
                                </tr>
                                {val?.attributes?.map((value: any, idxKey: number) => {
                                  return (
                                    <tr key={idxKey}>
                                      <td>
                                        <div>{labelAttributes?.[value?.code]}</div>
                                      </td>
                                      <td dangerouslySetInnerHTML={{ __html: value?.value }}></td>
                                    </tr>
                                  )
                                })}
                              </tbody>
                            </table>
                          </td>
                        )
                      })}
                    </tr>
                  ) : (
                    <>
                      <tr className="compare_list_items">
                        <th className="item_label">Mô tả sản phẩm</th>
                        {dataCompare?.items?.map((val: any, idx: number) => {
                          if (!val) return null
                          return (
                            <td
                              className="item_detail"
                              key={idx}
                              dangerouslySetInnerHTML={{ __html: val?.description }}></td>
                          )
                        })}
                      </tr>
                      {dataCompare?.attributes.slice(1, -1)?.map((val_mobile: any) => {
                        return (
                          <tr className="compare_list_items" key={val_mobile?.code}>
                            <th className="item_label">{val_mobile?.label}</th>
                            {dataCompare?.items?.map((val_data: any, idx_data: number) => {
                              if (!val_data) return null
                              return (
                                <td className="item_detail" key={idx_data}>
                                  {val_data[val_mobile?.code]}
                                </td>
                              )
                            })}
                          </tr>
                        )
                      })}
                    </>
                  )}
                  <tr className="compare_list_items">
                    <th className="item_label"></th>
                    {dataCompare?.items?.map((val: any, idx: number) => {
                      if (!val) return null
                      return (
                        <td className="item_detail button-compare-bg" key={idx}>
                          <CompareBtn val={val} cartId={cartId} dataCompare={dataCompare} />
                        </td>
                      )
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-no-data">
            <EmptyData />
            <h5>Không có sản phẩm so sánh</h5>
          </div>
        )}
      </div>
    </div>
  )
}

// const Rating = ({ rate }: any) => {
//   const renderStars = () => {
//     const stars = []
//     for (let i = 1; i <= 5; i++) {
//       stars.push(
//         <i
//           key={i}
//           className="la la-star"
//           style={{ fontSize: '20px', color: i <= rate ? '#ffa500' : '#d8d8d8' }}></i>
//       )
//     }
//     return stars
//   }

//   return (
//     <div className="rating">
//       <div className="stars">{renderStars()}</div>
//     </div>
//   )
// }
