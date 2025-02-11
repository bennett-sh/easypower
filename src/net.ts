import ky, { type ResponsePromise } from 'ky'
import type { APIResponse } from './types'
import {
  ApiUpdatedError,
  BadCredentialsError,
  BadRefreshTokenError
} from './errors'

export const api = ky.extend({
  prefixUrl: 'https://app.api.apsystemsema.com:9223'
})

export async function request<T>(
  request: ResponsePromise<APIResponse<T>>
): Promise<T> {
  const response = await request.json()
  if ('code' in response) {
    if (response.code === 2006) throw new BadCredentialsError()
    if (response.code === 3003)
      throw new Error('Invalid data supplied: ' + JSON.stringify(response))
    if (response.code === 3004) throw new BadRefreshTokenError()
    if (response.code === 1001)
      throw new Error('Unknown error: ' + JSON.stringify(response))
  }
  if ('status' in response && response.status === 400) {
    throw new ApiUpdatedError()
  }
  if ('status' in response || ('code' in response && response.code !== 0)) {
    throw new Error(`Unknown error: ${JSON.stringify(response)}`)
  }

  return (response as any).data as T
}
