import 'reflect-metadata'
import { OAuth2Client } from 'google-auth-library'
import { Arg, Args, ArgsType, Ctx, Field, Mutation, Query, Resolver } from 'type-graphql'
import { ISendResToClient, IUserDoc, UserMutationResponse } from '~/types/User'

import { Response } from 'express'
import { Context, getInfodata } from '~/shared/app.type'
import { sendAccessTokenToCookie, sendRefreshTokenToCookie } from '~/utils/cookie.util'
import { User, UserProfile } from '~/models/user.model'
import { BadRequestError, NotFoundError } from '~/responseHandler/error.response'
import { performTransaction } from '~/utils/performTransaction'
import { FieldToken } from '~/constants'
import { BAD_REQUEST, CREATED, OK } from '~/responseHandler/base.response'
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
  async googleAuth(@Arg('idToken', () => String) idToken: string, @Ctx() { res }: Context) {
    try {
      const user_info = (
        await client.verifyIdToken({
          idToken: idToken,
          audience: client._clientId
        })
      ).getPayload()

      let user = await User.findByEmail({ email: user_info?.email as string })
      if (!user) {
        const userProfile = await UserProfile.create({ full_name: user_info?.name, picture: user_info?.picture })
        user = await User.create({
          email: user_info?.email,
          user_profile: userProfile._id
        })
      }

      const result = this.sendResToClient({ Doc: user, fields: ['email', 'user_profile'] }, res)
      return new OK({
        statusCode: 200,
        message: 'Sign in with Google was successfully!',
        metadata: result.user
      })
    } catch (error: any) {
      return new BAD_REQUEST({
        message: error.message,
        metadata: null
      })
    }
  }

  @Mutation((_return) => UserMutationResponse)
  async signIn(@Args() { email, password }: SigninParams, @Ctx() { res }: Context) {
    try {
      const foundUser = await User.findByEmail({ email })

      if (!foundUser) throw new BadRequestError('This user is not registered')

      const isMatchPassword = await foundUser.isMatchPassword(password)
      if (!isMatchPassword) throw new BadRequestError('Password is not correct')

      const result = this.sendResToClient({ Doc: foundUser, fields: ['email', 'user_profile'] }, res)
      return new OK({
        status: 'success',
        statusCode: 200,
        message: 'Sign in was successfully!',
        metadata: result.user
      })
    } catch (error: any) {
      return new BAD_REQUEST({
        message: error.message,
        metadata: null
      })
    }
  }

  @Mutation((_return) => UserMutationResponse)
  async signUp(@Args() { full_name, email, password }: SignUpParams, @Ctx() { res }: Context) {
    try {
      const result = (await performTransaction(async (session) => {
        const foundUser = await User.findByEmail({ email })

        if (foundUser) throw new BadRequestError('User is already registered')

        const [newUserProfile] = await UserProfile.create([{ full_name }], { session })

        const [newUser] = await User.create(
          [
            {
              email,
              password,
              user_profile: newUserProfile._id
            }
          ],
          { session }
        )

        return this.sendResToClient({ Doc: newUser, fields: ['_id', 'email', 'user_profile'] }, res)
      })) as any
      return new CREATED({
        status: 'success',
        message: 'Sign up was successfully!',
        metadata: result.user
      })
    } catch (error: any) {
      return new BAD_REQUEST({
        message: error.message,
        metadata: null
      }).send(res)
    }
  }

  @Mutation((_return) => UserMutationResponse)
  async getMe(@Ctx() context: Context) {
    const { user, res } = context
    try {
      const foundUser = await User.findOne({ email: user.email })
      if (!foundUser) throw new NotFoundError('User is not exist')

      const result = this.sendResToClient<IUserDoc>(
        {
          Doc: foundUser,
          fields: ['_id', 'email', 'user_profile']
        },
        res
      )
      return new OK({
        status: 'success',
        message: 'Get current user was successfully!',
        metadata: result,
        statusCode: 200
      }).send(res)
    } catch (error: any) {
      return new BAD_REQUEST({
        message: error.message,
        metadata: null
      })
    }
  }

  @Mutation((_return) => UserMutationResponse)
  async Logout(res: Response) {
    res.clearCookie(FieldToken.ACCESS_TOKEN)
    res.clearCookie(FieldToken.REFRESH_TOKEN)

    return new OK({
      status: 'success',
      message: 'Logout was successfully!',
      metadata: null,
      statusCode: 200
    }).send(res)
  }

  sendResToClient<T extends IUserDoc>({ Doc, fields }: ISendResToClient<T>, res: Response) {
    const { accessToken, accessTokenLifeTime, refreshToken, refreshTokenLifeTime } = Doc.generateTokens()

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
