import { gql } from 'graphql-request'

export const RECENT_VIEWED_PRODUCTS = gql`
  mutation recentViewedProducts($product_ids: [Int]!) {
    recentViewedProducts(product_ids: $product_ids) {
      message
      total_count
    }
  }
`

export const GET_RECENT_VIEWED_PRODUCTS = gql`
  query getRecentViewedProducts($currentPage: Int, $pageSize: Int) {
    recentViewedProducts(currentPage: $currentPage, pageSize: $pageSize) {
      currentPage
      pageSize
      totalPages
      total_count
      items {
        ...ProductInterfaceField
      }
    }
  }
  fragment ProductInterfaceField on ProductInterface {
    __typename
    sku
    uid
    tags
    name
    url_key
    url_suffix
    canonical_url
    stock_status
    categories {
      __typename
      name
      url_key
      url_path
      level
      uid
      icon_image
      image
      path
    }
    meta_description
    meta_keyword
    meta_title
    new_from_date
    new_to_date
    description {
      ...ComplexTextValueFields
    }
    rating_summary
    review_count
    short_description {
      ...ComplexTextValueFields
    }
    thumbnail {
      position
      ...ProductImageFields
    }
    image {
      ...ProductImageFields
    }
    media_gallery {
      __typename
      disabled
      label
      url
      position
    }
    price_range {
      ...PriceRangeField
    }
    ...CustomField
  }
  fragment CustomField on ProductInterface {
    color
    styrofoam
    size
    warranty
    helmet_lining
    helmet_shell
    helmet_ear_cups
    country_of_manufacture
    daily_sale {
      end_date
      entity_id
      sale_price
      sale_qty
      saleable_qty
      sold_qty
      start_date
      __typename
    }
    rating_summary_start {
      star_1
      star_2
      star_3
      star_4
      star_5
    }
    attributes {
      attribute_code
      label
      value
    }
  }
  fragment PriceRangeField on PriceRange {
    __typename
    maximum_price {
      ...ProductPriceField
    }
    minimum_price {
      ...ProductPriceField
    }
  }
  fragment ProductPriceField on ProductPrice {
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
  fragment ComplexTextValueFields on ComplexTextValue {
    html
  }
  fragment ProductImageFields on ProductImage {
    url
  }
  fragment MoneyFields on Money {
    currency
    value
  }
`
