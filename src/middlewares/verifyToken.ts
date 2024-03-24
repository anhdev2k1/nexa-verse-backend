import jwt from 'jsonwebtoken'
import { TypeSecret } from '~/constants'
export const authMiddleware = async (req: any) => {
  let token = req.body.token || req.query.token || req.headers.authorization
  if (req.headers.authorization) {
    token = token.split(' ').pop().trim()
  }

  if (!token) {
    return req
  }

  try {
    const userData = jwt.verify(token, TypeSecret.SECRET_KEY, { maxAge: TypeSecret.EXPIRIED })
    req.user = userData
  } catch {
    console.log('Invalid token')
  }

  return req
}
