import { useClickOutside, useModal } from '@/hooks'
import classNames from 'classnames'
import React, { useRef } from 'react'
import { twMerge } from 'tailwind-merge'

export type PopoverProps = {
  children: JSX.Element
  content: JSX.Element
  contentClassName?: string
  type?: 'hover' | 'click'
}

export const Popover = ({ children, content, contentClassName, type = 'click' }: PopoverProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const { closeModal, toggle, visible } = useModal()
  useClickOutside([ref], closeModal)

  return (
    <div ref={ref} className="relative group w-fit">
      <div onClick={type ? toggle : undefined} className="cursor-default">
        {children}
      </div>

      {type === 'hover' || visible ? (
        <div
          className={twMerge(
            classNames(
              'absolute p-4 bg-white overflow-hidden shadow-lg',
              {
                'hidden group-hover:block': type === 'hover',
              },
              contentClassName
            )
          )}
        >
          {content}
        </div>
      ) : null}
    </div>
  )
}
