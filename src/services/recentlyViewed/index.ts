import { graphQLClient } from '../graphql'
import { VariableGetRecentlyView, VariableSetRecentlyView } from './recentlyViewed.type'
import { GET_RECENT_VIEWED_PRODUCTS, RECENT_VIEWED_PRODUCTS } from './recentlyViewed.queries'

const handleSetRecentlyViewed = async (variable: VariableSetRecentlyView) => {
  try {
    return await graphQLClient.request(RECENT_VIEWED_PRODUCTS, variable)
  } catch (error) {
    console.error('Error set recently viewed: ', error)
    return undefined
  }
}

const handleGetRecentlyViewed = async (variable: VariableGetRecentlyView) => {
  try {
    return await graphQLClient.request(GET_RECENT_VIEWED_PRODUCTS, variable)
  } catch (error) {
    console.error('Error get recently viewed: ', error)
    return undefined
  }
}

const recentlyViewedApi = {
  get: handleGetRecentlyViewed,
  set: handleSetRecentlyViewed,
}

export default recentlyViewedApi
