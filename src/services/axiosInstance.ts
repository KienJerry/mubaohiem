// import { setBackdropVisible, store } from '@/store'
// import { TokenReq } from '@/types'
import axios from 'axios'
// import mem from 'mem'

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_DOMAIN_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})

// Request interceptor for API calls
axiosInstance.interceptors.request.use(
  async (config: any) => {
    config.headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// axiosInstance.interceptors.response.use(
//   (response) => {
//     if (response?.data) {
//       return response
//     }
//     return response
//   },
//   async function (error) {
//     const config = error.config
//     if ((error?.response?.status === 401 || error?.response?.status === 403) && !config?.sent) {
//       config.sent = true
//       await memoizedRefreshToken()
//       return axiosInstance(config)
//     }

//     return Promise.reject(error)
//   }
// )

// const refreshToken = async () => {
//   try {
//     const tokenRes = await authAPI.getToken()

//     const tokenData: TokenReq = {
//       access_token: tokenRes.data?.response?.access_token,
//       refresh_token: tokenRes.data?.response?.refresh_token,
//     }
//     const res = await authAPI.refreshToken(tokenData)
//     store.dispatch(setBackdropVisible(false))
//     if (!res?.data?.success) {
//       await logoutHandler(tokenData)
//     }
//   } catch (error) {
//     store.dispatch(setBackdropVisible(false))
//     await logoutHandler()
//   }
// }

// const logoutHandler = async (params?: TokenReq) => {
//   const data: TokenReq = params?.access_token ? params : (await authAPI.getToken()).data.response
//   await axios.post(`${process.env.NEXT_PUBLIC_DOMAIN_URL}/api/logout`, data)
// }

// const memoizedRefreshToken = mem(refreshToken, {
//   maxAge: 10000,
// })
