import { gql } from 'graphql-request'
import { graphQLClientGet, graphQLClient } from './graphql'

type ConditionFilter = Record<'in', string[]> | Record<'eq', string>

type FilterName =
  | 'category_uid'
  | 'sku'
  | 'color'
  | 'size'
  | 'helmet_ear_cups'
  | 'helmet_lining'
  | 'helmet_shell'
  | 'styrofoam'
  | 'url_key'
  | 'warranty'

export type FilterProducts =
  | (Record<FilterName, ConditionFilter> &
      Record<'name', Record<'match ', string>> &
      Record<'price', Record<'from' | 'to', string>>)
  | {}

export type VariableGetProducts = {
  search?: string,
  pageSize: number,
  currentPage: number,
  sort?: Record<string, string> | {},
  filter: FilterProducts,
}

type ProductDetailByUrlKey = {
  filter: {
    url_key: {
      eq: string,
    },
  },
}
type ProductDetailBySKU = {
  filter: {
    sku: {
      eq: string,
    },
  },
}

type setProdToWishList = {
  wishlistId: number,
  wishlistItems: any,
}

export type VariableGetProductDetail = ProductDetailByUrlKey | ProductDetailBySKU | {}

export const getProducts = gql`
  query getProducts(
    $search: String
    $filter: ProductAttributeFilterInput
    $sort: ProductAttributeSortInput
    $pageSize: Int
    $currentPage: Int
  ) {
    products(
      search: $search
      filter: $filter
      sort: $sort
      pageSize: $pageSize
      currentPage: $currentPage
    ) {
      items {
        ...ProductInterfaceField
        ...ConfigurableProductField
      }
      aggregations {
        attribute_code
        count
        label
        options {
          count
          label
          value
          swatch_data {
            type
            value
          }
        }

        position
      }
      sort_fields {
        default
        options {
          label
          value
        }
      }
      total_count
      page_info {
        current_page
        page_size
        total_pages
      }
      categories_brands {
        attribute_code
        count
        label
        options {
          label
          value
        }
      }
      priceRangeFilters {
        max
        min
        ranges {
          from
          label
          to
          value
        }
      }
    }
  }
  fragment ProductInterfaceField on ProductInterface {
    __typename
    sku
    uid
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
    rating_summary
    review_count
    thumbnail {
      url
      position
    }
    image {
      url
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
    tags
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
  fragment ConfigurableProductField on ConfigurableProduct {
    configurable_options {
      attribute_code
      position
    }
    configurable_product_options_selection {
      __typename
      configurable_options {
        attribute_code
        label
        uid
        values {
          __typename
          uid
          label
          is_use_default
          is_available
          swatch {
            ...SwatchDataField
          }
        }
      }
    }
    variants {
      attributes {
        code
        label
        uid
        value_index
      }
      product {
        __typename
        uid
        stock_status
        special_price
        ...CustomField
        price_range {
          ...PriceRangeField
        }
        sku
        name
        url_key
        stock_status
        image {
          url
          label
        }
        small_image {
          url
          label
        }
        thumbnail {
          url
          position
        }
      }
    }
  }
  fragment SwatchDataField on SwatchDataInterface {
    __typename
    ... on ColorSwatchData {
      __typename
      value
    }
    ... on ImageSwatchData {
      __typename
      value
    }
    ... on TextSwatchData {
      __typename
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
      currency
      value
    }
    regular_price {
      currency
      value
    }
  }
`

export const getProductDetail = gql`
  query getProductDetail($filter: ProductAttributeFilterInput) {
    products(filter: $filter) {
      items {
        ...ProductInterfaceField
        ...ConfigurableProductField
        related_products {
          ...ProductInterfaceField
        }
        upsell_products {
          ...ProductInterfaceField
        }
      }
      total_count
    }
  }
  fragment ProductInterfaceField on ProductInterface {
    __typename
    sku
    name
    uid
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
      html
    }
    rating_summary
    review_count
    short_description {
      html
    }
    thumbnail {
      url
      position
    }
    image {
      url
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
  fragment ConfigurableProductField on ConfigurableProduct {
    configurable_options {
      attribute_code
      attribute_uid
      label
      position
      uid
      use_default
    }
    configurable_product_options_selection {
      __typename
      configurable_options {
        attribute_code
        label
        uid
        values {
          __typename
          uid
          label
          is_use_default
          is_available
          swatch {
            ...SwatchDataField
          }
        }
      }
    }
    variants {
      attributes {
        code
        label
        uid
        value_index
      }
      product {
        __typename
        stock_status
        special_price
        ...CustomField
        price_range {
          ...PriceRangeField
        }
        sku
        name
        url_key
        stock_status
        image {
          url
          label
        }
        small_image {
          url
          label
        }
        thumbnail {
          url
          position
        }
      }
    }
  }
  fragment SwatchDataField on SwatchDataInterface {
    __typename
    ... on ColorSwatchData {
      __typename
      value
    }
    ... on ImageSwatchData {
      __typename
      value
    }
    ... on TextSwatchData {
      __typename
      value
    }
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
      currency
      value
    }
    regular_price {
      currency
      value
    }
  }
`

export const productDailySales = gql`
  query getProductDailySales($pageSize: Int, $currentPage: Int) {
    DailySales(pageSize: $pageSize, currentPage: $currentPage) {
      items {
        end_date
        entity_id
        items {
          end_date
          entity_id
          product {
            ...ProductInterfaceField
          }
          product_id
          sale_price
          sale_qty
          saleable_qty
          sold_qty
          start_date
        }
        priority
        show_in_home
        start_date
        status
        title
      }
      page_info {
        current_page
        page_size
        total_pages
      }
      total_count
    }
  }
  fragment ProductInterfaceField on ProductInterface {
    __typename
    sku
    uid
    name
    url_key
    url_suffix
    canonical_url
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

export const getReviewsProduct = gql`
  query getReviewsProduct($filter: ProductAttributeFilterInput, $pageSize: Int, $currentPage: Int) {
    products(filter: $filter) {
      items {
        reviews(pageSize: $pageSize, currentPage: $currentPage) {
          items {
            average_rating
            created_at
            nickname
            ratings_breakdown {
              name
              value
            }
            summary
            text
          }
          page_info {
            current_page
            page_size
            total_pages
          }
        }
      }
    }
  }
`

export const addProductsToWishlistQueries = gql`
  mutation AddProductsToWishlist($wishlistId: ID!, $wishlistItems: [WishlistItemInput!]!) {
    addProductsToWishlist(wishlistId: $wishlistId, wishlistItems: $wishlistItems) {
      wishlist {
        id
        items_count
      }
      user_errors {
        code
        message
      }
    }
  }
`
export const getWishlists = gql`
  query getWishlists($currentPage: Int, $pageSize: Int) {
    customer {
      wishlists(currentPage: $currentPage, pageSize: $pageSize) {
        id
        items_count
        updated_at
        items_v2 {
          items {
            added_at
            quantity
            id
            ... on ConfigurableWishlistItem {
              added_at
              quantity
              configured_variant {
                __typename
                uid
                sku
                name
                url_key
                image {
                  url
                  label
                }
                thumbnail {
                  url
                  label
                }

                stock_status
                new_from_date
                new_to_date
                rating_summary
                review_count
                price_range {
                  ...PriceRangeField
                }
                ...CustomField
              }
              configurable_options {
                configurable_product_option_uid
                configurable_product_option_value_uid
                option_label
                value_label
              }
            }
            product {
              __typename
              name
              image {
                ...ProductImageFields
              }
              sku
              url_key
            }
          }
          page_info {
            total_pages
            page_size
            current_page
          }
        }
      }
    }
  }

  fragment ProductImageFields on ProductImage {
    url
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
      currency
      value
    }
    regular_price {
      currency
      value
    }
  }

  fragment CustomField on ProductInterface {
    color
    styrofoam
    size
    tags
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
`

export const removeItemWishlists = gql`
  mutation removeProductsFromWishlist($wishlistId: ID!, $wishlistItemsIds: [ID!]!) {
    removeProductsFromWishlist(wishlistId: $wishlistId, wishlistItemsIds: $wishlistItemsIds) {
      user_errors {
        code
        message
      }
      wishlist {
        id
        items_count
        sharing_code
        updated_at
      }
    }
  }
`

const handleGetProducts = async (variable: VariableGetProducts) => {
  try {
    return await graphQLClientGet.request(getProducts, variable)
  } catch (error) {
    console.error('Error get Products: ', error)
    return undefined
  }
}

const handleGetProductDetail = async (variable: VariableGetProductDetail) => {
  try {
    return await graphQLClientGet.request(getProductDetail, variable)
  } catch (error) {
    console.error('Error get product detail: ', error)
    return undefined
  }
}

const handleGetProductDailySales = async () => {
  try {
    return await graphQLClientGet.request(productDailySales, {
      pageSize: 20,
      currentPage: 1,
    })
  } catch (error) {
    console.error('Error get product daily sales: ', error)
    return undefined
  }
}

const handleAddProductsToWishlist = async (variable: setProdToWishList) => {
  try {
    return await graphQLClient.request(addProductsToWishlistQueries, variable)
  } catch (error) {
    console.error('Error handleAddProductsToWishlist: ', error)
    return undefined
  }
}

const handleGetWishList = async (variable: any) => {
  try {
    return await graphQLClient.request(getWishlists, variable)
  } catch (error) {
    console.error('Error handleGetWishList: ', error)
    return undefined
  }
}

const handleRemoveItemWishList = async (variable: any) => {
  try {
    return await graphQLClient.request(removeItemWishlists, variable)
  } catch (error) {
    console.error('Error handleRemoveItemWishList: ', error)
    return undefined
  }
}

const productAPI = {
  getProducts: handleGetProducts,
  getProductDetail: handleGetProductDetail,
  getProductDailySales: handleGetProductDailySales,
  addProductsToWishlist: handleAddProductsToWishlist,
  getWishlist: handleGetWishList,
  removeItemWishList: handleRemoveItemWishList,
}

export default productAPI
