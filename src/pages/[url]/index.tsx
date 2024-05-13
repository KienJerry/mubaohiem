import { Meta } from '@/layouts'
import { MainLayout } from '@/layouts/main-layout'
import { contentPage } from '@/services/contentPage'
import { TNextPageWithLayout } from '@/types/layout'
import Breadcrumb from '@/components/Breadcrumb'
import EmptyData from '@/components/boxLayout/EmptyData'
// import { GetStaticProps, GetStaticPaths } from "next";
import Head from 'next/head'
// import router from 'next/router'
import homeApi from '@/services/home'

const CMSPage: TNextPageWithLayout = (res: any) => {
  const dataPage = res?.res?.content?.route

  // if (dataPage?.content === 'fail' && typeof window !== 'undefined') {
  //   router.push('404')
  // }

  return (
    <>
      <Head>
        <meta name="keywords" content={dataPage?.meta_keywords} />
      </Head>
      <Meta
        title={dataPage?.title}
        description={dataPage?.meta_description}
        canonical={process.env.NEXT_PUBLIC_DEPLOY_URL + dataPage?.url_key}></Meta>
        <Breadcrumb
        items={[
          {
            title: 'Trang chủ',
            href: '/',
          },
          {
            title: dataPage?.title,
            href: `/${dataPage?.identifier}`,
          },
        ]}
      />
      {dataPage?.content ?
      <div
      className='wp-cms-page'
        dangerouslySetInnerHTML={{ __html: dataPage?.content }}></div> :
        <div className="text-center wp-cms-page">
          <EmptyData />
          <h5 className="mt-5 mb-5">Dữ liệu trống</h5>
        </div>
      
      }
    </>
  )
}

export const getStaticPaths = async () => {
  const remove = ['/', '/products/', '/contact/', '/blog/']
  const paths = await homeApi
    .getMenu({
      identifiers: ['main-menu'],
    })
    .then((res: any) => {
      const data = res?.snowdogMenus.items?.[0]?.nodes?.items || []
      return data
        ?.map((item: any) => ({
          params: { url: item?.url_key },
        }))
        .filter((item: any) => !!item?.params?.url && !remove?.includes(item?.params?.url));
    })
  return {
    paths: paths,
    fallback: true,
  }
}

export const getStaticProps = async (context: any) => {
  const { params } = context
  const handleGetContentCMS = async () => {
    return await contentPage.getCMSPage(params?.url as any).then((res: any) => {
      let htmlContent = res?.route?.content;
      htmlContent = htmlContent?.replaceAll("&lt;", "<");
      htmlContent = htmlContent?.replaceAll("&gt;", ">");
      return { htmlContent, res }
    })
  }

  const content: any = await handleGetContentCMS()

  if (!content?.res?.route?.__typename) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      res: {
        content: content?.res,
      }
    },
    revalidate: 60,
  }
}

// export const getStaticProps = async ({ params }: any) => {
//   //   return {
//   //     notFound: true,
//   //  }
//   // console.log(params, 'paramsádshdashgd')
//   // const handleGetContentCMS = async (language: "vn" | "en") => {
//   //   return await contentPage.getCMSPage(params?.url as any, language).then((res: any) => {
//   //     let htmlContent = res?.route?.content;
//   //     htmlContent = htmlContent?.replaceAll("&lt;", "<");
//   //     htmlContent = htmlContent?.replaceAll("&gt;", ">");
//   //     return { htmlContent, res }
//   //   })
//   // }

//   // const contentVN: any = await handleGetContentCMS("vn")
//   // const contentEN: any = await handleGetContentCMS("en")
//   return {
//     props: {
//       // res: {
//       //   content_vn: contentVN?.htmlContent ? contentVN : 'fail',
//       //   content_en: contentEN?.htmlContent ? contentEN : 'fail'
//       // }
//     },
//     revalidate: 60,
//   }
// }
// export const getServerSideProps = async (context: any) => {
//   const { query } = context;

//   const handleGetContentCMS = async () => {
//     return await contentPage.getCMSPage(query?.url as any).then((res: any) => {
//       let htmlContent = res?.route?.content;
//       htmlContent = htmlContent?.replaceAll("&lt;", "<");
//       htmlContent = htmlContent?.replaceAll("&gt;", ">");
//       return { htmlContent, res }
//     })
//   }

//   const content: any = await handleGetContentCMS()
//   return {
//     props: {
//       res: {
//         content: content?.htmlContent ? content : 'fail',
//       }
//     },
//   }
// }

CMSPage.Layout = MainLayout
export default CMSPage
