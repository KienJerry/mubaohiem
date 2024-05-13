import { gql } from 'graphql-request'
import { graphQLClientGet } from './graphql'

export const getCategories = gql`
  query getCategories($filters: CategoryFilterInput) {
    categories(filters: $filters) {
      __typename
      items {
        breadcrumbs {
          ...BreadcrumbFields
        }
        children {
          breadcrumbs {
            ...BreadcrumbFields
          }
          children {
            breadcrumbs {
              ...BreadcrumbFields
            }
            ...CategoryTreeFields
          }
          ...CategoryTreeFields
        }
        ...CategoryTreeFields
      }
    }
  }
  fragment CategoryTreeFields on CategoryTree {
    uid
    available_sort_by
    canonical_url
    name
    image
    icon_image
    include_in_menu
    meta_description
    meta_keywords
    meta_title
    display_mode
    url_key
    url_path
    description
    path
    path_in_store
    children_count
    position
    product_count
    image_banner
  }
  fragment BreadcrumbFields on Breadcrumb {
    category_level
    category_name
    category_uid
    category_url_key
    category_url_path
  }
`

const handleGetCategories = async (variable: any) => {
  try {
    return await graphQLClientGet.request(getCategories, variable)
  } catch (error) {
    console.error('Error get Categories: ', error)
  }
}

const categoryApi = {
  getCategories: handleGetCategories
}

export default categoryApi
