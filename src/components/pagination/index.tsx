import React from 'react'

import ReactPaginate, { ReactPaginateProps } from 'react-paginate'
import { Button } from '../button'

export type PaginationProps = ReactPaginateProps & {}

export const Pagination = ({ ...props }: PaginationProps) => {
  return (
    <ReactPaginate
      previousLabel={<Button title="trước" />}
      nextLabel={<Button title="Tiếp" />}
      nextClassName=""
      breakClassName=""
      pageClassName=""
      activeLinkClassName="text-[red]"
      {...props}
      className="flex"
    />
  )
}
