import { Arg, Args, Ctx, Mutation, Resolver } from 'type-graphql'
import { CreateWorkspaceInput, UpdateWorkspaceInput, WorkspaceResponse } from '../schemas/workspace.schema'
import throwCustomError, { ErrorTypes } from '~/helpers/error-handler.helper'
import Workspace from '../models/workspace.model'
import { OK } from '~/responseHandler/base.response'
import generateInviteLink from '~/utils/generateInviteLink'
import { Context } from '~/shared/app.type'

const secret_invite = process.env.INVITE_KEY_SECRET as string
@Resolver()
export class WorkspaceResolver {
  @Mutation((_return) => WorkspaceResponse)
  async createWorkspace(@Args() workspaceInput: CreateWorkspaceInput, @Ctx() { user }: Context) {
    if (!workspaceInput.name) throwCustomError('Name workspace must be required!', ErrorTypes.BAD_USER_INPUT)

    const workspace_link = generateInviteLink('workspace', secret_invite)

    const result = await Workspace.create({ ...workspaceInput, user: user._id, link_invite: workspace_link })

    return new OK({
      statusCode: 200,
      message: 'Create workspace was successfully!',
      metadata: result
    })
  }

  @Mutation((_return) => WorkspaceResponse)
  async updateWorkspace(@Args() workspaceInput: UpdateWorkspaceInput, @Arg('workspace_id') workspace_id: string) {
    const result = await Workspace.findOneAndUpdate({ _id: workspace_id }, workspaceInput)

    return new OK({
      statusCode: 200,
      message: 'Update workspace was successfully!',
      metadata: result
    })
  }

  @Mutation((_return) => WorkspaceResponse)
  async deleteWorkspace(@Arg('workspace_id') workspace_id: string) {
    const result = await Workspace.findOneAndUpdate({ _id: workspace_id }, { $set: { isDelete: 1 } })

    return new OK({
      statusCode: 200,
      message: 'Delete workspace was successfully!',
      metadata: result
    })
  }

  @Mutation((_return) => WorkspaceResponse)
  async createInviteLinkWorkspace(@Arg('workspace_id') workspace_id: string) {
    const newInviteLink = generateInviteLink('workspace', secret_invite)
    const result = await Workspace.findOneAndUpdate({ _id: workspace_id }, { $set: { link_invite: newInviteLink } })

    return new OK({
      statusCode: 200,
      message: 'Create workspace link was successfully!',
      metadata: result
    })
  }
}
