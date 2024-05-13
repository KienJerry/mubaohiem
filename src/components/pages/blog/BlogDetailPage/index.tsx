import Breadcrumb from '@/components/Breadcrumb'
import Link from 'next/link'
import { blogApi } from '@/services'
import { useQuery } from 'react-query'
import Image from 'next/image'

export const BlogDetailPage = ({ data }: any) => {
  const { data: dataBannerDetail } = useQuery({
    queryKey: ['getBannerDetail'],
    queryFn: async () => {
      return await blogApi
        .getBannerDetail({
          url_key: data?.identifier,
        })
        .then((response: any) => {
          if (response?.blogPostByUrlKey) {
            return response?.blogPostByUrlKey || null
          }
        })
    },
    enabled: !!data?.identifier,
  })

  return (
    <div className="wrapper-detail-blog">
      <Breadcrumb
        items={[
          {
            title: 'Trang chủ',
            href: '/',
          },
          {
            title: 'Bài viết',
            href: '/blog',
          },
          {
            title: data?.title,
            href: `/blog/${data?.identifier}`,
          },
        ]}
      />

      <div className="row-detail-blog">
        <div className="text_content">
          <div className="single_post_info mt-title ">
            <h1 className='t-title mb-8 mt-0'>{data?.title}</h1>
            <p>{data?.creation_time}</p>
          </div>
          <div
            className="content_single_post"
            dangerouslySetInnerHTML={{ __html: data?.filtered_content }}></div>
        </div>
        <div className="div-sidebar">
          {/* {data?.related_products?.[0] && (
            // <Link href={`products/${data?.related_products?.[0]?.url_key}`} className="tg_adv_banner">
            <div  className="tg_adv_banner">
              <img src={`${ data?.related_products?.[0]?.image?.url || "/assets/images/products/prod5.png"}`} alt="quang cao" />
            </div>
          )} */}
          <a href={`${dataBannerDetail?.relative_url || dataBannerDetail?.post_url}`} className="tg_adv_banner">
            <Image
              src={`${dataBannerDetail?.promotion_image || '/assets/images/products/prod5.png'}`}
              alt="banner quang cao"
              width={200}
              height={200}
            />
          </a>
          {data?.related_posts?.length > 0 && (
            <div className="related_posts">
              <h2>BÀI VIẾT LIÊN QUAN</h2>
              <ul>
                {data?.related_posts?.map((val: any, idx: number) => {
                  return (
                    <Link
                      href={`/blog/${val?.identifier}`}
                      className="list_item_related"
                      key={idx}>
                      <Image
                        src={val?.featured_image || '/assets/images/products/cl_1.jpg'}
                        alt="img"
                        width={200}
                        height={200}
                      />
                      <div className="txt-title">{val?.title}</div>
                    </Link>
                  )
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
