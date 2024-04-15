import { ObjectId } from 'mongodb'
import { Field, ID, Int, ObjectType } from 'type-graphql'
import MutationResponse from '~/types/MutationResponse'

@ObjectType()
export class UserProfile {
  @Field(() => ID)
  _id?: ObjectId

  @Field()
  full_name: string

  @Field({ nullable: true })
  picture: string

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

  @Field({ nullable: true })
  password: string

  @Field(() => UserProfile)
  user_profile: UserProfile

  @Field(() => Int)
  isDelete: number
}

@ObjectType()
export class UserWithToken {
  @Field(() => User)
  user: User

  @Field({ nullable: true })
  access_token: string

  @Field({ nullable: true })
  refresh_token: string
}
@ObjectType()
export class UserMutationResponse extends MutationResponse(UserWithToken) {}
