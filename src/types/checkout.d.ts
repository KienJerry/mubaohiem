type AvailableShippingMethod = {
  amount: {
    currency: string,
    value: number,
  },
  available: boolean,
  carrier_code: string,
  carrier_title: string,
  error_message: string,
  method_code: string,
  method_title: string,
}

type ShippingAddress = {
  available_shipping_methods: AvailableShippingMethod[],
  city: string,
  district: string,
  ward: string,
  city_id: number,
  district_id: number,
  ward_id: number,
  lastname: string,
  firstname: string,
  street: string[],
  selected_shipping_method: null,
  telephone: string,
  uid: string,
}

type ShippingMethods = {
  setShippingAddressesOnCart: {
    cart: {
      is_virtual: boolean,
      id: string,
      email: string,
      shipping_addresses: ShippingAddress[],
    },
  },
  setBillingAddressOnCart: {
    cart: {
      is_virtual: boolean,
      id: string,
      email: string,
    },
  },
}

type PlaceOrderCustomer = null | {
  error_message: any,
  customer_token: string,
}

type OrderCheckout = {
  order_number: string,
  paymentOnline: null | {
    type: string,
    app_link: null | string,
    deeplink: null | string,
    deeplink_mini_app: null | string,
    qr_code_url: null | any,
    url_pay: string,
  },
}

type ResSetPaymentMethodAndPlaceOrder = {
  setPaymentMethodOnCart: {
    cart: {
      selected_payment_method: {
        code: string,
        purchase_order_number: null | string,
        title: string,
      },
    },
  },
  placeOrder: {
    order: OrderCheckout,
    customer: PlaceOrderCustomer,
  },
  createEmptyCart: string,
}
