import type { AccessTokenData, LoginData, RefreshData } from './types'
import { api, request } from './net'
import jwt from 'jsonwebtoken'
import { UnauthorizedError } from './errors'

export class EasyPowerAuthentication {
  private accessToken: string | null = null
  private refreshToken: string | null = null
  private userId: string | null = null

  constructor() {}

  async login(username: string, password: string) {
    const data = await request<LoginData>(
      api.post(`api/token/generateToken/user/login`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          username,
          password,
          app_id: '4029817264d4821d0164d4821dd80015',
          app_secret: 'EZAd2023'
        }).toString()
      })
    )

    this.accessToken = data.access_token
    this.refreshToken = data.refresh_token
    this.userId = data.user_id
  }

  async logout() {
    this.accessToken = null
    this.refreshToken = null
    this.userId = null
  }

  async getAccessToken() {
    if (!this.accessToken) throw new UnauthorizedError()
    const decoded = (await jwt.decode(this.accessToken)) as AccessTokenData
    const expiryData = new Date(decoded.exp * 1000)
    if (expiryData < new Date()) {
      await this.refreshAccessToken()
    }
    return this.accessToken
  }

  async refreshAccessToken() {
    const data = await request<RefreshData>(
      api.post(`api/token/refreshToken`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          refresh_token: this.refreshToken!
        }).toString()
      })
    )

    this.accessToken = data.access_token
  }

  async getAuthedApi() {
    return api.extend({
      headers: {
        Authorization: `Bearer ${await this.getAccessToken()}`
      }
    })
  }

  getUserId() {
    return this.userId
  }
}
