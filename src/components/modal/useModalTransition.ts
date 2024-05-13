import { Variants } from 'framer-motion'
import { useMemo } from 'react'
import { ModalTransitionType } from './modal'

export const useModalTransition = (type: ModalTransitionType) => {
  const fadeInVariants = useMemo(
    () => ({
      visible: {
        opacity: 1,
        transition: {
          when: 'beforeChildren',
          duration: 0.3,
          delayChildren: 0.3,
        },
      },
      hidden: {
        opacity: 0,
        transition: {
          when: 'afterChildren',
          duration: 0.3,
        },
      },
    }),
    []
  )

  const slideUpVariants: Variants = useMemo(
    () => ({
      visible: {
        opacity: 1,
        transition: {
          when: 'beforeChildren',
          duration: 0.3,
        },
        marginTop: 0,
      },
      hidden: {
        opacity: 0,
        transition: {
          when: 'afterChildren',
          duration: 0.3,
        },
        marginTop: 200,
      },
    }),
    []
  )

  const slideDownVariants: Variants = useMemo(
    () => ({
      visible: {
        opacity: 1,
        transition: {
          when: 'beforeChildren',
          duration: 0.3,
        },
        marginBottom: 0,
      },
      hidden: {
        opacity: 0,
        transition: {
          when: 'afterChildren',
          duration: 0.3,
        },
        marginBottom: 200,
      },
    }),
    []
  )

  const slideFromLeftVariants: Variants = useMemo(
    () => ({
      visible: {
        opacity: 1,
        transition: {
          when: 'beforeChildren',
          duration: 0.5,
        },
        marginRight: '0',
      },
      hidden: {
        opacity: 0,
        transition: {
          when: 'afterChildren',
          duration: 0.5,
        },
        marginRight: '-100%',
      },
    }),
    []
  )

  const slideFromRightVariants: Variants = useMemo(
    () => ({
      visible: {
        opacity: 1,
        marginLeft: '0',
        transition: {
          when: 'beforeChildren',
          duration: 0.5,
        },
      },
      hidden: {
        opacity: 0,
        transition: {
          when: 'afterChildren',
          duration: 0.5,
        },
        marginLeft: '-100%',
      },
    }),
    []
  )

  const variants = useMemo(() => {
    if (type === 'fade') {
      return fadeInVariants
    }

    if (type === 'slideDown') {
      return slideDownVariants
    }

    if (type === 'slideUp') {
      return slideUpVariants
    }

    if (type === 'slideFromLeft') {
      return slideFromLeftVariants
    }
    return slideFromRightVariants
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  return {
    fadeInVariants,
    variants,
  }
}
