import type { AnyAction } from '@reduxjs/toolkit'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { useDispatch } from 'react-redux'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import type { ThunkDispatch } from 'redux-thunk'
import thunk from 'redux-thunk'
import cartSlice from './cartSlice'
import commonSlice from './commonSlice'
import userSlice from './userSlice'
import favoriteSlice from './favoriteSlice'
import loadingHookSlice from './loadingHookSlice'

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ["cart"],
}

const rootReducer = combineReducers({
  common: commonSlice,
  user: userSlice,
  cart: cartSlice,
  favorite: favoriteSlice,
  loading: loadingHookSlice,
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
}) as any

export { store }
export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppThunkDispatch = ThunkDispatch<RootState, any, AnyAction>
export const useAppDispatch = () => useDispatch<AppThunkDispatch>()
