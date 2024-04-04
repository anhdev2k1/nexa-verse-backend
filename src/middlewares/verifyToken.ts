import throwCustomError, { ErrorTypes } from '~/helpers/error-handler.helper'
import { verifyAccessToken } from '~/utils/jwt.util'
import { Request, Response } from 'express'

const getUser = (token: string) => {
  if (token) {
    try {
      const user = verifyAccessToken(token)
      return user
    } catch (error) {
      return null
    }
  }
}

const context = async ({ req, res }: { req: Request; res: Response }) => {
  if (req.body.operationName === 'IntrospectionQuery') {
    return { req, res }
  }
  // allowing the 'signUp' and 'signIn' queries to pass without giving the token
  if (
    req.body.operationName === 'signUp' ||
    req.body.operationName === 'signIn' ||
    req.body.operationName === 'checkRefreshToken'
  ) {
    return { req, res }
  }

  // get the user token from the headers
  let token = req.body.token || req.query.token || req.headers.authorization

  if (req.headers.authorization) {
    token = token.split(' ')[1]
  }

  const user = getUser(token)

  if (!user) {
    throwCustomError('User is not Authenticated', ErrorTypes.UNAUTHENTICATED)
  }
  return { user, res }
}

export default context
