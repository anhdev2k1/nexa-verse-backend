import { Response } from 'express'
import { FieldToken } from '~/constants'

export const sendAccessTokenToCookie = (res: Response, accessToken: string, accessTokenLifeTime: number) => {
  res.cookie(FieldToken.ACCESS_TOKEN, accessToken, {
    httpOnly: true,
    maxAge: accessTokenLifeTime,
    secure: true,
    sameSite: 'lax'
  })
}

export const sendRefreshTokenToCookie = (res: Response, refreshToken: string, refreshTokenLifeTime: number) => {
  res.cookie(FieldToken.REFRESH_TOKEN, refreshToken, {
    httpOnly: true,
    maxAge: refreshTokenLifeTime,
    secure: true,
    sameSite: 'lax'
  })
}
