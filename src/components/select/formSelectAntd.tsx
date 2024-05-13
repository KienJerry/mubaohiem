import React from 'react'
import { Select as RSelect, SelectProps as RSelectProps, Empty } from 'antd'
import { FieldError } from 'react-hook-form'

export type SelectProps = RSelectProps & {
  nameLabel?: string
  required?: boolean
  error?: FieldError
  name: string
}

export const FormSelectAntd = ({ name, nameLabel, required, error, ...props }: SelectProps) => {
  return (
    <div className="form-group mb-16">
      {nameLabel && (
        <label htmlFor={name}>
          {nameLabel} {required && <span className="color-red1"> * </span>}
        </label>
      )}
      <RSelect {...props} className="formSelect" notFoundContent={<Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu" />} />
      {error && <div className="txt-form-err">{error?.message || 'Please enter valid'}</div>}
    </div>
  )
}
