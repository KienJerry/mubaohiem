import type { ReactNode } from 'react'

import { Backdrop } from '@/components'
import type { MetaProps } from '@/layouts'
import { Meta } from '@/layouts'
import { ToastContainer } from 'react-toast'

type IMainProps = MetaProps & {
  children: ReactNode
}

const Main = ({ children, ...attributes }: IMainProps) => (
  <div className="w-full px-1 text-gray-700 antialiased">
    <Meta {...attributes} />
    <Backdrop />
    <ToastContainer position="top-right" delay={3000} />
    {children}
  </div>
)

export { Main }
