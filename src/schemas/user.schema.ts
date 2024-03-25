import { Field, ID, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class UserProfile {
  @Field()
  full_name: string

  @Field({ nullable: true })
  mention: string

  @Field({ nullable: true })
  avatar: string

  @Field({ nullable: true })
  bio: string

  @Field((type) => Int)
  isDelete: number
}

@ObjectType()
export class User {
  @Field()
  email: string

  @Field()
  password: string

  @Field((type) => UserProfile)
  user_profile: UserProfile

  @Field((type) => Int)
  isDelete: number
}
