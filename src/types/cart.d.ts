type AvailablePaymentMethod = {
  code: string,
  title: string,
}

type Cart = {
  id: string,
  uid: string,
  quantity: number,
  prices: {
    discounts:
      | null
      | {
          amount: {
            value: number,
            currency: string,
          },
        }[],
    price: {
      value: number,
      currency: string,
    },
    row_total: {
      value: number,
      currency: string,
    },
  },
  product: {
    sku: string,
    tags: string,
    name: string,
    url_key: string,
    __typename: string,
    new_to_date: string,
    review_count: number,
    stock_status: string,
    new_from_date: string,
    rating_summary: number,
    image: {
      url: string,
      label: string,
      disabled: null | any,
      position: null | any,
    },
    thumbnail: {
      url: string,
    },
    crosssell_products: [] | any,
    attributes: {
      attribute_code: string,
      label: string,
      value: string,
    }[],
  },
  configurable_options: {
    option_label: string,
    value_label: string,
    configurable_product_option_value_uid: string,
  }[],
  configured_variant: {
    __typename: string,
    sku: string,
    image: {
      url: string,
    },
  },
  errors: null | any,
}

type ResCart = {
  id: string,
  email: null | any,
  items: Cart[],
  applied_coupons:
    | null
    | {
        code: string,
      }[],
  available_payment_methods: AvailablePaymentMethod[],
  prices: {
    discounts: [] | any,
    subtotal_excluding_tax: {
      value: number,
      currency: string,
    },
    subtotal_including_tax: {
      value: number,
      currency: string,
    },
    subtotal_with_discount_excluding_tax: {
      value: number,
      currency: string,
    },
    grand_total: {
      value: number,
      currency: string,
    },
  },
  shipping_addresses: {
    uid: string,
    lastname: string,
    firstname: string,
    city: string,
    city_id: number,
    district: string,
    district_id: number,
    ward: string,
    ward_id: number,
    street: string[],
    selected_shipping_method: null | {
      amount: {
        currency: string,
        value: number,
      },
      carrier_code: string,
      carrier_title: string,
      method_code: string,
      method_title: string,
    },
    telephone: string,
  }[],
}
