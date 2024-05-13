import React, { ReactElement, useEffect, useCallback} from 'react'
import { TlayoutWithChild } from '@/types/layout'
import { Header } from './header'
import { Main } from './main'
import { Footer } from './footer'
import { useRouter } from 'next/router';
import { useMutation, useQueryClient } from 'react-query'
import { TypeGoogleAuth } from '@/types/auth'
import authenApi from '@/services/authenticate.queries'
import { graphQLClient, COOKIE_KEY } from '@/services/graphql'
// import dynamic from 'next/dynamic'
import Cookies from 'js-cookie'
import { __getDataLocal, __RemoveItemLocal, __CreateDataLocal } from '@/helper/local_helper/localStogare'
import { toast } from 'react-toastify'
import productApi from '@/services/product'
import { compareApi } from '@/services'

// const Header = dynamic(() => import('./header').then((mod) => mod.Header), {
//   ssr: false,
// })

type TProps = {
  breadcrumb?: string
  userPage?: boolean
  children?: React.ReactNode | any
  Advertisement?: any
}

export const MainLayout: TlayoutWithChild & React.FC<TProps> = ({ children, Advertisement = true }) => {
  const router = useRouter();
  const queryClient = useQueryClient()
  useEffect(() => {
    const data: any = router.query;
    if (data?.handle == 'google' || data?.handle == 'facebook') {
    // if (data?.handle == 'google') {
      handleSubmit(data)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSubmit = useCallback((data: any) => {
    if(data?.handle == 'google'){
      loginWithGoogle.mutateAsync(data)
    }else if(data?.handle == 'facebook'){
      loginWithFacebook.mutateAsync(data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loginWithFacebook = useMutation({
    mutationKey: 'loginWithFaceBook',
    mutationFn: async (data: TypeGoogleAuth) => {
      return await authenApi.FaceBookLogin(data)
    },
    onSuccess: async (response: any) => {
      if (response?.generateCustomerTokenSocialLogin !== null) {
        const token = response?.generateCustomerTokenSocialLogin?.token
        AddTokenAuth(token);
      }
    },
    onError: () => {
    },
  })

  const loginWithGoogle = useMutation({
    mutationKey: 'loginWithGoogle',
    mutationFn: async (data: TypeGoogleAuth) => {
      return await authenApi.GoogleLogin(data)
    },
    onSuccess: async (response: any) => {
      if (response?.generateCustomerTokenSocialLogin !== null) {
        const token = response?.generateCustomerTokenSocialLogin?.token
        AddTokenAuth(token);
      }
    },
    onError: () => {
    },
  })

  const { mutate: mutateAddFavorite } = useMutation({
    mutationFn: async (data: any) => {
      return await productApi.addProductsToWishlist(data)
    },
    onSuccess: (response: any) => {
      if (!!response?.addProductsToWishlist?.wishlist) {
        queryClient.invalidateQueries(['getWishlists'])
      }
    },
    onError: () => {},
  })

  const assignCompareListToCustomer = () => {
    const getID = __getDataLocal({ key: 'compare-product', type: 'string' })
    if (!!getID) {
      mutateAssignCompare({ uid: getID })
    } else {
      CreateCompare([])
    }
  }

  const { mutate: CreateCompare } = useMutation({
    mutationFn: async (data: any) => {
      return await compareApi.createCompare({
        input: {
          products: data,
        },
      })
    },
    onSuccess: async (response: any) => {
      if (!!response?.createCompareList) {
        __CreateDataLocal({
          type: 'string',
          key: 'compare-product',
          data: response?.createCompareList?.uid,
        })
        await queryClient.invalidateQueries(['getCompare'])
      }
    },
    onError: () => {},
  })

  const { mutate: mutateAssignCompare } = useMutation({
    mutationFn: async (data: any) => {
      return await compareApi.assignCompareToCustomer(data)
    },
    onSuccess: async (response: any) => {
      if (!!response?.assignCompareListToCustomer) {
        __CreateDataLocal({
          type: 'string',
          key: 'compare-product',
          data: response?.assignCompareListToCustomer?.compare_list?.uid,
        })
        await queryClient.invalidateQueries(['getCompare'])
      }
    },
    onError: () => {},
  })

  const handleBindApi = () => {
    const getFavorite = __getDataLocal({ key: 'favorite-product', type: 'array' }) || []
    if (getFavorite?.length > 0) {
      const wishlistItems = getFavorite?.map((item: any) => ({
        selected_options: item.defaultData[0].selected_options,
        parent_sku: item.defaultData[0].parent_sku,
        sku: item.defaultData[0].sku,
        quantity: item.defaultData[0].quantity,
      }))
      const param = {
        wishlistId: '0',
        wishlistItems: wishlistItems,
      }
      mutateAddFavorite(param)
      __RemoveItemLocal({ key: 'favorite-product' })
    }

    assignCompareListToCustomer()
  }

  const AddTokenAuth = (token: any) => {
    graphQLClient.setHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      accept: 'application/json',
    })
      Cookies.set(COOKIE_KEY?.ACCESS_TOKEN, token)
      toast.success('Đăng nhập thành công')
      router.push('/')
      handleBindApi()
  }

  return (
    <div className="app">
      <Header />
      <Main Advertisement={Advertisement}>{children}</Main>
      <Footer />
    </div>
  )
}

MainLayout.getLayout = (page: ReactElement) => <MainLayout>{page}</MainLayout>
