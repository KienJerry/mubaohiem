import { ReactNode } from 'react'
import { Modal } from 'antd'

export type ModalAntdProps = {
    children?: ReactNode
    openModal?: boolean
    loading?: boolean
    setOpenModal?: any
    title?: string
    handleSubmit?: () => void
  }

const ModalAntUI = ({ children, openModal, setOpenModal, title }: ModalAntdProps) => {
  return (
    <Modal
      title={title}
      open={openModal}
      onCancel={setOpenModal}
      width={750}
      >
      {children}
    </Modal>
  )
}

export default ModalAntUI
