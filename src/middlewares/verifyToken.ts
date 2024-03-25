import { verifyAccessToken } from '~/utils/jwt.util'
export const authMiddleware = async (req: any) => {
  let token = req.body.token || req.query.token || req.headers.authorization
  if (req.headers.authorization) {
    token = token.split(' ').pop().trim()
  }

  if (!token) {
    return req
  }

  try {
    const userData = verifyAccessToken(token)
    req.user = userData
  } catch {
    console.log('Invalid token')
  }

  return req
}
