/* eslint-disable @next/next/no-img-element */
import homeApi from '@/services/home'
import { useQuery } from 'react-query'

const ListCardPayment = () => {
  const { data: dataMenu } = useQuery({
    queryKey: ['getMenu', 'payments'],
    queryFn: async () => {
      return await homeApi
        .getMenu({
          identifiers: ['payments'],
        })
        .then((response: any) => {
          return response?.snowdogMenus?.items?.[0]
        })
    },
    staleTime: 30000,
  })

  if (!dataMenu?.nodes?.items) return null
  return (
    <div>
      <small className="fsz-12 color-000 mb-2 mt-3"> Đảm bảo thanh toán an toàn </small>
      <div className="pay-logos mt-1">
        {dataMenu?.nodes?.items?.map((item: any) => {
          return <img src={item?.image} alt="" width={42} key={item?.menu_id} className="me-1" />
        })}
      </div>
    </div>
  )
}

export default ListCardPayment
