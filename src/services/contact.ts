import { gql } from 'graphql-request'
import { graphQLClient } from './graphql'

export const CONTACT_US_QUERIES = gql`
  mutation ContactusFormSubmit($input: ContactusInput!) {
    contactusFormSubmit(input: $input) {
      message
    }
  }
`

export const GET_INFOR_MATION_STORE_QUERIES = gql`
  query GetInformationStore {
    storeAddress {
      city
      city_id
      country_code
      description
      district
      district_id
      email
      fax
      maps
      name
      postcode
      slider_id
      sort_description
      sort_order
      street
      telephone_1
      telephone_2
      ward
      ward_id
    }
  }
`

const handleSubmitContactUs = async (variable: any) => {
  try {
    return await graphQLClient.request(CONTACT_US_QUERIES, variable)
  } catch (error) {
    console.error('Error get handleSubmitContactUs: ', error)
  }
}

const handleGetInforMationStore = async () => {
  try {
    return await graphQLClient.request(GET_INFOR_MATION_STORE_QUERIES)
  } catch (error) {
    console.error('Error get handleGetInforMationStore: ', error)
  }
}

export const contactApi = {
  submitContactUs: handleSubmitContactUs,
  getInfoMationStore: handleGetInforMationStore,
}

export default contactApi
