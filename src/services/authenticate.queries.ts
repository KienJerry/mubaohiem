import { gql } from 'graphql-request'
import { graphQLClient } from './graphql'

export const SIGN_UP_QUERIES = gql`
  mutation CreateCustomers($input: CustomerCreateInput!) {
    createCustomerV2(input: $input) {
      customer {
        __typename
        email
      }
    }
  }
`

export const SIGN_IN_QUERIES = gql`
  mutation generateCustomerToken($email: String!, $password: String!) {
    generateCustomerToken(email: $email, password: $password) {
      token
    }
  }
`

export const CHANGE_PASSWORD_QUERIES = gql`
  mutation changeCustomerPassword($currentPassword: String!, $newPassword: String!) {
    changeCustomerPassword(currentPassword: $currentPassword, newPassword: $newPassword) {
      email
    }
  }
`

export const SOCIAL_LOGIN_QUERIES = gql`
  query getSocialLoginUrl {
    socialLoginUrl {
      key
      label
      login_url
    }
  }
`

export const SOCIAL_GOOGLE_LOGIN = gql`
  mutation generateCustomerTokenSocialLogin(
    $state: String!
    $code: String!
    $scope: String!
    $authuser: String!
    $prompt: String!
    $handle: String!
  ) {
    generateCustomerTokenSocialLogin(
      state: $state
      code: $code
      scope: $scope
      authuser: $authuser
      prompt: $prompt
      handle: $handle
    ) {
      token
    }
  }
`

export const SOCIAL_FACEBOOK_LOGIN = gql`
  mutation generateCustomerTokenSocialLogin($state: String!, $code: String!, $handle: String!) {
    generateCustomerTokenSocialLogin(state: $state, code: $code, handle: $handle) {
      token
    }
  }
`

export const CUSTOMER_QUERIES = gql`
  query getCustomer {
    customer {
      addresses {
        id
        custom_attributes {
          attribute_code
          value
        }
        city
        company
        country_code
        default_billing
        default_shipping
        telephone
        fax
        firstname
        id
        lastname
        middlename
        postcode
        prefix
        region_id
        street
        suffix
        telephone
        vat_id
      }
      email
      firstname
      lastname
      middlename
      mobile_number
      orders(
        filter: {}
        currentPage: 1
        pageSize: 20
        sort: { sort_direction: ASC, sort_field: NUMBER }
        scope: GLOBAL
      ) {
        total_count
        items {
          id
        }
      }
      prefix
      suffix
      taxvat
    }
  }
`

export const UPDATE_CUSTOMER_QUERIES = gql`
  mutation updateCustomerV2($input: CustomerUpdateInput!) {
    updateCustomerV2(input: $input) {
      customer {
        email
        firstname
        lastname
      }
    }
  }
`

export const CREATE_ADDRESS_CUSTOMER_QUERIES = gql`
  mutation createCustomerAddress($input: CustomerAddressInput!) {
    createCustomerAddress(input: $input) {
      city
      id
      telephone
    }
  }
`

export const UPDATE_ADDRESS_CUSTOMER_QUERIES = gql`
  mutation updateAddressCustomer($id: Int!, $input: CustomerAddressInput!) {
    updateCustomerAddress(id: $id, input: $input) {
      city
      id
    }
  }
`

export const DELETE_ADDRESS_CUSTOMER_QUERIES = gql`
  mutation deleteCustomerAddress($id: Int!) {
    deleteCustomerAddress(id: $id)
  }
`

export const REQUEST_RESET_PASSWORD_QUERIES = gql`
  mutation requestPasswordResetEmail($email: String!) {
    requestPasswordResetEmail(email: $email)
  }
`

export const RESET_PASSWORD_QUERIES = gql`
  mutation resetPassword($email: String!, $resetPasswordToken: String!, $newPassword: String!) {
    resetPassword(email: $email, resetPasswordToken: $resetPasswordToken, newPassword: $newPassword)
  }
`

const handleCreateAccount = async (variable: any) => {
  try {
    const response = await graphQLClient.request(SIGN_UP_QUERIES, variable)
    return response
  } catch (error) {
    console.error('Error get handleCreateAccount: ', error)
  }
}

const handleCustomerToken = async (variable: any) => {
  try {
    return await graphQLClient.request(SIGN_IN_QUERIES, variable)
  } catch (error) {
    console.error('Error get handleCustomerToken: ', error)
  }
}

const handleChangePassword = async (variable: any) => {
  try {
    return await graphQLClient.request(CHANGE_PASSWORD_QUERIES, variable)
  } catch (error) {
    console.error('Error get handleChangePassword: ', error)
  }
}

const handleSocialAuth = async () => {
  try {
    return await graphQLClient.request(SOCIAL_LOGIN_QUERIES)
  } catch (error) {
    console.error('Error get handleSocialAuth: ', error)
  }
}

const handleGoogleLogin = async (variable: any) => {
  try {
    return await graphQLClient.request(SOCIAL_GOOGLE_LOGIN, variable)
  } catch (error) {
    console.error('Error get handleGoogleLogin: ', error)
  }
}

const handleFacebookLogin = async (variable: any) => {
  try {
    return await graphQLClient.request(SOCIAL_FACEBOOK_LOGIN, variable)
  } catch (error) {
    console.error('Error get handleFacebookLogin: ', error)
  }
}

// const cleanWhiteSpace = (str: any) => str.trim().replace(/\s+/g, ' ')

const getFullName = (user: any) => {
  let firstNameSplit = user?.firstname?.split(' ')
  let first = firstNameSplit[firstNameSplit.length - 1]

  let lastNameSplit = user?.lastname?.split(' ')
  let last = lastNameSplit[0]

  let fullName = `${last} ${first}`

  return fullName
}

const hidenEmail = (email: string) => {
  if (!email) return ''
  const [username, domain]: any = email.split('@')
  const maskedUsername = username.slice(0, 2) + '*****'
  const maskedEmail = maskedUsername + '@' + domain
  return maskedEmail
}

const handleGetInfoCustomer = async () => {
  try {
    let respon: any = await graphQLClient.request(CUSTOMER_QUERIES)

    const fullName = getFullName(respon?.customer)
    const convertMail = hidenEmail(respon?.customer?.email)
    // respon.customer.email = convertMail
    return { ...respon.customer, fullName: fullName, mailHiden: convertMail }
  } catch (error) {
    console.error('Error get handleGoogleLogin: ', error)
  }
}

const handleUpdateCustomer = async (variable: any) => {
  try {
    return await graphQLClient.request(UPDATE_CUSTOMER_QUERIES, variable)
  } catch (error) {
    console.error('Error get handleGoogleLogin: ', error)
  }
}

const handleCreateAddressCustomer = async (variable: any) => {
  try {
    return await graphQLClient.request(CREATE_ADDRESS_CUSTOMER_QUERIES, variable)
  } catch (error) {
    console.error('Error get handleCreateAddressCustomer: ', error)
  }
}

const handleUpdateAddressCustomer = async (variable: any) => {
  try {
    return await graphQLClient.request(UPDATE_ADDRESS_CUSTOMER_QUERIES, variable)
  } catch (error) {
    console.error('Error get handleCreateAddressCustomer: ', error)
  }
}

const handleDeleteAddressCustomer = async (variable: any) => {
  try {
    return await graphQLClient.request(DELETE_ADDRESS_CUSTOMER_QUERIES, variable)
  } catch (error) {
    console.error('Error get handleDeleteAddressCustomer: ', error)
  }
}

const handleReqResetPassCustomer = async (variable: any) => {
  try {
    return await graphQLClient.request(REQUEST_RESET_PASSWORD_QUERIES, variable)
  } catch (error) {
    console.error('Error get handleReqResetPassCustomer: ', error)
  }
}

const handleResetPassCustomer = async (variable: any) => {
  try {
    return await graphQLClient.request(RESET_PASSWORD_QUERIES, variable)
  } catch (error) {
    console.error('Error get handleResetPassCustomer: ', error)
  }
}

const authenApi = {
  SignUp: handleCreateAccount,
  SignIn: handleCustomerToken,
  SocialAuth: handleSocialAuth,
  GoogleLogin: handleGoogleLogin,
  FaceBookLogin: handleFacebookLogin,
  getInfoCustomer: handleGetInfoCustomer,
  changeCustomerPassword: handleChangePassword,
  UpdateCustomer: handleUpdateCustomer,
  CreateAddressCustomer: handleCreateAddressCustomer,
  UpdateAddressCustomer: handleUpdateAddressCustomer,
  DeleteAddressCustomer: handleDeleteAddressCustomer,
  reqResetPass: handleReqResetPassCustomer,
  ResetPass: handleResetPassCustomer,
}

export default authenApi
