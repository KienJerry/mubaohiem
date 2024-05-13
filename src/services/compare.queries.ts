import { gql } from 'graphql-request'
import { graphQLClient } from './graphql'
import { __RemoveItemLocal } from '@/helper/local_helper/localStogare'

export const CREATE_COMPARE_QUERIES = gql`
  mutation createCompareList($input: CreateCompareListInput) {
    createCompareList(input: $input) {
      uid
    }
  }
`

export const ADD_COMPARE_QUERIES = gql`
  mutation addProductsToCompareList($input: AddProductsToCompareListInput) {
    addProductsToCompareList(input: $input) {
      item_count
      uid
    }
  }
`

export const GET_COMPARE_QUERIES = gql`
  query compareList($uid: ID!) {
    compareList(uid: $uid) {
      attributes {
        code
        label
      }
      item_count
      uid
      items {
        attributes {
          code
          value
        }
        uid
        product {
          name
          attributes {
            attribute_code
            label
            value
          }
          image {
            ...ProductImageFields
          }
          thumbnail {
            ...ProductImageFields
          }
          daily_sale {
            end_date
            entity_id
            product_id
            start_date
            sold_qty
            sale_qty
            sale_price
          }
          new_from_date
          new_to_date
          price_range {
            maximum_price {
              discount {
                amount_off
                percent_off
              }
              final_price {
                ...MoneyFields
              }
              regular_price {
                ...MoneyFields
              }
            }
          }
        }
      }
    }
  }
  fragment ProductImageFields on ProductImage {
    disabled
    label
    url
    position
  }
  fragment MoneyFields on Money {
    currency
    value
  }
`

export const REMOVE_ITEM_QUERIES = gql`
  mutation removeProductsFromCompareList($input: RemoveProductsFromCompareListInput) {
    removeProductsFromCompareList(input: $input) {
      item_count
      uid
    }
  }
`

export const ASSIGN_COMPARE_LIST_TO_CUSTOMER_QUERIES = gql`
  mutation assignCompareListToCustomer($uid: ID!) {
    assignCompareListToCustomer(uid: $uid) {
      result
      compare_list {
        item_count
        uid
      }
    }
  }
`

const handleCreateCompare = async (variable: any) => {
  try {
    return await graphQLClient.request(CREATE_COMPARE_QUERIES, variable)
  } catch (error) {
    console.error('Error get handleCreateCompare: ', error)
  }
}

const handleAddCompare = async (variable: any) => {
  try {
    return await graphQLClient.request(ADD_COMPARE_QUERIES, variable)
  } catch (error) {
    console.error('Error get handleAddCompare: ', error)
  }
}

const handleGetCompare = async (variable: any) => {
  try {
    const res: any = await graphQLClient.request(GET_COMPARE_QUERIES, variable)
    if (res?.compareList == null) {
      __RemoveItemLocal({ key: 'compare-product' })
    }
    return res
  } catch (error) {
    console.error('Error get handleGetCompare: ', error)
  }
}

const handleRemoveItemCompare = async (variable: any) => {
  try {
    return await graphQLClient.request(REMOVE_ITEM_QUERIES, variable)
  } catch (error) {
    console.error('Error get handleRemoveItemCompare: ', error)
  }
}

const handleAssignCompareToCustomer = async (variable: any) => {
  try {
    return await graphQLClient.request(ASSIGN_COMPARE_LIST_TO_CUSTOMER_QUERIES, variable)
  } catch (error) {
    console.error('Error get handleAssignCompareToCustomer: ', error)
  }
}

export const compareApi = {
  createCompare: handleCreateCompare,
  getCompare: handleGetCompare,
  addCompare: handleAddCompare,
  removeItemCompare: handleRemoveItemCompare,
  assignCompareToCustomer: handleAssignCompareToCustomer,
}

export default compareApi
