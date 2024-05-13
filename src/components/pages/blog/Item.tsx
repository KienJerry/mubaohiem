import Link from 'next/link'
import Image from 'next/image'

export const ItemBlog = ({ data }: any) => {

  return (
    <div className="item-blog" key={data?.post_id}>
      <Link href={`blog/${data?.identifier}`} className="img-item-blog">
        <Image fill src={data?.first_image || '/assets/images/products/prod47.png'} alt="img blog" />
      </Link>
      <div className="div-text">
        <div className="txt-date">{data?.creation_time}</div>
        <Link className="txt-title" href={`blog/${data?.identifier}`}>
          {data?.title}
        </Link>
      </div>
    </div>
  )
}
