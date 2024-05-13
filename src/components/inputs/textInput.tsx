import React, { useState } from 'react'
import { InputHTMLAttributes } from 'react'
import { Control, useController } from 'react-hook-form'

type ITextField = InputHTMLAttributes<any> & {
  name: string,
  defaultValue?: any,
  nameLabel?: string,
  fClassName?: string,
  notMT?: string,
  flex?: string,
  icon?: JSX.Element,
  control: Control<any>,
}

export const TextInput = ({
  name,
  nameLabel,
  fClassName,
  icon,
  control,
  required,
  defaultValue,
  flex,
  notMT,
  ...field
}: ITextField) => {
  const [showPass, setShowPass] = useState<boolean>(false)
  const {
    field: { onChange, onBlur, ref, value },
    fieldState: { error },
  } = useController({ name, control, defaultValue })
  return (
    <div
      style={{ flex: `${flex ? '1' : 'auto'}` }}>
      {nameLabel && (
        <label htmlFor={name}>
          {nameLabel} {required && <span className="text-red">*</span>}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        <input
          id={name}
          name={name}
          className={`text-field ${error ? 'input-error' : ''}`}
          {...field}
          onChange={onChange}
          onBlur={onBlur}
          value={value || ''}
          ref={ref}
          required={required}
          type={showPass ? 'text' : field?.type}
        />
        {icon}
        {field?.type === 'password' && (
          <i
            className={`show_pass la la-eye${!showPass ? '-slash' : ''}`}
            onClick={() => setShowPass(!showPass)}></i>
        )}
      </div>
      {error && <div className="txt-form-err">{error?.message || 'Trường này không được bỏ trống'}</div>}
    </div>
  )
}
