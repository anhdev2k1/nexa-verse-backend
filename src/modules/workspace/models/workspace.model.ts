import { Schema } from 'mongoose'
import db from '~/configs/db'
import { Workspace as IWorkspace } from '~/modules/workspace/schemas/workspace.schema'

const DOCUMENT_WORKSPACE_NAME = 'Workspace'
const COLLECTION_WORKSPACE_NAME = 'Workspaces'

const workspaceSchema = new Schema<IWorkspace>(
  {
    name: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: false
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    cover: {
      type: String,
      required: false
    },
    description: {
      type: String,
      required: false
    },
    link_invite: {
      type: String
    },
    members: {
      type: Schema.Types.Mixed,
      ref: 'User',
      default: []
    },
    rooms: {
      type: Schema.Types.Mixed,
      ref: 'Room',
      default: []
    },
    isDelete: {
      type: Number,
      default: 0
    }
  },
  {
    collection: COLLECTION_WORKSPACE_NAME,
    timestamps: true
  }
)

const Workspace = db.model(DOCUMENT_WORKSPACE_NAME, workspaceSchema)

export default Workspace
