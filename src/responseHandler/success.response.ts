import { Response } from 'express'
import { StatusCodes } from './statusCodes'
import { ReasonPhrases } from './reasonPhrases'

interface IResultRes {
  message?: string
  statusCode?: StatusCodes | number
  reasonStatusCode?: ReasonPhrases | string
  metadata?: any
}

export class SuccessResponse {
  private message: string
  private status: string
  private statusCode: number
  private metadata: any

  constructor({ message, statusCode = StatusCodes.OK, reasonStatusCode = ReasonPhrases.OK, metadata }: IResultRes) {
    this.status = 'success'
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

export class OK extends SuccessResponse {
  constructor({ message, metadata }: IResultRes) {
    super({ message: message, metadata: metadata })
  }
}

export class CREATED extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.CREATED,
    reasonStatusCode = ReasonPhrases.CREATED,
    metadata
  }: IResultRes) {
    super({ message, statusCode, reasonStatusCode, metadata })
  }
}

export class NOCONTENT extends SuccessResponse {
  constructor({
    message,
    statusCode = StatusCodes.NO_CONTENT,
    reasonStatusCode = ReasonPhrases.NO_CONTENT,
    metadata
  }: IResultRes) {
    super({ message, statusCode, reasonStatusCode, metadata })
  }
}
