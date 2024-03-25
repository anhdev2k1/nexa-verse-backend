import { User, UserProfile } from '~/schemas/user.schema'
import { Field, Int, ObjectType } from 'type-graphql'
import { Model } from 'mongoose'
import { Doc, SelectOptions } from '~/shared/app'
import { MutationResponse } from './MutationResponse'

@ObjectType({ implements: MutationResponse })
export class UserMutationResponse implements MutationResponse {
  message: string
  status?: string
  statusCode: number

  @Field({ nullable: true })
  user?: User
}

export interface IGenerateTokensResult {
  accessToken: string
  refreshToken: string
  accessTokenLifeTime: number
  refreshTokenLifeTime: number
}

export interface IUserMethods {
  isMatchPassword(passwordInputed: string): Promise<boolean>
  generateTokens(): Promise<IGenerateTokensResult>
}

export type IUserDoc = Doc<User, IUserMethods>

export interface IUserDocWithMethods extends IUserDoc, IUserMethods {}

export interface ISendResToClient<T extends IUserDocWithMethods> {
  Doc: NonNullable<T>
  fields: string[]
}

export interface IFindByEmailParams {
  email: string
  selectOptions?: SelectOptions<User>
}
export interface IUserModel<T> extends Model<T, object, IUserMethods> {
  findByEmail({ email, selectOptions }: IFindByEmailParams): Promise<IUserDoc>
}
