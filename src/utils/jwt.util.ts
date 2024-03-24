import jwt from 'jsonwebtoken'
import { TimeExpired } from '~/constants'

const { ACCESSTOKEN_SECRET, REFRESHTOKEN_SECRET } = process.env
const verifyAccessToken = (accesstoken: string) => {
  return jwt.verify(accesstoken, ACCESSTOKEN_SECRET as string)
}
const signAccessToken = (user: any) => {
  return jwt.sign(user, ACCESSTOKEN_SECRET as string, { expiresIn: TimeExpired.ACCESS_EXPIRED })
}

const verifyRefreshToken = (refreshtoken: string) => {
  return jwt.verify(refreshtoken, REFRESHTOKEN_SECRET as string)
}
const signRefreshToken = (user: any) => {
  return jwt.sign(user, REFRESHTOKEN_SECRET as string, { expiresIn: TimeExpired.REFRESH_EXPIRED })
}

export { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken }
