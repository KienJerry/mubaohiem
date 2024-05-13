import React, { ReactNode } from 'react'
import { Spinner } from '../spinner'

export interface ButtonProps
  extends React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  loading?: boolean
  title?: string
  icon?: ReactNode
  variant?: 'primary' | 'secondary'
  btnType?: 'outline' | 'contained'
  textClassName?: string
  classN?: string
  mr0?: boolean
  mt?: any
}

export const ButtonSubmit = ({
  title,
  icon,
  style,
  loading = false,
  btnType = 'contained',
  className,
  textClassName,
  classN,
  mr0,
  mt,
  ...attributes
}: ButtonProps) => {
  return (
    <button
      {...attributes}
      style={style}
      disabled={loading || false}
      className={`butn btn-save-acc bg-green2 radius-4 fw-500 fsz-14 text-uppercase text-center mb-0 ${mr0 ? 'm-0' : mt ? `mt-${mt}` : 'mt-8'} ${classN}`}>
      {' '}
      {loading ? (
        <Spinner className="w-[16px] h-[16px] mr-[8px]" />
      ) : null}
      <span> {title} </span>{' '}
      {icon && icon}
    </button>
  )
}
