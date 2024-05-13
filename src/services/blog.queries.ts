import { gql } from 'graphql-request'
import { graphQLClient } from './graphql'

export const GET_CATEGORY_QUERIES = gql`
  query getBlogCategories {
    blogCategories {
      total_count
      items {
        featured_img
        breadcrumbs {
          category_id
          category_level
          category_name
          category_uid
          category_url_key
          category_url_path
        }
        canonical_url
        category_id
        category_level
        category_url
        category_url_path
        content
        content_heading
        custom_layout
        custom_layout_update_xml
        custom_theme
        custom_theme_from
        custom_theme_to
        display_mode
        identifier
        include_in_menu
        is_active
        layout_update_xml
        meta_description
        meta_keywords
        meta_title
        page_layout
        parent_category_id
        path
        position
        posts_count
        posts_sort_by
        title
        type
      }
    }
  }
`

export const GET_ITEMS_BLOG_QUERIES = gql`
  query blogPosts(
    $filter: BlogPostsFilterInput
    $pageSize: Int
    $currentPage: Int
    $sortFiled: String
    $allPosts: Boolean
    $sort: [String]
  ) {
    blogPosts(
      filter: $filter
      pageSize: $pageSize
      currentPage: $currentPage
      sortFiled: $sortFiled
      allPosts: $allPosts
      sort: $sort
    ) {
      items {
        author {
          url
          author_id
          author_url
          creation_time
        }
        author_id
        canonical_url
        category_id
        content_heading
        creation_time
        end_time
        featured_image
        featured_img_alt
        featured_list_image
        featured_list_img_alt
        first_image
        identifier
        is_active
        page_layout
        position
        post_id
        post_url
        publish_time
        search
        title
        type
        update_time
        views_count
      }
      total_count
      total_pages
      type
    }
  }
`
export const GET_DETAIL_BLOG_QUERIES = gql`
  query getBlogDetail($id: String) {
    blogPost(id: $id) {
      author {
        author_id
        author_url
        content
        creation_time
        custom_layout
        custom_layout_update_xml
        custom_theme
        custom_theme_from
        custom_theme_to
        facebook_page_url
        featured_image
        filtered_content
        identifier
        instagram_page_url
        is_active
        layout_update_xml
        linkedin_page_url
        meta_description
        meta_title
        name
        page_layout
        relative_url
        role
        short_content
        short_filtered_content
        title
        twitter_page_url
        type
        url
      }
      author_id
      canonical_url
      categories {
        canonical_url
        category_id
        category_level
        category_url
        category_url_path
        content
        content_heading
        custom_layout
        custom_layout_update_xml
        custom_theme
        custom_theme_from
        custom_theme_to
        display_mode
        identifier
        include_in_menu
        is_active
        layout_update_xml
        meta_description
        meta_keywords
        meta_title
        page_layout
        parent_category_id
        path
        position
        posts_count
        posts_sort_by
        relative_url
        title
        type
      }
      category_id
      content_heading
      creation_time
      custom_layout
      custom_layout_update_xml
      custom_theme
      custom_theme_from
      custom_theme_to
      end_time
      featured_list_image
      featured_list_img_alt
      filtered_content
      first_image
      include_in_recent
      is_active
      is_recent_posts_skip
      layout_update_xml
      media_gallery {
        url
      }
      meta_description
      meta_keywords
      meta_title
      og_description
      og_image
      og_title
      og_type
      page_layout
      publish_time
      related_posts {
        ...BlogPostFields
      }
      relatedproduct_id
      relative_url
      search
      secret
      short_content
      short_filtered_content
      tag_id
      related_products {
        image {
          url
        }
        name
        url_key
        __typename
      }
      tags {
        content
        custom_layout
        custom_layout_update_xml
        custom_theme
        custom_theme_from
        custom_theme_to
        identifier
        is_active
        layout_update_xml
        meta_description
        meta_keywords
        meta_robots
        meta_title
        page_layout
        relative_url
        tag_id
        tag_url
        title
        type
      }
      type
      update_time
      views_count
      ...BlogPostFields
    }
  }
  fragment BlogPostFields on BlogPost {
    featured_image
    featured_img_alt
    identifier
    position
    post_id
    post_url
    title
    publish_time
  }
`

export const CREATE_SUBSCRIBE_QUERIES = gql`
  mutation subscribeEmailToNewsletter($email: String!) {
    subscribeEmailToNewsletter(email: $email) {
      status
    }
  }
`

export const GET_BANNER_BLOG_DETAIL_QUERIES = gql`
  query getBannerBlogDetailt($url_key: String) {
    blogPostByUrlKey(url_key: $url_key) {
      promotion_image
      post_url
      canonical_url
      relative_url
    }
  }
`

const handleGetBannerDetail = async (variable: any) => {
  try {
    return await graphQLClient.request(GET_BANNER_BLOG_DETAIL_QUERIES, variable)
  } catch (error) {
    console.error('Error get handleGetBannerDetail: ', error)
  }
}

const handleGetCategory = async () => {
  try {
    return await graphQLClient.request(GET_CATEGORY_QUERIES)
  } catch (error) {
    console.error('Error get handleGetCategory: ', error)
  }
}

const handleGetItemBlogs = async (variable: any) => {
  try {
    return await graphQLClient.request(GET_ITEMS_BLOG_QUERIES, variable)
  } catch (error) {
    console.error('Error get handleGetItemBlogs: ', error)
  }
}

const handleGetDetailBlog = async (variable: any) => {
  try {
    return await graphQLClient.request(GET_DETAIL_BLOG_QUERIES, variable)
  } catch (error) {
    console.error('Error get handleGetDetailBlog: ', error)
  }
}

const handleCreateSubscribe = async (variable: any) => {
  try {
    return await graphQLClient.request(CREATE_SUBSCRIBE_QUERIES, variable)
  } catch (error) {
    console.error('Error get handleCreateSubscribe: ', error)
  }
}

export const blogApi = {
  getCategory: handleGetCategory,
  getItemBlog: handleGetItemBlogs,
  getDetailBlog: handleGetDetailBlog,
  createSubscribe: handleCreateSubscribe,
  getBannerDetail: handleGetBannerDetail,
}

export default blogApi
