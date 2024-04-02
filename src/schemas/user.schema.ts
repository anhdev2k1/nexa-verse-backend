import { ObjectId } from 'mongodb'
import { Field, ID, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class UserProfile {
  @Field(() => ID)
  _id?: ObjectId

  @Field()
  full_name: string

  @Field({ nullable: true })
  mention: string

  @Field({ nullable: true })
  avatar: string

  @Field({ nullable: true })
  bio: string

  @Field(() => Int)
  isDelete: number
}

@ObjectType()
export class User {
  @Field(() => ID)
  _id?: ObjectId

  @Field()
  email: string

  @Field()
  password: string

  @Field(() => UserProfile)
  user_profile: UserProfile

  @Field(() => Int)
  isDelete: number
}
