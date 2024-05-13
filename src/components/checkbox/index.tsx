import Link from 'next/link'
import { InputHTMLAttributes } from 'react'
import { Control, useController } from 'react-hook-form'

type CheckboxProps = InputHTMLAttributes<any> & {
  name: string,
  defaultValue?: any,
  nameLabel?: string,
  fClassName?: string,
  notMT?: string,
  flex?: string,
  icon?: JSX.Element,
  control: Control<any>,
}

export const Checkbox = ({
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
}: CheckboxProps) => {
  const {
    field: { onChange, onBlur, ref, value },
    fieldState: { error },
  } = useController({ name, control, defaultValue })

  return (
    <div className={`form-check`} style={{ flex: `${flex ? '1' : 'auto'}` }}>
      <input
        id={name}
        name={name}
        className={`form-check-input ${error ? 'input-error' : ''}`}
        {...field}
        onChange={onChange}
        onBlur={onBlur}
        checked={value}
        ref={ref}
        required={required}
        type="checkbox"
      />
      {/* <input className="form-check-input" type="checkbox" value="" id="account" /> */}

      {nameLabel && (
        <label className="form-check-label" htmlFor={name}>
          {/* {nameLabel} */}
          <label className="form-check-label" htmlFor="account">
            Bạn đã chắc chắn đọc chính sách của chúng tôi. Nếu chưa , xin hãy đọc chính sách{' '}
            <Link href="/chinh-sach-su-dung" className="color-green2 text-decoration-underline">
              {' '}
              Điều khoản & Điều kiện{' '}
            </Link>
          </label>
        </label>
      )}

      {error && <div className="txt-form-err">{error?.message || 'Please enter valid'}</div>}
    </div>
  )
}
