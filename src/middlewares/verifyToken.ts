import throwCustomError, { ErrorTypes } from '~/helpers/error-handler.helper'
import { verifyAccessToken } from '~/utils/jwt.util'
import { Request, Response } from 'express'

const getUser = async (token: string) => {
  try {
    if (token) {
      const user = verifyAccessToken(token)
      return user
    }
    return null
  } catch (error) {
    return null
  }
}

const context = async ({ req, res }: { req: Request; res: Response }) => {
  if (req.body.operationName === 'IntrospectionQuery') {
    return { req, res }
  }
  // allowing the 'signUp' and 'signIn' queries to pass without giving the token
  if (req.body.operationName === 'signUp' || req.body.operationName === 'signIn') {
    return { req, res }
  }

  // get the user token from the headers
  let token = req.body.token || req.query.token || req.headers.authorization
  if (req.headers.authorization) {
    token = token.split(' ')[1]
  }

  const user = await getUser(token)

  if (!user) {
    throwCustomError('User is not Authenticated', ErrorTypes.UNAUTHENTICATED)
  }
  return { user }
}

export default context
