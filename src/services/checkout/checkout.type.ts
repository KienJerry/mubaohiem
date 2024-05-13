export type VariableSetShippingNotAddress = {
  setShippingAddressesOnCartInput: {
    cart_id: string,
    shipping_addresses: {
      customer_notes?: string,
      address: {
        country_code: string,
        company?: string,
        lastname: string,
        firstname?: string,
        postcode: string,
        street: string[],
        telephone: string,
        save_in_address_book: boolean,
        city: string,
        custom_attributes: {
          attribute_code: string,
          value: string,
        }[],
      },
    }[],
  },
  setBillingAddressOnCartInput: {
    cart_id: string,
    billing_address: {
      same_as_shipping: boolean,
    },
  },
}

export type VariableSetShippingHaveAddress = {
  setShippingAddressesOnCartInput: {
    cart_id: string,
    shipping_addresses: Array<{
      customer_notes?: string,
      customer_address_id: number,
    }>,
  },
  setBillingAddressOnCartInput: {
    cart_id: string,
    billing_address: {
      same_as_shipping: boolean,
    },
  },
}

export type VariableSetShippingAddress =
  | VariableSetShippingNotAddress
  | VariableSetShippingHaveAddress

export type VariableSetPaymentAndPlaceOrder = {
  setPaymentMethodOnCartInput: {
    cart_id: string,
    payment_method: {
      code: string,
    },
  },
  placeOrderInput: {
    cart_id: string,
    create_customer: boolean,
  },
}

export type VariableSetShippingMethods = {
  setShippingMethodsOnCartInput: {
    cart_id: string,
    shipping_methods: {
      carrier_code: string,
      method_code: string,
    }[],
  },
}

export type VariableSetPaymentMethodAndPlaceOrder = {
  setPaymentMethodOnCartInput: {
    cart_id: string,
    payment_method: {
      code: string,
    },
  },
  placeOrderInput: {
    cart_id: string,
    create_customer: boolean,
  },
}
