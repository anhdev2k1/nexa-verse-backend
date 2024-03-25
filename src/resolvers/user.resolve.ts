import 'reflect-metadata'
import { OAuth2Client } from 'google-auth-library'
import { Arg, Args, ArgsType, Ctx, Field, Mutation, Query, Resolver } from 'type-graphql'
import { ISendResToClient, IUserDoc, UserMutationResponse } from '~/types/User'

import { Response } from 'express'
import { Context, IResultRes, getInfodata } from '~/shared/app.type'
import { sendAccessTokenToCookie, sendRefreshTokenToCookie } from '~/utils/cookie.util'
import { User, UserProfile } from '~/models/user.model'
import { BadRequestError, NotFoundError } from '~/responseHandler/error.response'
import { performTransaction } from '~/utils/performTransaction'
import { User as IUser } from '~/schemas/user.schema'
import { FieldToken } from '~/constants'
import { OK } from '~/responseHandler/success.response'
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

@ArgsType()
class SigninParams {
  @Field()
  email: string

  @Field()
  password: string
}

@ArgsType()
class SignUpParams implements SigninParams {
  @Field()
  email: string

  @Field()
  password: string

  @Field()
  full_name: string
}
@Resolver()
export class UserResolver {
  @Query((_returns) => String)
  hello(): string {
    return 'Hello, World!'
  }
  @Mutation((_return) => UserMutationResponse)
  async googleAuth(@Arg('idToken', (type) => String) idToken: string): Promise<UserMutationResponse> {
    try {
      const user_info = (await client.verifyIdToken({
        idToken: idToken,
        audience: client._clientId
      })) as any

      let user = await User.findByEmail({ email: user_info.email })
      if (!user) {
        const userProfile = await UserProfile.create({ full_name: user_info.name })
        user = await User.create({
          email: user_info.email,
          password: user_info.password,
          user_profile: userProfile._id.toString()
        })
      }
      return {
        status: 'success',
        statusCode: 200,
        message: 'Auth Successfully'
      }
    } catch (error) {
      return {
        status: 'error',
        statusCode: 400,
        message: 'Auth Failed'
      }
    }
  }

  @Mutation(() => IUser)
  async signIn(@Args() { email, password }: SigninParams, res: Response) {
    try {
      const foundUser = await User.findByEmail({ email })

      if (!foundUser) throw new BadRequestError('This user is not registered')

      const isMatchPassword = await foundUser.isMatchPassword(password)
      if (!isMatchPassword) throw new BadRequestError('Password is not correct')

      return this.sendResToClient({ Doc: foundUser, fields: ['_id', 'email', 'user_profile'] }, res)
    } catch (error: any) {
      throw new error()
    }
  }

  @Mutation(() => IUser)
  async signUp(@Args() { full_name, email, password }: SignUpParams, res: Response) {
    return await performTransaction(async (session) => {
      const foundUser = await User.findByEmail({ email })

      if (foundUser) throw new BadRequestError('User is already registered')

      const [newUserProfile] = await UserProfile.create([{ full_name }], { session })

      const [newUser] = await User.create(
        [
          {
            email,
            password,
            user_profile: newUserProfile._id.toString()
          }
        ],
        { session }
      )

      return this.sendResToClient({ Doc: newUser, fields: ['_id', 'email', 'user_profile'] }, res)
    })
  }

  @Mutation(() => IUser)
  async getMe(@Ctx() context: Context, res: Response) {
    const { user } = context
    const foundUser = await User.findOne({ email: user.email })
    if (!foundUser) throw new NotFoundError('User is not exist')

    return this.sendResToClient<IUserDoc>(
      {
        Doc: foundUser,
        fields: ['_id', 'email', 'user_profile']
      },
      res
    )
  }

  @Mutation(() => IResultRes)
  async Logout(res: Response) {
    res.clearCookie(FieldToken.ACCESS_TOKEN)
    res.clearCookie(FieldToken.REFRESH_TOKEN)

    return new OK({
      message: 'Logout was successfully!',
      metadata: null,
      statusCode: 200
    }).send(res)
  }

  async sendResToClient<T extends IUserDoc>({ Doc, fields }: ISendResToClient<T>, res: Response) {
    const { accessToken, accessTokenLifeTime, refreshToken, refreshTokenLifeTime } = await Doc.generateTokens()

    sendAccessTokenToCookie(res, accessToken, accessTokenLifeTime)
    sendRefreshTokenToCookie(res, refreshToken, refreshTokenLifeTime)

    return {
      user: getInfodata({
        fields,
        object: Doc
      })
    }
  }
}
