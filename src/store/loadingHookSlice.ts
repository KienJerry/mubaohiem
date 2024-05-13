import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoadingGetCart: false,
  isLoadingHandleVoucher: false,
  isLoadingHandleShipping: false,
}

const loadingHookSlice = createSlice({
  name: 'loadingHookSlice',
  initialState,
  reducers: {
    updateLoading: (state, action) => {
      return {
        ...state,
        ...action.payload,
      }
    },
    clearLoading: () => {
      return initialState
    },
  },
})

export const { updateLoading, clearLoading } = loadingHookSlice.actions
export default loadingHookSlice.reducer
