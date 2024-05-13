import { useEffect, useState } from 'react'

export const useWindowSize = () => {
  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth)
      setHeight(window.innerHeight)
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return {
    width: width,
    height: height,
    isMobile: typeof width === 'number' && width < 768,
    isTablet: typeof width === 'number' && width < 1024 && width >= 786,
    isDesktop: typeof width === 'number' && width >= 1024,
  }
}
