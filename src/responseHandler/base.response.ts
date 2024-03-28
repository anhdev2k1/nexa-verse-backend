import { Response } from 'express'
import { StatusCodes } from './statusCodes'
import { ReasonPhrases } from './reasonPhrases'

export interface IResultRes {
  status?: 'error' | 'success'
  message?: string
  statusCode?: StatusCodes | number
  reasonStatusCode?: ReasonPhrases | string
  metadata?: any
}

export class BaseResponse {
  private message: string
  private status: string
  private statusCode: number
  private metadata: any

  constructor({
    status = 'success',
    message,
    statusCode = StatusCodes.OK,
    reasonStatusCode = ReasonPhrases.OK,
    metadata
  }: IResultRes) {
    this.status = status ?? StatusCodes.OK
    this.message = message ?? reasonStatusCode
    this.statusCode = statusCode ?? StatusCodes.OK
    this.metadata = metadata ?? {}
  }

  send(res: Response, headers: object = {}) {
    return res.status(this.statusCode).json({
      message: this.message,
      status: this.status,
      statusCode: this.statusCode,
      metadata: this.metadata
    })
  }
}

export class OK extends BaseResponse {
  constructor({ message, metadata }: IResultRes) {
    super({ message: message, metadata: metadata })
  }
}

export class CREATED extends BaseResponse {
  constructor({
    message,
    statusCode = StatusCodes.CREATED,
    reasonStatusCode = ReasonPhrases.CREATED,
    metadata
  }: IResultRes) {
    super({ message, statusCode, reasonStatusCode, metadata })
  }
}

export class NOCONTENT extends BaseResponse {
  constructor({
    message,
    statusCode = StatusCodes.NO_CONTENT,
    reasonStatusCode = ReasonPhrases.NO_CONTENT,
    metadata
  }: IResultRes) {
    super({ message, statusCode, reasonStatusCode, metadata })
  }
}

export class BAD_REQUEST extends BaseResponse {
  constructor({
    message,
    statusCode = StatusCodes.BAD_REQUEST,
    reasonStatusCode = ReasonPhrases.BAD_REQUEST,
    metadata,
    status
  }: IResultRes) {
    super({ message, statusCode, reasonStatusCode, metadata, status })
  }
}
export class AUTH_FAILED extends BaseResponse {
  constructor({
    message,
    statusCode = StatusCodes.UNAUTHORIZED,
    reasonStatusCode = ReasonPhrases.UNAUTHORIZED,
    metadata,
    status = 'error'
  }: IResultRes) {
    super({ message, statusCode, reasonStatusCode, metadata, status })
  }
}

export class NOT_FOUND extends BaseResponse {
  constructor({
    message,
    statusCode = StatusCodes.NOT_FOUND,
    reasonStatusCode = ReasonPhrases.NOT_FOUND,
    metadata,
    status = 'error'
  }: IResultRes) {
    super({ message, statusCode, reasonStatusCode, metadata, status })
  }
}

export class FORBIDDEN extends BaseResponse {
  constructor({
    message,
    statusCode = StatusCodes.FORBIDDEN,
    reasonStatusCode = ReasonPhrases.FORBIDDEN,
    metadata,
    status = 'error'
  }: IResultRes) {
    super({ message, statusCode, reasonStatusCode, metadata, status })
  }
}
