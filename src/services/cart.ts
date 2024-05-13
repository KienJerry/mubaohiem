import { gql } from 'graphql-request'
import { graphQLClient } from './graphql'

export const createEmptyCart = gql`
  mutation createEmptyCart {
    createEmptyCart
  }
`

export const addProductToCart = gql`
  mutation addProductToCart($cartId: String!, $cartItems: [CartItemInput!]!) {
    addProductsToCart(cartId: $cartId, cartItems: $cartItems) {
      cart {
        email
        id
        is_virtual
        total_quantity
      }
      user_errors {
        code
        message
      }
    }
  }
`

export const getCart = gql`
  query getCart($cart_id: String!) {
    cart(cart_id: $cart_id) {
      id
      email
      items {
        id
        uid

        quantity
        prices {
          discounts {
            amount {
              ...MoneyFields
            }
          }
          price {
            ...MoneyFields
          }
          row_total {
            ...MoneyFields
          }
        }
        product {
          __typename
          tags
          attributes {
            attribute_code
            label
            value
          }
          new_from_date
          new_to_date
          review_count
          rating_summary
          name
          sku
          url_key
          stock_status
          image {
            disabled
            label
            position
            url
          }
          thumbnail {
            url
          }
          crosssell_products {
            id
            name
            sku
          }
          attributes {
            attribute_code
            label
            value
          }
        }
        quantity
        ... on ConfigurableCartItem {
          configurable_options {
            option_label
            value_label
            configurable_product_option_value_uid
          }
          configured_variant {
            __typename
            sku
            name
            image {
              url
            }
          }
        }
        ... on SimpleCartItem {
          product {
            name
          }
        }
        errors {
          code
          message
        }
      }
      available_payment_methods {
        code
        title
      }
      shipping_addresses {
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
      applied_coupons {
        code
      }
      prices {
        discounts {
          amount {
            ...MoneyFields
          }
          label
        }
        subtotal_excluding_tax {
          ...MoneyFields
        }
        subtotal_including_tax {
          ...MoneyFields
        }
        subtotal_with_discount_excluding_tax {
          ...MoneyFields
        }
        grand_total {
          ...MoneyFields
        }
      }
    }
  }
  fragment MoneyFields on Money {
    value
    currency
  }
`

export const updateCartItem = gql`
  mutation updateCartItem($input: UpdateCartItemsInput) {
    updateCartItems(input: $input) {
      cart {
        email
        id
        is_virtual
      }
    }
  }
`

export const removeItemForMiniCart = gql`
  mutation RemoveItemForMiniCart($removeItemFromCartInput: RemoveItemFromCartInput) {
    removeItemFromCart(input: $removeItemFromCartInput) {
      cart {
        id
        items {
          uid
          errors {
            code
            message
          }
        }
      }
    }
  }
`

export const mergeCartGuestToCartCustomer = gql`
  mutation mergeCartGuestToCartCustomer($source_cart_id: String!, $destination_cart_id: String) {
    mergeCarts(source_cart_id: $source_cart_id, destination_cart_id: $destination_cart_id) {
      email
      id
      total_quantity
    }
  }
`

export const AddItemWishlistsToCart = gql`
  mutation addWishlistItemsToCart($wishlistId: ID!, $wishlistItemIds: [ID!]) {
    addWishlistItemsToCart(wishlistId: $wishlistId, wishlistItemIds: $wishlistItemIds) {
      add_wishlist_items_to_cart_user_errors {
        code
        message
        wishlistId
        wishlistItemId
      }
      status
      wishlist {
        id
        items_count
        sharing_code
        updated_at
      }
    }
  }
`

export const setGuestEmailOnCart = gql`
  mutation setGuestEmailOnCart($input: SetGuestEmailOnCartInput) {
    setGuestEmailOnCart(input: $input) {
      cart {
        id
        email
        is_virtual
        total_quantity
      }
    }
  }
`

export type CartItem = {
  sku: string,
  quantity: number,
  selected_options: string[],
}

export type VariableAddProductToCart = {
  cartId: string,
  cartItems: CartItem[],
}

type VariableUpdateCart = {
  cart_id: string,
  cart_items: {
    cart_item_uid: string,
    quantity: number,
  }[],
}

type VariableRemoveItem = {
  removeItemFromCartInput: {
    cart_id: string,
    cart_item_uid: string,
  },
}
type AddItemWishlistsToCart = {
  wishlistId: number,
  wishlistItemIds: any,
}

export type VariableGuestEmailOnCart = {
  input: {
    cart_id: string,
    email: string,
  },
}

const handleCreateCart = async () => {
  try {
    return await graphQLClient.request(createEmptyCart)
  } catch (error) {
    console.error('Error create cart: ', error)
  }

  return undefined
}

const handleAddProductToCart = async (variable: VariableAddProductToCart) => {
  try {
    return await graphQLClient.request(addProductToCart, variable)
  } catch (error) {
    console.error('Error add product to cart: ', error)
  }

  return undefined
}

const handleGetCart = async (cartId: string) => {
  try {
    return await graphQLClient.request(getCart, { cart_id: cartId })
  } catch (error) {
    console.error('Error get cart: ', error)
  }

  return undefined
}

const handleUpdateCart = async (variable: VariableUpdateCart) => {
  try {
    return await graphQLClient.request(updateCartItem, {
      input: variable,
    })
  } catch (error) {
    console.error('Error update cart: ', error)
  }

  return undefined
}

const handleRemoveItemForMiniCart = async (variable: VariableRemoveItem) => {
  try {
    return await graphQLClient.request(removeItemForMiniCart, variable)
  } catch (error) {
    console.error('Error remove product from cart: ', error)
  }

  return undefined
}

const handleAddItemWishlistsToCart = async (variable: AddItemWishlistsToCart) => {
  try {
    return await graphQLClient.request(AddItemWishlistsToCart, variable)
  } catch (error) {
    console.error('Error add item Wish list to cart: ', error)
  }

  return undefined
}

const handleMergeCartGuestToCartCustomer = async (variable: {
  source_cart_id: string, // id cart guest
  destination_cart_id: string, //id cart customer
}) => {
  try {
    return await graphQLClient.request(mergeCartGuestToCartCustomer, variable)
  } catch (error) {
    console.error('Error remove product from cart: ', error)
  }

  return undefined
}

const handleSetGuestEmailOnCart = async (variable: VariableGuestEmailOnCart) => {
  try {
    return await graphQLClient.request(setGuestEmailOnCart, variable)
  } catch (error) {
    console.error('Error set guest email on cart: ', error)
  }

  return undefined
}

const cartApi = {
  getCart: handleGetCart,
  createCart: handleCreateCart,
  updateCart: handleUpdateCart,
  addProduct: handleAddProductToCart,

  merge: handleMergeCartGuestToCartCustomer,
  removeProduct: handleRemoveItemForMiniCart,
  setGuestEmailOnCart: handleSetGuestEmailOnCart,
  addItemWishListToCart: handleAddItemWishlistsToCart,
}

export default cartApi
