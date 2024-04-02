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
import { bcryptUtil } from '~/utils/bcrypt.util'
import throwCustomError, { ErrorTypes } from '~/helpers/error-handler.helper'
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
  @Query((_returns) => [UserMutationResponse])
  async getUsers() {
    return await User.find({})
  }

  @Query((_returns) => UserMutationResponse)
  async getUser(@Arg('user_id') user_id: string) {
    return await User.find({ _id: user_id })
  }

  @Mutation((_return) => UserMutationResponse)
  async googleAuth(@Arg('idToken', () => String) idToken: string, @Ctx() { res }: Context) {
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

    const result = this.sendTokenToClient({ Doc: user, fields: ['email', 'user_profile'] }, res)
    return new OK({
      statusCode: 200,
      message: 'Sign in with Google was successfully!',
      metadata: result.user
    })
  }

  @Mutation((_return) => UserMutationResponse)
  async signIn(@Args() { email, password }: SigninParams, @Ctx() { res }: Context) {
    const foundUser = await User.findByEmail({ email })

    if (!foundUser) throwCustomError('This user is not registerd', ErrorTypes.BAD_REQUEST)

    const isMatchPassword = await foundUser?.isMatchPassword(password)
    if (!isMatchPassword) throwCustomError('Password is not correct', ErrorTypes.BAD_REQUEST)

    const result = this.sendTokenToClient({ Doc: foundUser!, fields: ['email', 'user_profile'] }, res)
    return new OK({
      status: 'success',
      statusCode: 200,
      message: 'Sign in was successfully!',
      metadata: result.user
    })
  }

  @Mutation((_return) => UserMutationResponse)
  async signUp(@Args() { full_name, email, password }: SignUpParams, @Ctx() { res }: Context) {
    const result = (await performTransaction(async (session) => {
      const foundUser = await User.findByEmail({ email })

      if (foundUser) throwCustomError('Email is already Registered', ErrorTypes.ALREADY_EXISTS)

      const [newUserProfile] = await UserProfile.create([{ full_name }], { session })

      const hashPassword = await bcryptUtil.generatePassword(password)
      const [newUser] = await User.create(
        [
          {
            email,
            password: hashPassword,
            user_profile: newUserProfile._id
          }
        ],
        { session }
      )
      return this.sendTokenToClient({ Doc: newUser, fields: ['_id', 'email', 'user_profile'] }, res)
    })) as any

    return new CREATED({
      status: 'success',
      message: 'Sign up was successful!',
      metadata: result
    })
  }

  @Mutation((_return) => UserMutationResponse)
  async getMe(@Ctx() context: Context) {
    const { user, res } = context
    const foundUser = await User.findOne({ email: user.email })
    if (!foundUser) throwCustomError('User is not exits', ErrorTypes.BAD_REQUEST)

    const result = this.sendTokenToClient<IUserDoc>(
      {
        Doc: foundUser!,
        fields: ['_id', 'email', 'user_profile']
      },
      res
    )
    return new OK({
      status: 'success',
      message: 'Get current user was successfully!',
      metadata: result,
      statusCode: 200
    })
  }

  @Mutation((_return) => UserMutationResponse)
  async logOut(res: Response) {
    res.clearCookie(FieldToken.ACCESS_TOKEN)
    res.clearCookie(FieldToken.REFRESH_TOKEN)

    return new OK({
      status: 'success',
      message: 'Logout was successfully!',
      metadata: null,
      statusCode: 200
    })
  }

  sendTokenToClient<T extends IUserDoc>({ Doc, fields }: ISendResToClient<T>, res: Response) {
    const { accessToken, accessTokenLifeTime, refreshToken, refreshTokenLifeTime } = Doc.generateTokens()

    sendAccessTokenToCookie(res, accessToken, accessTokenLifeTime)
    sendRefreshTokenToCookie(res, refreshToken, refreshTokenLifeTime)
    return {
      user: getInfodata({
        fields,
        object: Doc
      }),
      access_token: accessToken,
      refresh_token: refreshToken
    }
  }
}
