import { ReasonPhrases } from './reasonPhrases'
import { StatusCodes } from './statusCodes'

export class ErrorResponse extends Error {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message)
  }
}

export class ConflictRequestError extends ErrorResponse {
  constructor(
    message: ReasonPhrases | string = ReasonPhrases.CONFLICT,
    statusCode: StatusCodes = StatusCodes.CONFLICT
  ) {
    super(message, statusCode)
  }
}

export class BadRequestError extends ErrorResponse {
  constructor(
    message: ReasonPhrases | string = ReasonPhrases.BAD_REQUEST,
    statusCode: StatusCodes = StatusCodes.BAD_REQUEST
  ) {
    super(message, statusCode)
  }
}

export class AuthFailureError extends ErrorResponse {
  constructor(
    message: ReasonPhrases | string = ReasonPhrases.UNAUTHORIZED,
    statusCode: StatusCodes = StatusCodes.UNAUTHORIZED
  ) {
    super(message, statusCode)
  }
}

export class NotFoundError extends ErrorResponse {
  constructor(
    message: ReasonPhrases | string = ReasonPhrases.NOT_FOUND,
    statusCode: StatusCodes = StatusCodes.NOT_FOUND
  ) {
    super(message, statusCode)
  }
}

export class ForbiddenError extends ErrorResponse {
  constructor(
    message: ReasonPhrases | string = ReasonPhrases.FORBIDDEN,
    statusCode: StatusCodes = StatusCodes.FORBIDDEN
  ) {
    super(message, statusCode)
  }
}
