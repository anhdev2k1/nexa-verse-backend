import { Request, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import lodash from 'lodash'
import { Document } from 'mongoose'
import { Types } from 'mongoose'
import { Field, Int, InterfaceType } from 'type-graphql'
import { ReasonPhrases } from '~/responseHandler/reasonPhrases'
import { StatusCodes } from '~/responseHandler/statusCodes'
import { User } from '~/modules/user/schemas/user.schema'
export type SelectOptions<T> = {
  [K in keyof T]: number
}
export interface JWTResponse extends Pick<JwtPayload, 'iat' | 'exp'> {
  user_id: string
  email: string
}
// eslint-disable-next-line @typescript-eslint/ban-types
export type Doc<T, K> = (Document<unknown, {}, T> & Omit<T & { _id: Types.ObjectId }, keyof K> & K) | null

interface IGetInfoParams<T> {
  fields: string[]
  object: T
}

export const getInfodata = <T>({ fields, object }: IGetInfoParams<T>) => {
  return lodash.pick(object, fields)
}

export type Context = {
  req: Request
  res: Response
  user: User
}

@InterfaceType()
export class IResultRes {
  @Field()
  message?: string

  @Field(() => Int)
  statusCode?: StatusCodes | number

  reasonStatusCode?: ReasonPhrases | string

  metadata?: any
}
