import { Schema } from 'mongoose'
import db from '~/configs/db'
import { Room as IRoom } from '~/modules/room/schemas/room.schema'

const DOCUMENT_ROOM_NAME = 'Room'
const COLLECTION_ROOM_NAME = 'Rooms'

const roomSchema = new Schema<IRoom>(
  {
    name: {
      type: String
    },
    status: {
      type: String
    },
    type: {
      type: String
    },
    workspace: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace'
    },
    isDelete: {
      type: Number,
      default: 0
    }
  },
  {
    collection: COLLECTION_ROOM_NAME,
    timestamps: true
  }
)

const Room = db.model(DOCUMENT_ROOM_NAME, roomSchema)

export default Room
