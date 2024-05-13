import Cookies from 'js-cookie'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
// import { queryClient } from '@/pages/_app'

import { COOKIE_KEY } from '@/services/graphql'
import { RootState, useAppDispatch } from '@/store'
import { useMutation, useQuery } from 'react-query'
import { CartSliceType, clearCart, createCartId, TYPE_CART, updateCart } from '@/store/cartSlice'

import cartApi, {
  CartItem,
  VariableAddProductToCart,
  VariableGuestEmailOnCart,
} from '@/services/cart'
import { updateLoading } from '@/store/loadingHookSlice'

const useCart = () => {
  const dispatch = useAppDispatch()

  const { isLoadingGetCart: isLoadingHookGetCart } = useSelector(
    (state: RootState) => state?.loading
  )
  const { cartId = '', type = TYPE_CART.GUEST } = useSelector((state: RootState) => state.cart)

  const accessToken = Cookies?.get(COOKIE_KEY?.ACCESS_TOKEN)

  const {
    data: cartData,
    isLoading: isLoadingGetCart,
    refetch: refetchCart,
  } = useQuery<ResCart>(['GET_CART', cartId], {
    queryFn: async () => {
      if (!cartId) return
      if (!accessToken && type === TYPE_CART.USER) {
        dispatch(clearCart())
        mutateCreateCart()
        return
      }
      return await cartApi.getCart(cartId)?.then((res: any) => res?.cart)
    },
    onSuccess: (data: any) => {
      dispatch(
        updateLoading({
          isLoadingGetCart: false,
          isLoadingHandleShipping: false,
          isLoadingHandleVoucher: false,
        })
      )
      return data
    },
    onError: () => {
      dispatch(
        updateLoading({
          isLoadingGetCart: false,
          isLoadingHandleShipping: false,
          isLoadingHandleVoucher: false,
        })
      )
    },
    staleTime: 30000,
    enabled: !!cartId,
  })

  const handleRefetchCart = () => {
    if (!isLoadingHookGetCart) dispatch(updateLoading({ isLoadingGetCart: true }))
    // queryClient.refetchQueries(['GET_CART', cartId])
    refetchCart()
  }

  const { mutate: mutateCreateCart, isLoading: isLoadingCreateCart } = useMutation({
    mutationFn: async () => {
      return await cartApi.createCart().then((res: any) => res?.createEmptyCart ?? '')
    },
    onSuccess: (data: any) => {
      dispatch(createCartId(data))
    },
  })

  const { mutate: mutateAddProductToCart, isLoading: isLoadingAddProductToCart } = useMutation({
    mutationFn: async (parameter: VariableAddProductToCart) => {
      return await cartApi.addProduct(parameter)
    },
    onSuccess: (data: any) => {
      const mesErrors = data?.addProductsToCart?.user_errors
      if (!!mesErrors?.length) {
        data?.addProductsToCart?.user_errors?.map((error: any) => {
          toast.error(error?.message)
        })
        return data
      }

      handleRefetchCart()
      toast.success('Thêm sản phẩm vào giỏ hàng thành công!')
      return data
    },
    onError: () => {
      toast.error('Lỗi! Đã có lỗi xảy ra, vui lòng thử lại.')
    },
  })

  const { mutate: mutateUpdateCart, isLoading: isLoadingUpdateCart } = useMutation({
    mutationFn: async (
      parameter: {
        cart_item_uid: string,
        quantity: number,
      }[]
    ) => {
      return await cartApi.updateCart({
        cart_id: cartId,
        cart_items: parameter,
      })
    },
    onSuccess: () => {
      handleRefetchCart()
    },
    onError: () => {
      toast.error('Lỗi! Đã có lỗi xảy ra, vui lòng thử lại.')
    },
  })

  const { mutate: mutateRemoveProduct, isLoading: isLoadingRemoveProduct } = useMutation({
    mutationFn: async (cartItemUid: string) => {
      return await cartApi.removeProduct({
        removeItemFromCartInput: {
          cart_id: cartId,
          cart_item_uid: cartItemUid,
        },
      })
    },
    onSuccess: () => {
      handleRefetchCart()
    },
  })

  const { mutate: mutateMergeCart } = useMutation({
    mutationFn: async (parameter: { cartGuestId: string, cartCustomerId: string }) => {
      return await cartApi.merge({
        destination_cart_id: parameter.cartCustomerId,
        source_cart_id: parameter.cartGuestId,
      })
    },
    onSuccess: (data: any) => {
      dispatch(
        updateCart({
          cartId: data?.mergeCarts?.id,
          type: TYPE_CART.USER,
        })
      )
    },
  })

  const { mutate: mutateCreateCartUser } = useMutation({
    mutationFn: async () => {
      return await cartApi.createCart().then((res: any) => res?.createEmptyCart ?? '')
    },
    onSuccess: (data: any) => {
      mutateMergeCart({
        cartGuestId: cartId,
        cartCustomerId: data,
      })
    },
  })

  const { mutate: mutateCreateCartCheckout } = useMutation({
    mutationFn: async () => {
      return await cartApi.createCart().then((res: any) => res?.createEmptyCart ?? '')
    },
    onSuccess: (data: any) => {
      dispatch(
        updateCart({
          cartId: data,
          type: TYPE_CART.USER,
        })
      )
    },
  })

  const { mutate: mutateSetGuestEmailOnCart, isLoading: isLoadingSetGuestEmail } = useMutation({
    mutationFn: async (variable: VariableGuestEmailOnCart & { callBackFn?: () => void }) => {
      return await cartApi
        .setGuestEmailOnCart({
          input: variable?.input,
        })
        .then(() => variable?.callBackFn?.())
    },
  })

  const handleClearCart = () => {
    dispatch(clearCart())
  }

  const handleUpdateCartId = ({ cartId, type }: CartSliceType) => {
    dispatch(
      updateCart({
        cartId,
        type,
      })
    )
  }

  const handleCreateCartId = () => {
    mutateCreateCart()
  }

  const handleAddProductToCart = (cartItems: CartItem[]) => {
    dispatch(
      updateLoading({
        isLoadingGetCart: true,
      })
    )

    mutateAddProductToCart({
      cartId,
      cartItems,
    })
  }

  const handleUpdateItemCart = (
    cartItems: {
      cart_item_uid: string,
      quantity: number,
    }[]
  ) => {
    dispatch(
      updateLoading({
        isLoadingGetCart: true,
      })
    )

    mutateUpdateCart(cartItems)
  }

  const handleRemoveProduct = (cartItemUid: string) => {
    dispatch(
      updateLoading({
        isLoadingGetCart: true,
      })
    )

    mutateRemoveProduct(cartItemUid)
  }

  const handleUserCreateCart = () => {
    mutateCreateCartUser()
  }

  const handleCartWhenUserLogout = () => {
    handleClearCart()
    mutateCreateCart()
  }

  return {
    cartId,
    cartData,
    typeCart: type,
    isLoadingGetCart,

    isLoadingSetGuestEmail,
    isCartLoading:
      isLoadingCreateCart ||
      isLoadingAddProductToCart ||
      isLoadingUpdateCart ||
      isLoadingRemoveProduct,

    onClearCart: handleClearCart,
    onCreateCartId: handleCreateCartId,
    onAddProducts: handleAddProductToCart,
    onUserCreateCart: handleUserCreateCart,
    onCreateCartCheckout: mutateCreateCartCheckout,

    onUpdateCartId: handleUpdateCartId,
    onRemoveProduct: handleRemoveProduct,
    onUpdateProduct: handleUpdateItemCart,
    onSetGuestEmailOnCart: mutateSetGuestEmailOnCart,

    onRefreshCart: handleRefetchCart,
    onUserLogout: handleCartWhenUserLogout,
  }
}

export default useCart
