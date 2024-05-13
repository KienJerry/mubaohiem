import { gql } from 'graphql-request'

export const SET_SHIPPING_ADDRESS = gql`
  mutation setShippingAddress(
    $setShippingAddressesOnCartInput: SetShippingAddressesOnCartInput
    $setBillingAddressOnCartInput: SetBillingAddressOnCartInput
  ) {
    setShippingAddressesOnCart(input: $setShippingAddressesOnCartInput) {
      cart {
        ...CartFields
        shipping_addresses {
          available_shipping_methods {
            amount {
              currency
              value
            }
            available
            carrier_code
            carrier_title
            error_message
            method_code
            method_title
          }
          city
          district
          ward
          city_id
          district_id
          ward_id
          lastname
          firstname
          street

          selected_shipping_method {
            amount {
              currency
              value
            }
            carrier_code
            carrier_title
            method_code
            method_title
          }
          telephone
          uid
        }
      }
    }
    setBillingAddressOnCart(input: $setBillingAddressOnCartInput) {
      cart {
        ...CartFields
      }
    }
  }
  fragment CartFields on Cart {
    is_virtual
    id
    email
  }
`

export const SET_SHIPPING_METHODS_ON_CART = gql`
  mutation setShippingMethodsOnCart($setShippingMethodsOnCartInput: SetShippingMethodsOnCartInput) {
    setShippingMethodsOnCart(input: $setShippingMethodsOnCartInput) {
      cart {
        id
        email
        is_virtual
        shipping_addresses {
          selected_shipping_method {
            amount {
              currency
              value
            }
            carrier_code
            carrier_title
            method_code
            method_title
          }
        }
      }
    }
  }
`

export const SET_PAYMENT_METHOD_ON_CART_AND_PLACE_ORDER = gql`
  mutation setPaymentMethodOnCartAndPlaceOrder(
    $setPaymentMethodOnCartInput: SetPaymentMethodOnCartInput
    $placeOrderInput: PlaceOrderInput
  ) {
    setPaymentMethodOnCart(input: $setPaymentMethodOnCartInput) {
      cart {
        selected_payment_method {
          code
          purchase_order_number
          title
        }
      }
    }
    placeOrder(input: $placeOrderInput) {
      order {
        order_number
        paymentOnline {
          app_link
          deeplink
          deeplink_mini_app
          qr_code_url
          type
          url_pay
        }
      }
      customer {
        error_message
        customer_token
      }
    }
    createEmptyCart
  }
`

export const IS_EMAIL_AVAILABLE = gql`
  query isEmailAvailable($email: String!) {
    isEmailAvailable(email: $email) {
      is_email_available
    }
  }
`
