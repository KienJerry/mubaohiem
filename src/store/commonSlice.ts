import { PayloadType } from '@/types'
import { createSlice } from '@reduxjs/toolkit'

interface CommonSlice {
  backdropVisible: boolean
}

const initialState: CommonSlice = {
  backdropVisible: false,
}

const commonSlice = createSlice({
  name: 'common',
  initialState,
  reducers: {
    setBackdropVisible: (state, { payload }: PayloadType<boolean>) => {
      state.backdropVisible = payload
    },
  },
})

export default commonSlice.reducer
export const { setBackdropVisible } = commonSlice.actions
