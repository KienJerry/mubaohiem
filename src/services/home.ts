import { gql } from 'graphql-request'
import { graphQLClientGet, graphQLClient } from './graphql'

export const getListBanks = gql`
  query getListBanks($filter: BankFilterInput, $pageSize: Int, $currentPage: Int) {
    Banks(filter: $filter, pageSize: $pageSize, currentPage: $currentPage) {
      items {
        account_holder
        account_number
        bank
        bank_id
        logo
        payment_method
        qr_code
        sort_order
      }
      page_info {
        current_page
        page_size
        total_pages
      }
      total_count
    }
  }
`
export const getSlider = gql`
  query getSlider($filter: SliderFilterInput) {
    Slider(filter: $filter) {
      items {
        title
        identifier
        Banner {
          items {
            banner_id
            caption
            link
            media
            media_alt
            name
            slider_id
          }
          page_info {
            current_page
            page_size
            total_pages
          }
        }
      }
      total_count
    }
  }
`

export const getMenu = gql`
  query snowdogMenus($identifiers: [String]) {
    snowdogMenus(identifiers: $identifiers) {
      items {
        creation_time
        css_class
        identifier
        menu_id
        nodes {
          items {
            additional_data
            classes
            creation_time
            level
            menu_id
            node_id
            node_template
            parent_id
            position
            submenu_template
            title
            type
            update_time
            url_key
            ... on SnowdogMenuNodeImageFieldInterface {
              image
              image_alt_text
            }
          }
        }
        title
        update_time
      }
    }
  }
`

export const bank = {
  getListBank: async () => {
    try {
      return await graphQLClientGet.request(getListBanks)
    } catch (error) {
      console.error('Error get list post:', error)
    }
  },
}

const handleGetSlider = async (identifier: any) => {
  try {
    return await graphQLClientGet.request(getSlider, {
      filter: {
        identifier,
      },
    })
  } catch (error) {
    console.error('Error get Slider: ', error)
  }
}

const handleGetMenu = async (variable: any) => {
  try {
    return await graphQLClient.request(getMenu, variable)
  } catch (error) {
    console.error('Error get handleGetMenu: ', error)
  }
}

export const homeApi = {
  getSlider: handleGetSlider,
  getMenu: handleGetMenu,
}

export default homeApi
