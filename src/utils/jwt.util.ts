import jwt from 'jsonwebtoken'
import { TimeExpired } from '~/constants'

const verifyAccessToken = (accesstoken: string) => {
  return jwt.verify(accesstoken, process.env.ACCESSTOKEN_SECRET as string)
}
const signAccessToken = (user: any) => {
  return jwt.sign(user, process.env.ACCESSTOKEN_SECRET as string, { expiresIn: TimeExpired.ACCESS_EXPIRED })
}

const verifyRefreshToken = (refreshtoken: string) => {
  return jwt.verify(refreshtoken, process.env.REFRESHTOKEN_SECRET as string)
}
const signRefreshToken = (user: any) => {
  return jwt.sign(user, process.env.REFRESHTOKEN_SECRET as string, { expiresIn: TimeExpired.REFRESH_EXPIRED })
}

export { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken }
