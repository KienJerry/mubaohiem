import React from 'react'
import { Button } from '../button'
import { Modal, ModalProps } from '../modal'

export type PopupProps = ModalProps & {
  title?: string
  desc?: string
  btnLeftTitle?: string
  btnRightTitle?: string
  onBtnLeftClick?: () => void
  onBtnRightClick?: () => void
}

export const Popup = ({
  title,
  desc,
  btnRightTitle = 'Xác nhận',
  btnLeftTitle = 'Hủy',
  onBtnLeftClick,
  onBtnRightClick,
  ...props
}: PopupProps) => {
  return (
    <Modal
      footer={
        <div className="p-4 flex justify-center">
          {onBtnLeftClick ? (
            <Button
              onClick={onBtnLeftClick}
              title={btnLeftTitle}
              className="bg-secondary hover:bg-secondary flex-1"
            />
          ) : null}

          {onBtnLeftClick && onBtnRightClick ? <span className="w-4" /> : null}

          {onBtnRightClick ? (
            <Button className="flex-1" onClick={onBtnRightClick} title={btnRightTitle} />
          ) : null}
        </div>
      }
      animationType="slideDown"
      modalClassName="w-[300px] h-[228px] rounded-[16px]"
      header={<></>}
      {...props}
    >
      <div className="p-4">
        <p className="text-lg text-center mb-4">{title}</p>
        <p className="text-base text-center">{desc}</p>
      </div>
    </Modal>
  )
}
