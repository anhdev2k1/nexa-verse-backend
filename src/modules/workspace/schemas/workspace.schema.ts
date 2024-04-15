import { ObjectId } from 'mongodb'
import { ArgsType, Field, ID, Int, ObjectType } from 'type-graphql'
import { Room } from '~/modules/room/schemas/room.schema'
import { User } from '~/modules/user/schemas/user.schema'
import { User as IUser } from '~/modules/user/schemas/user.schema'
import MutationResponse from '~/types/MutationResponse'
@ObjectType()
export class Workspace {
  @Field(() => ID)
  _id?: ObjectId

  @Field()
  name: string

  @Field(() => User)
  user: User

  @Field({ nullable: true })
  avatar: string

  @Field({ nullable: true })
  cover: string

  @Field(() => [IUser])
  members: IUser[]

  @Field()
  link_invite: string

  @Field({ nullable: true })
  description: string

  @Field(() => [Room])
  rooms: Room[]

  @Field({ defaultValue: 'public' })
  status: string

  @Field(() => Int)
  isDelete: number
}

@ObjectType()
export class WorkspaceResponse extends MutationResponse(Workspace) {}

@ArgsType()
export class CreateWorkspaceInput {
  @Field()
  name: string

  @Field({ nullable: true })
  description: string

  @Field({ nullable: true })
  cover: string
}

@ArgsType()
export class UpdateWorkspaceInput extends Workspace {}
