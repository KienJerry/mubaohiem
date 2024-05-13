import { PayloadType } from '@/types'
import { createSlice } from '@reduxjs/toolkit'

interface UserSlice {
  info: any
}

const initialState: UserSlice = {
  info : undefined
}

const commonSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, { payload }: PayloadType<any>) => {
      state.info = payload
    },
  },
})

export default commonSlice.reducer
export const { setUserInfo } = commonSlice.actions
