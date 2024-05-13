import { graphQLClient } from '../graphql'
import {
  IS_EMAIL_AVAILABLE,
  SET_PAYMENT_METHOD_ON_CART_AND_PLACE_ORDER,
  SET_SHIPPING_ADDRESS,
  SET_SHIPPING_METHODS_ON_CART,
} from './checkout.queries'
import {
  VariableSetShippingMethods,
  VariableSetPaymentMethodAndPlaceOrder,
  VariableSetShippingAddress,
} from './checkout.type'

const handleSetShippingAddress = async (variable: VariableSetShippingAddress) => {
  try {
    return await graphQLClient.request(SET_SHIPPING_ADDRESS, variable as any)
  } catch (error) {
    console.error('Error set shipping address: ', error)
    return undefined;
  }
}

const handleSetMethodsShipping = async (variable: VariableSetShippingMethods) => {
  try {
    return await graphQLClient.request(SET_SHIPPING_METHODS_ON_CART, variable)
  } catch (error) {
    console.error('Error set shipping methods: ', error)
    return undefined;
  }
}

const handleSetPaymentMethodAndPlaceOrder = async (
  variable: VariableSetPaymentMethodAndPlaceOrder
) => {
  try {
    return await graphQLClient.request(SET_PAYMENT_METHOD_ON_CART_AND_PLACE_ORDER, variable)
  } catch (error) {
    console.error('Error set payment method and place order: ', error)
    return undefined;
  }
}

const handleCheckIsEmailAvailable = async (email: string) => {
  try {
    return await graphQLClient.request(IS_EMAIL_AVAILABLE, {
      email: email
    } )
  } catch (error) {
    console.error('Error check email: ', error)
    return undefined;
  }
}

const checkoutApi = {
  getShippingMethods: handleSetShippingAddress,
  setShippingMethods: handleSetMethodsShipping,
  checkout: handleSetPaymentMethodAndPlaceOrder,
  checkEmailHaveAccount: handleCheckIsEmailAvailable,
}

export default checkoutApi
