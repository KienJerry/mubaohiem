import { createSlice } from '@reduxjs/toolkit'

export enum TYPE_CART {
  GUEST = 'guest',
  USER = 'user',
}

export type CartSliceType = {
  cartId: string,
  type: TYPE_CART.GUEST | TYPE_CART.USER,
}

const initialState: CartSliceType = {
  cartId: '',
  type: TYPE_CART.GUEST,
}

const cartSlice = createSlice({
  name: 'cartSlice',
  initialState,
  reducers: {
    createCartId: (state, action) => {
      if (state.cartId === '')
        return {
          ...state,
          cartId: action.payload,
        }

      return state
    },
    updateCart: (state, action) => {
      return {
        ...state,
        ...action.payload,
      }
    },
    clearCart: () => {
      return initialState
    },
  },
})

export const { createCartId, updateCart, clearCart } = cartSlice.actions
export default cartSlice.reducer
