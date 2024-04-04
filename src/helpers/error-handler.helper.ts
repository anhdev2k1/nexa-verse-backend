import { ApolloServerErrorCode } from '@apollo/server/errors'
import { GraphQLError } from 'graphql'

interface ErrorType {
  errorCode: string | ApolloServerErrorCode
  errorStatus: number
}

export const ErrorTypes = {
  BAD_USER_INPUT: {
    errorCode: ApolloServerErrorCode.BAD_USER_INPUT,
    errorStatus: 400
  },
  BAD_REQUEST: {
    errorCode: ApolloServerErrorCode.BAD_REQUEST,
    errorStatus: 400
  },
  NOT_FOUND: {
    errorCode: 'NOT_FOUND',
    errorStatus: 404
  },
  UNAUTHENTICATED: {
    errorCode: 'UNAUTHENTICATED',
    errorStatus: 401
  },
  ALREADY_EXISTS: {
    errorCode: 'ALREADY_EXISTS',
    errorStatus: 400
  },
  INTERNAL_SERVER_ERROR: {
    errorCode: ApolloServerErrorCode.INTERNAL_SERVER_ERROR,
    errorStatus: 500
  }
}

// throwCustomError function
const throwCustomError = (errorMessage: string, errorType: ErrorType): never => {
  throw new GraphQLError(errorMessage, undefined, undefined, undefined, undefined, undefined, {
    code: errorType.errorCode,
    http: {
      status: errorType.errorStatus
    }
  })
}

export default throwCustomError
