import { FC } from 'react'
import { Collapse as CollapseAntd } from 'antd'
import type { CollapseProps } from 'antd'

type Collapse = {
  keyID?: string
  title: string,
  children: React.ReactNode,
}

const Collapse: FC<Collapse> = ({ children, title, keyID = "1" }) => {
  const items: CollapseProps['items'] = [
    {
      key: keyID,
      label: title,
      children: <p>{children}</p>,
    },
  ]

  return (
    <CollapseAntd
      items={items}
      defaultActiveKey={['1']}
      className="MN-collapse"
      expandIcon={({ isActive }) =>
        isActive ? (
          <span className="arrow">
            <i className="la la-angle-up fsz-14"></i>
          </span>
        ) : (
          <span className="arrow">
            <i className="la la-angle-down fsz-14"></i>
          </span>
        )
      }
    />
  )
}

export default Collapse
