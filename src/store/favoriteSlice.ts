import { createSlice } from '@reduxjs/toolkit'

type FavoriteSliceType = {
  FavoriteLength: number,
}

const initialState: FavoriteSliceType = {
  FavoriteLength: 0,
}

const favoriteSlice = createSlice({
  name: 'favoriteSlice',
  initialState,
  reducers: {
    createFavorite: (state, action) => {
      if (state.FavoriteLength != null) {
        return {
          FavoriteLength: action.payload,
        }
      }
      return state
    },
    updateFavorite: () => {
    },
    clearFavorite: () => {
      return initialState
    },
  },
})

export const { createFavorite, updateFavorite, clearFavorite } = favoriteSlice.actions
export default favoriteSlice.reducer
