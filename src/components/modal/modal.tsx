import classNames from 'classnames'
import { AnimatePresence, motion } from 'framer-motion'
import { ReactNode, useEffect } from 'react'
import { twMerge } from 'tailwind-merge'
import ReactPortal from './portal'
import { useModalTransition } from './useModalTransition'

export type ModalTransitionType =
  | 'fade'
  | 'slideDown'
  | 'slideUp'
  | 'slideFromLeft'
  | 'slideFromRight'

export type ModalProps = {
  children?: ReactNode
  visible: boolean
  className?: string
  modalClassName?: string
  allowOverlayclose?: boolean
  animationType?: ModalTransitionType
  header?: JSX.Element
  headerClassName?: string
  headerTitle?: string
  overlayclassName?: string
  footer?: JSX.Element
  onClose?: () => void
}

export const Modal = ({
  children,
  visible,
  allowOverlayclose = true,
  className,
  modalClassName,
  animationType = 'slideDown',
  overlayclassName,
  footer,
  onClose,
}: ModalProps) => {
  const { fadeInVariants, variants } = useModalTransition(animationType)

  return (
    <ReactPortal wrapperId="react-portal-modal-container">
      <AnimatePresence>
        {visible && (
          <div
            className={twMerge(
              classNames(
                'fixed top-[0px] right-[0px] left-[0px] bottom-[0px] flex-center items-end z-[1000]',
                className
              )
            )}
          >
            <ModalChildren />
            <motion.div
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={variants}
              className={twMerge(
                classNames(
                  'z-10 rounded-[5px] bg-white flex flex-col w-[400px] h-[400px]',
                  modalClassName
                )
              )}
            >
              <div className="flex-1 overflow-y-auto">{children}</div>

              {footer || null}
            </motion.div>

            {/* Overlay */}
            <motion.div
              className={twMerge(
                classNames(
                  'bg-black-40 absolute top-[0px] right-[0px] left-[0px] bottom-[0px]',
                  overlayclassName
                )
              )}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={fadeInVariants}
              onClick={allowOverlayclose ? onClose : undefined}
            />
          </div>
        )}
      </AnimatePresence>
    </ReactPortal>
  )
}

const ModalChildren = () => {
  useEffect(() => {
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = 'auto'
    }
  })
  return null
}
