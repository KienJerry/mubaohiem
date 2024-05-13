const PRODUCT_NOT_IN = -1

export const handleAddToRecentlyViewed = (productSelected: Product) => {
  const recentlyViewedJSON = localStorage.getItem('recentlyViewed')

  if (recentlyViewedJSON === null) {
    return localStorage.setItem('recentlyViewed', JSON?.stringify([productSelected]))
  }

  const recentlyViewed: Product[] = JSON?.parse(recentlyViewedJSON ?? '')

  if (
    recentlyViewed?.findIndex((product) => product.uid === productSelected?.uid) === PRODUCT_NOT_IN
  ) {
    return localStorage.setItem(
      'recentlyViewed',
      JSON?.stringify([productSelected, ...recentlyViewed])
    )
  }
}
