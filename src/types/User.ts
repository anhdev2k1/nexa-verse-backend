import { User } from '~/modules/user/schemas/user.schema'
import { Model } from 'mongoose'
import { Doc, SelectOptions } from '~/shared/app.type'
// @ObjectType({ implements: MutationResponse })
// export class UserMutationResponse implements MutationResponse {
//   message: string
//   status?: string

//   @Field(() => Int)
//   statusCode: number

//   @Field({ nullable: true })
//   metadata?: UserWithToken
// }

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
  authTokenField: IGenerateTokensResult
}

export interface IFindByEmailParams {
  email: string
  selectOptions?: SelectOptions<User>
}
export interface IUserModel<T> extends Model<T, object, IUserMethods> {
  findByEmail({ email, selectOptions }: IFindByEmailParams): Promise<IUserDoc>
}
