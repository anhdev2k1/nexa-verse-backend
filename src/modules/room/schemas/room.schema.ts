import { ObjectId } from 'mongodb'
import { Field, ID, Int, ObjectType } from 'type-graphql'
import { Workspace } from '~/modules/workspace/schemas/workspace.schema'

@ObjectType()
export class Room {
  @Field(() => ID)
  _id?: ObjectId

  @Field()
  name: string

  @Field(() => Workspace)
  workspace: Workspace

  @Field({ defaultValue: 'text' })
  type: string

  @Field({ defaultValue: 'public' })
  status: string

  @Field(() => Int)
  isDelete: number
}
