import { gql } from 'graphql-request'
import { graphQLClient } from './graphql'

export const getListPromotion = gql`
  query getListPromotion {
    cartPriceRule {
      items {
        code
        coupon_type
        currency
        description
        discount_amount
        from_date
        is_active
        max_discount
        name
        promotion_image
        rule_id
        simple_action
        to_date
        uses_per_customer
      }
      total_count
    }
  }
`

export const applyCouponToCart = gql`
  mutation applyCouponToCart($cart_id: String!, $coupon_code: String!) {
    applyCouponToCart(input: { cart_id: $cart_id, coupon_code: $coupon_code }) {
      cart {
        items {
          product {
            sku
            name
          }
          quantity
        }
        applied_coupons {
          code
        }
        prices {
          grand_total {
            value
            currency
          }
        }
      }
    }
  }
`

export const removeCouponFromCart = gql`
  mutation removeCouponFromCart($input: RemoveCouponFromCartInput) {
    removeCouponFromCart(input: $input) {
      cart {
        id
        is_virtual
        total_quantity
      }
    }
  }
`

const handleGetListPromotion = async () => {
  try {
    return await graphQLClient.request(getListPromotion)
  } catch (error) {
    console.error('Error get list promotion: ', error)
    return undefined
  }
}

const handleApplyCouponToCart = async (variable: { cart_id: string, coupon_code: string }) => {
  try {
    return await graphQLClient.request(applyCouponToCart, variable)
  } catch (error) {
    console.error('Error apply promotion: ', error)
    return undefined
  }
}

const handleRemoveCouponFromCart = async (cartId: string) => {
  try {
    return await graphQLClient.request(removeCouponFromCart, {
      input: {
        cart_id: cartId,
      },
    })
  } catch (error) {
    console.error('Error remove promotion: ', error)
    return undefined
  }
}

const promotionAPI = {
  getList: handleGetListPromotion,
  apply: handleApplyCouponToCart,
  remove: handleRemoveCouponFromCart,
}

export default promotionAPI
