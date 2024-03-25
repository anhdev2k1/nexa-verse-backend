import { Schema } from 'mongoose'
import validator from 'validator'
import db from '~/configs/db'
import { User as IUser, UserProfile as IUserProfile } from '~/schemas/user.schema'
import { IFindByEmailParams, IUserMethods, IUserModel } from '~/types/User'
import { bcryptUtil } from '~/utils/bcrypt.util'
import { signAccessToken, signRefreshToken } from '~/utils/jwt.util'

const DOCUMENT_USER_NAME = 'User'
const COLLECTION_USER_NAME = 'Users'

const userSchema = new Schema<IUser, IUserModel<IUser>, IUserMethods>(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      validate: [validator.isEmail, 'Email is wrong format']
    },
    password: {
      type: String,
      required: true,
      minlength: 8
    },
    user_profile: {
      type: Schema.Types.ObjectId,
      ref: 'UserProfile'
    },
    isDelete: {
      type: Number,
      default: 0
    }
  },
  {
    collection: COLLECTION_USER_NAME,
    timestamps: true
  }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  this.password = await bcryptUtil.generatePassword(this.password)
  next()
})

userSchema.method('isMatchPassword', async function isMatchPassword(passwordInputed: string) {
  return await bcryptUtil.verifyPasword(passwordInputed, this.password)
})

userSchema.method('generateTokens', async function generateTokens() {
  const payload: { user_id: string; email: string } = {
    user_id: this._id.toString(),
    email: this.email
  }

  const accessTokenLifeTimeHours = 30
  const refreshTokenLifeTimeDays = 7

  const accessToken = signAccessToken(payload)
  const refreshToken = signRefreshToken(payload)

  return {
    accessToken,
    refreshToken,
    accessTokenLifeTime: accessTokenLifeTimeHours * 60 * 1000,
    refreshTokenLifeTime: refreshTokenLifeTimeDays * 24 * 60 * 60 * 1000
  }
})

userSchema.static(
  'findByEmail',
  async function findByEmail({
    email,
    selectOptions = {
      email: 1,
      password: 1,
      user_profile: 1,
      isDelete: 1
    }
  }: IFindByEmailParams) {
    return this.findOne({ email }).select(selectOptions)
  }
)

const User = db.model<IUser, IUserModel<IUser>>(DOCUMENT_USER_NAME, userSchema)

const DOCUMENT_PROFILE_NAME = 'UserProfile'
const COLLECTION_PROFILE_NAME = 'UserProfiles'
const userProfileSchema = new Schema<IUserProfile>(
  {
    full_name: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: false
    },
    bio: {
      type: String,
      required: false
    },
    mention: {
      type: String,
      required: false
    },
    isDelete: {
      type: Number,
      default: 0
    }
  },
  {
    collection: COLLECTION_PROFILE_NAME,
    timestamps: true
  }
)

const UserProfile = db.model<IUserProfile, IUserModel<IUserProfile>>(DOCUMENT_PROFILE_NAME, userProfileSchema)

export { UserProfile, User }
