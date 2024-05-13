import { gql } from 'graphql-request'
import { graphQLClient } from './graphql'

export const HISTORY_ORDER_QUERIES = gql`
  query inforCustomer(
    $sort: CustomerOrderSortInput
    $orderCurrentPage: Int
    $orderPageSize: Int
    $filter: CustomerOrdersFilterInput
  ) {
    customer {
      orders(
        filter: $filter
        sort: $sort
        currentPage: $orderCurrentPage
        pageSize: $orderPageSize
      ) {
        total_count
        page_info {
          current_page
          page_size
          total_pages
        }
        items {
          order_date
          id
          number
          comments {
            ...SalesCommentItemFields
          }
          invoices {
            id
            number
            comments {
              timestamp
              ...SalesCommentItemFields
            }
            items {
              id
              product_sale_price {
                ...MoneyFields
              }
              discounts {
                amount {
                  ...MoneyFields
                }
                ...DiscountFields
              }
              product_name
              product_sku
              quantity_invoiced
            }
          }
          items {
            gift_message {
              message
            }
            discounts {
              amount {
                currency
                value
              }
              label
            }
            entered_options {
              label
              value
            }
            product_type
            quantity_shipped
            quantity_canceled
            quantity_invoiced
            quantity_refunded
            quantity_returned
            selected_options {
              label
              value
            }
            status
            id
            product_sku
            product_image
            product_name
            quantity_ordered
            product_url_key
            product_sale_price {
              ...MoneyFields
            }
          }
          carrier
          status
          state
          total {
            grand_total {
              ...MoneyFields
            }
            base_grand_total {
              ...MoneyFields
            }
            total_shipping {
              ...MoneyFields
            }
            discounts {
              amount {
                ...MoneyFields
              }
              ...DiscountFields
            }
            subtotal {
              ...MoneyFields
            }
          }
          shipping_method
        }
      }
    }
  }
  fragment MoneyFields on Money {
    value
    currency
  }
  fragment SalesCommentItemFields on SalesCommentItem {
    message
  }
  fragment DiscountFields on Discount {
    label
  }
`

export const HISTORY_DETAIL_ORDER_QUERIES = gql`
  query OrderDetailCustomer($orderId: String!) {
    orderDetailCustomer(orderId: $orderId) {
      comments {
        message
      }
      customer_email
      created_at
      gift_message {
        from
        message
        to
      }
      grand_total
      id
      increment_id
      items {
        gift_message {
          message
        }
        discounts {
          amount {
            currency
            value
          }
          label
        }
        entered_options {
          label
          value
        }
        id
        product_image
        product_name
        product_sale_price {
          currency
          value
        }
        product_sku
        product_type
        product_url_key
        quantity_ordered
        quantity_shipped
        quantity_canceled
        quantity_invoiced
        quantity_refunded
        quantity_returned
        selected_options {
          label
          value
        }
        status
      }
      number
      order_date
      order_number
      payment_methods {
        # additional_data
        name
        type
      }
      shipping_address {
        city
        city_id
        company
        country_code
        district
        district_id
        fax
        firstname
        lastname
        middlename
        postcode
        prefix
        region
        region_id
        street
        suffix
        telephone
        vat_id
        ward
        ward_id
      }
      shipping_method
      state
      status
      total {
        discounts {
          label
          amount {
            currency
            value
          }
        }
        grand_total {
          currency
          value
        }
        subtotal {
          currency
          value
        }
        total_shipping {
          currency
          value
        }
        total_tax {
          currency
          value
        }
      }
    }
  }
`

export const TRACKING_ORDER_QUERIES = gql`
  query GetTrackingOrder($orderId: String!, $emailOrPhone: String!) {
    trackingOrder(orderId: $orderId, emailOrPhone: $emailOrPhone) {
      order {
        comments {
          message
        }
        state
        status
        customer_email
        increment_id
        shipping_method
        total {
          base_grand_total {
            currency
            value
          }
          discounts {
            amount {
              currency
              value
            }
            label
          }
          grand_total {
            currency
            value
          }
          shipping_handling {
            amount_excluding_tax {
              currency
              value
            }
            amount_including_tax {
              currency
              value
            }
            discounts {
              amount {
                currency
                value
              }
            }

            total_amount {
              currency
              value
            }
          }
          subtotal {
            currency
            value
          }
          taxes {
            amount {
              currency
              value
            }
            rate
            title
          }
          total_shipping {
            currency
            value
          }
          total_tax {
            currency
            value
          }
        }
        products {
          discounts {
            amount {
              ...MoneyFields
            }
            label
          }
          product_name
          product_sale_price {
            ...MoneyFields
          }
          status
          quantity_invoiced
          quantity_canceled
          quantity_shipped
          quantity_ordered
          product_url_key
          product_image
          product_sku
          product_sku_parent
          product_type
        }
        payment_methods {
          additional_data {
            name
            value
          }
          name
          type
        }
        order_date
        shipping_address {
          ...OrderAddressFields
        }
      }
    }
  }
  fragment OrderAddressFields on OrderAddress {
    city
    city_id
    company
    country_code
    district
    district_id
    fax
    firstname
    lastname
    middlename
    postcode
    prefix
    region
    region_id
    street
    suffix
    telephone
    vat_id
    ward
    ward_id
  }
  fragment MoneyFields on Money {
    currency
    value
  }
`

const handleHistoryOrder = async (variable: any) => {
  try {
    return await graphQLClient.request(HISTORY_ORDER_QUERIES, variable)
  } catch (error) {
    console.error('Error get handleHistoryOrder: ', error)
  }
}

const handleHistoryDetailOrder = async (variable: any) => {
  try {
    return await graphQLClient.request(HISTORY_DETAIL_ORDER_QUERIES, variable)
  } catch (error) {
    console.error('Error get handleHistoryDetailOrder: ', error)
  }
}

const handleTrackingOrder = async (variable: any) => {
  try {
    return await graphQLClient.request(TRACKING_ORDER_QUERIES, variable)
  } catch (error) {
    console.error('Error get handleTrackingOrder: ', error)
  }
}

const orderApi = {
  getHistoryOrder: handleHistoryOrder,
  getHistoryDetailOrder: handleHistoryDetailOrder,
  trackingOrder: handleTrackingOrder,
}

export default orderApi
