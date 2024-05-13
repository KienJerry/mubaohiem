export interface LoginReq {
  email: string
  password: string
}

export interface RegisterReq {
  email: string
  lastname: string
  firstname: string
  password: string
  rePassword: string
}

export interface TokenReq {
  access_token: string
  refresh_token: string
}

export type TokenRes = TokenReq & {
  expires_in: number
}

export interface LoginRes {
  token_type: 'Bearer'
  expires_in: number
  access_token: string
  refresh_token: string
  id: number
  name: string
  email: string
}

export interface SocialAuthReq {
  key: string
  label: string
  login_url: string
}

export interface TypeGoogleAuth {
  authuser: string
  code: string
  handle: string
  prompt: string
  scope: string
  state: string
}