import { gql } from 'graphql-request'
import { graphQLClient, graphQLClientGet } from './graphql'

export const getReviewsProduct = gql`
  query getReviewsProduct($filter: ProductAttributeFilterInput, $pageSize: Int, $currentPage: Int) {
    products(filter: $filter) {
      items {
        reviews(pageSize: $pageSize, currentPage: $currentPage) {
          items {
            average_rating
            created_at
            nickname
            ratings_breakdown {
              name
              value
            }
            summary
            text
          }
          page_info {
            current_page
            page_size
            total_pages
          }
        }
      }
    }
  }
`

export const productReviewRatingsMetadata = gql`
  query productReviewRatingsMetadata {
    productReviewRatingsMetadata {
      items {
        id
        name
        values {
          value
          value_id
        }
      }
    }
  }
`

export const createProductReview = gql`
  mutation createProductReview($input: CreateProductReviewInput!) {
    createProductReview(input: $input) {
      review {
        average_rating
        created_at
        nickname
        product {
          sku
          url_key
          name
        }
      }
    }
  }
`

export type RatingSelected = {
  id: string,
  value_id: string,
}

export type CreateReviewInput = {
  input: {
    sku: string,
    nickname: string,
    text: string,
    summary: string,
    ratings: RatingSelected[],
  },
}

const handleReviewsProduct = async ({
  url_key,
  currentPage = 1,
  pageSize = 20,
}: {
  url_key: string,
  pageSize?: number,
  currentPage?: number,
}) => {
  try {
    return await graphQLClientGet.request(getReviewsProduct, {
      filter: {
        url_key: {
          eq: url_key,
        },
      },
      pageSize,
      currentPage,
    })
  } catch (error) {
    console.error('Error get reviews product: ', error)
  }

  return undefined
}

const handleGetReviewRatingsMetadata = async () => {
  try {
    return await graphQLClientGet.request(productReviewRatingsMetadata)
  } catch (error) {
    console.error('Error get reviews product: ', error)
  }

  return undefined
}

const handleCreateProductReview = async (variable: CreateReviewInput) => {
  try {
    return await graphQLClient.request(createProductReview, variable)
  } catch (error) {
    console.error('Error get reviews product: ', error)
  }

  return undefined
}

const reviewAPI = {
  createReview: handleCreateProductReview,
  getReviewsProduct: handleReviewsProduct,
  getReviewRatingsMetadata: handleGetReviewRatingsMetadata,
}

export default reviewAPI
