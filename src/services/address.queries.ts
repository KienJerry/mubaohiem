import { gql } from 'graphql-request'
import { graphQLClient } from './graphql'

export const GET_CITY_QUERIES = gql`
  query getCitys($country_id: String) {
    citys(country_id: $country_id) {
      listcitys {
        city_id
        code
        country_id
        default_name
        disable_on_storefront
      }
    }
  }
`

export const GET_DISTRICTS_QUERIES = gql`
  query getDistricts($city_id: String) {
    districts(city_id: $city_id) {
      listdistricts {
        city_id
        code
        default_name
        disable_on_storefront
        district_id
      }
    }
  }
`

export const GET_WARD_QUERIES = gql`
  query getwards($district_id: String) {
    wards(district_id: $district_id) {
      listwards {
        code
        default_name
        disable_on_storefront
        district_id
        ward_id
      }
    }
  }
`

export const GET_COUNTRIES_QUERIES = gql`
  query getCountries {
    countries {
      available_regions {
        code
        id
        name
      }
      full_name_english
      id
      three_letter_abbreviation
      two_letter_abbreviation
    }
  }
`

const handleGetCity = async (variable: { country_id: string }) => {
  try {
    return await graphQLClient.request(GET_CITY_QUERIES, variable)
  } catch (error) {
    console.error('Error get handleGetCity: ', error)
  }
}

const handleGetDistricts = async (variable: { city_id: string }) => {
  try {
    return await graphQLClient.request(GET_DISTRICTS_QUERIES, variable)
  } catch (error) {
    console.error('Error get handleGetDistricts: ', error)
  }
}

const handleGetWards = async (variable: { district_id: string }) => {
  try {
    return await graphQLClient.request(GET_WARD_QUERIES, variable)
  } catch (error) {
    console.error('Error get handleGetWards: ', error)
  }
}

const handleGetCountries = async () => {
  try {
    return await graphQLClient.request(GET_COUNTRIES_QUERIES)
  } catch (error) {
    console.error('Error get handleGetCountries: ', error)
  }
}

const addressApi = {
  getCity: handleGetCity,
  getDistricts: handleGetDistricts,
  getWards: handleGetWards,
  getCountries: handleGetCountries,
}

export default addressApi
