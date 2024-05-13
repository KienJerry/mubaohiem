import React, { useState } from 'react'
import { InputHTMLAttributes } from 'react'
import { Control, useController } from 'react-hook-form'

type ITextArea = InputHTMLAttributes<any> & {
  name: string,
  defaultValue?: any,
  nameLabel?: string,
  fClassName?: string,
  notMT?: string,
  flex?: string,
  rows?: number,
  icon?: JSX.Element,
  control: Control<any>,
}

export const TextArea = ({
  name,
  nameLabel,
  fClassName,
  icon,
  control,
  required,
  defaultValue,
  flex,
  notMT,
  rows,
  ...field
}: ITextArea) => {
  const [showPass, setShowPass] = useState<boolean>(false)
  const {
    field: { onChange, onBlur, ref, value },
    fieldState: { error },
  } = useController({ name, control, defaultValue })

  return (
    <div
      className={`form-group ${notMT ? notMT : 'mb-4'} ${fClassName ?? ''}`}
      style={{ flex: `${flex ? '1' : 'auto'}` }}>
      {nameLabel && (
        <label htmlFor={name}>
          {nameLabel} {required && <span className="text-red">*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <textarea
          id={name}
          name={name}
          className={`form-control ${error ? 'input-error' : ''}`}
          {...field}
          onChange={onChange}
          onBlur={onBlur}
          value={value || ''}
          ref={ref}
          required={required}
          rows={rows || 5}
        />
        {icon}
        {field?.type === 'password' && (
          <i
            className={`show_pass la la-eye${!showPass ? '-slash' : ''}`}
            onClick={() => setShowPass(!showPass)}></i>
        )}
      </div>
      {error && <div className="txt-form-err">{error?.message || 'Please enter valid'}</div>}
    </div>
  )
}
