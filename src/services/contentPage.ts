import { gql } from 'graphql-request'
import { graphQLClientGet } from './graphql'

export const getCMSPage = gql`
  query getContentPage($url: String!) {
    route(url: $url) {
      ... on CmsPage {
        __typename
        content
        content_heading
        identifier
        meta_description
        meta_keywords
        meta_title
        page_layout
        title
        url_key
        type
      }
      ... on ProductInterface {
        __typename
        sku
        url_key
      }
      ... on CategoryInterface {
        __typename
        name
        url_key
        uid
      }
    }
  }
`
export const contentPage = {
  getCMSPage: async (url: string) => {
    try {
      return await graphQLClientGet.request(getCMSPage, {
        url: url,
      })
    } catch (error) {
      console.error('Error get list post:', error)
    }
  },
}
