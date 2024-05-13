import { GETTOKEN } from '@/services/graphql'
import recentlyViewedApi from '@/services/recentlyViewed'
import { VariableSetRecentlyView } from '@/services/recentlyViewed/recentlyViewed.type'
import { useMutation, useQuery } from 'react-query'

const useRecentViewedProducts = () => {
  const recentlyViewedJSON =
    typeof window !== 'undefined' ? localStorage?.getItem('recentlyViewed') : false
  const recentlyViewed: Product[] = recentlyViewedJSON ? JSON?.parse(recentlyViewedJSON) : []

  const accessToken = GETTOKEN.tokenAuth()

  const decodeBase64 = (str: string): string => {
    return Buffer?.from(str, 'base64')?.toString('utf-8')
  }

  const getProductsNotUpdateToList = (arr1: any[], arr2: any[]): any[] => {
    return arr1.filter((item1) => arr2.every((item2) => item1?.uid !== item2?.uid))
  }

  const { mutate: mutateSetProductRecentlyView } = useMutation({
    mutationFn: async (variable: VariableSetRecentlyView) => {
      return await recentlyViewedApi.set(variable)
    },
    onSuccess: (data: any) => {
      if (data?.recentViewedProducts === null) return data

      return data
    },
  })

  const listProductId = recentlyViewed?.map((product) => decodeBase64(product?.uid))

  const { data: recentlyViewedProducts } = useQuery({
    queryKey: ['GET_RECENTLY_VIEWED_PRODUCTS'],
    queryFn: async () => {
      return await recentlyViewedApi
        .get({
          currentPage: 1,
          pageSize: 20,
        })
        .then((response: any) => response?.recentViewedProducts)
    },
    onSuccess: (data) => {
      const listProductNotUpdate = getProductsNotUpdateToList(recentlyViewed, data?.items)
      if (listProductNotUpdate?.length === 0) return data

      // const _listProductId = listProductNotUpdate?.map((product) =>
      //   Number(decodeBase64(product?.uid))
      // )
      // mutateSetProductRecentlyView({
      //   product_ids: _listProductId,
      // })
    },
    staleTime: 30000,
    enabled: !!accessToken,
  })

  const handleSetProductRecentlyView = (variable: VariableSetRecentlyView) => {
    mutateSetProductRecentlyView(variable)
  }

  console.log({ recentlyViewedProducts, listProductId })

  return {
    recentlyViewed: !!accessToken ? recentlyViewedProducts?.items : recentlyViewed,
    setProductRecentlyView: handleSetProductRecentlyView,
  }
}

export default useRecentViewedProducts
