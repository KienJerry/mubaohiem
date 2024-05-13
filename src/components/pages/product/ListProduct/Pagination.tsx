import React from 'react'
import { Pagination } from 'antd'

interface PaginationProps {
  totalPage: number;
  currentPage: number;
  onAction: (pageIndex: number) => void;
}

const PaginationPage: React.FC<PaginationProps> = ({ totalPage, currentPage, onAction }) => {
  if(totalPage <= 1) return null

  const onChangeCurrentPage = (type: any) => {
    onAction(type)
  }

  return (
    <nav aria-label="Page navigation example">
      <ul className="pagination">
      <Pagination
        defaultCurrent={currentPage}
        pageSize={1}
        total={totalPage || 0}
        onChange={onChangeCurrentPage}
      />
      </ul>
    </nav>
  )
}

export default PaginationPage
