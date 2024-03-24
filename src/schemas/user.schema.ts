import { Field, ID, Int, ObjectType } from 'type-graphql'

@ObjectType()
export class UserProfile {
  @Field((type) => ID)
  id: string

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
  @Field((type) => ID)
  id: string

  @Field()
  email: string

  @Field()
  password: string

  @Field((type) => [UserProfile])
  user_profile: UserProfile[]

  @Field((type) => Int)
  isDelete: number
}
