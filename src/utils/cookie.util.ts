import { Response } from 'express'
import { FieldToken } from '~/constants'

export const sendAccessTokenToCookie = (res: Response, accessToken: string, accessTokenLifeTime: number) => {
  res.cookie(FieldToken.ACCESS_TOKEN, accessToken, {
    httpOnly: false,
    maxAge: accessTokenLifeTime,
    sameSite: 'lax',
    secure: true
  })
}

export const sendRefreshTokenToCookie = (res: Response, refreshToken: string, refreshTokenLifeTime: number) => {
  res.cookie(FieldToken.REFRESH_TOKEN, refreshToken, {
    httpOnly: false,
    maxAge: refreshTokenLifeTime,
    sameSite: 'lax',
    secure: true
  })
}
