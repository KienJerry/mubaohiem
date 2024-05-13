import React from 'react'
import { InputHTMLAttributes } from 'react'
import { Control, useController } from 'react-hook-form'

type IFormSelect = InputHTMLAttributes<any> & {
  name: string,
  defaultValue?: any,
  nameLabel?: string,
  fClassName?: string,
  icon?: JSX.Element,
  control: Control<any>,
  data?: any,
}

export const FormSelect = ({
  name,
  nameLabel,
  fClassName,
  icon,
  control,
  required,
  defaultValue,
  data,
  ...field
}: IFormSelect) => {
  const {
    field: { onChange, onBlur, ref, value },
    fieldState: { error },
  } = useController({ name, control, defaultValue })

  return (
    <div className="form-group mb-16">
      {nameLabel && (
        <label htmlFor={name}>
          {nameLabel} {required && <span className="color-red1"> * </span>}
        </label>
      )}
      <select
        onChange={onChange}
        onBlur={onBlur}
        ref={ref}
        name={name}
        id={name}
        className="form-control form-select"
        style={{ position: 'relative' }}
        required={required}
        placeholder="No data"
        value={value || ''}
        {...field}>
        <option disabled selected value="" hidden style={{ color: 'red' }}>
          Please select value
        </option>
        {data?.length > 0
          ? data?.map((val: any) => {
            return (
              <option value={val?.value} key={val?.value}>
                {' '}
                {val?.label}{' '}
              </option>
            )
          })
          : null}
      </select>
      {error && <div className="txt-form-err">{error?.message || 'Please enter valid'}</div>}
    </div>
  )
}
