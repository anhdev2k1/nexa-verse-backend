import { ObjectId } from 'mongodb'
import { Schema } from 'mongoose'
import db from '~/configs/db'

const DOCUMENT_REFRESH_TOKEN_NAME = 'RefreshToken'
const COLLECTION_REFRESH_TOKEN_NAME = 'RefreshTokens'

export interface IRefreshToken {
  _id?: string
  token: string
  user_id: ObjectId
  isDelete?: number
}
const refreshTokenSchema = new Schema<IRefreshToken>(
  {
    token: {
      type: String
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    isDelete: {
      type: Number,
      default: 0
    }
  },
  {
    collection: COLLECTION_REFRESH_TOKEN_NAME,
    timestamps: true
  }
)

const RefreshToken = db.model(DOCUMENT_REFRESH_TOKEN_NAME, refreshTokenSchema)

export default RefreshToken
