export const PageItemTab = ({ changePageItem, pageItem, data }: any) => {
  return (
    <div className="box-menu-content">
      {data?.map((val: any) => {
        return (
          <div
            className={`page-item ${pageItem?.category_id == val?.category_id && 'active'}`}
            key={val.category_id}
            onClick={() => changePageItem(val)}>
            {val.title}
          </div>
        )
      })}
    </div>
  )
}
