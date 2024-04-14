import { ObjectId } from 'mongodb'
import { Field, ID, Int, ObjectType } from 'type-graphql'
import { User } from '~/modules/user/schemas/user.schema'

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

  @Field(() => [ID])
  members: [ObjectId]

  @Field()
  link_invite: string

  @Field({ nullable: true })
  description: string

  @Field()
  rooms: string

  @Field({ defaultValue: 'public' })
  status: string

  @Field(() => Int)
  isDelete: number
}
