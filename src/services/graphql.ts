import { GraphQLClient, RequestMiddleware, ResponseMiddleware } from 'graphql-request'
import { toast } from 'react-toastify'
import Cookies from 'js-cookie'

export const COOKIE_KEY = {
  ACCESS_TOKEN: 'token',
}
export const CHECK_AUTH = !!Cookies.get(COOKIE_KEY?.ACCESS_TOKEN) || false
export const GETTOKEN = {
  tokenAuth: () => {
    return Cookies.get(COOKIE_KEY?.ACCESS_TOKEN)
  },
}

const requestMiddleware: RequestMiddleware = async (request) => {
  return {
    ...request,
    headers: {
      ...request.headers,
    },
  }
}

const responseMiddleware: ResponseMiddleware = (response: any) => {
  if (!(response instanceof Error) && response.errors) {
    if (response.errors[0]?.extensions?.category === 'graphql-authorization') {
      // localStorage.clear()
      // window.location.replace(`${window.location.origin}/login`)
      return {
        ...response,
      }
    }

    const errorMessage = response?.errors[0]?.message
    const isErrorCart = response?.errors?.[0]?.path?.includes('cart') ?? false
    if (errorMessage && !isErrorCart) {
      toast.error(errorMessage)
      // throw Error(errorMessage)
    }
  }
  return {
    ...response,
  }
}

const graphQLClient = new GraphQLClient(`${process.env.NEXT_PUBLIC_API_URL}`, {
  requestMiddleware,
  responseMiddleware,
  errorPolicy: 'all',
})

const graphQLClientGet = new GraphQLClient(`${process.env.NEXT_PUBLIC_API_URL}`, {
  requestMiddleware,
  responseMiddleware,
  errorPolicy: 'all',
  method: 'GET',
})

if (typeof window !== 'undefined') {
  graphQLClient.setHeaders({
    Authorization:
      Cookies && Cookies.get(COOKIE_KEY?.ACCESS_TOKEN)
        ? 'Bearer ' + Cookies.get(COOKIE_KEY?.ACCESS_TOKEN)
        : '',
    'Content-Type': 'application/json',
    accept: 'application/json',
  })
}
// ----------------------------------------------------------------------

export const setSession = (accessToken: string | null) => {
  if (accessToken) {
    // localStorage.setItem('token', accessToken)
    Cookies.set(COOKIE_KEY?.ACCESS_TOKEN, accessToken)

    graphQLClient.setHeaders({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      accept: 'application/json',
    })
  } else {
    // localStorage.removeItem('token')
    Cookies.remove(COOKIE_KEY?.ACCESS_TOKEN)
    graphQLClient.setHeaders({
      Authorization: '',
      'Content-Type': 'application/json',
      accept: 'application/json',
    })
  }
}

export const setTokenGraphQL = (token: string) => {
  graphQLClient.setHeaders({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
    accept: 'application/json',
  })
}

export { graphQLClient, graphQLClientGet }
