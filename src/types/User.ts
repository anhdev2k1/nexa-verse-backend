import { User, UserProfile } from '~/schemas/user.schema'
import { Field, Int, ObjectType } from 'type-graphql'
import { Model } from 'mongoose'
import { Doc, SelectOptions } from '~/shared/app.type'
import { MutationResponse } from './MutationResponse'

@ObjectType()
export class UserWithToken {
  @Field(() => User)
  user: User

  @Field({ nullable: true })
  access_token: string

  @Field({ nullable: true })
  refresh_token: string
}
@ObjectType({ implements: MutationResponse })
export class UserMutationResponse implements MutationResponse {
  message: string
  status?: string

  @Field(() => Int)
  statusCode: number

  @Field({ nullable: true })
  metadata?: UserWithToken
}

export interface IGenerateTokensResult {
  accessToken: string
  refreshToken: string
  accessTokenLifeTime: number
  refreshTokenLifeTime: number
}

export interface IUserMethods {
  isMatchPassword(passwordInputed: string): Promise<boolean>
  generateTokens(): IGenerateTokensResult
}

export type IUserDoc = Doc<User, IUserMethods>

// export interface IUserDocWithMethods & IUserDoc, IUserMethods {}

export interface ISendResToClient<T extends IUserDoc> {
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
