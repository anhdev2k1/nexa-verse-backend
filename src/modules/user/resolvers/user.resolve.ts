import { Arg, Query } from 'type-graphql'
import { UserMutationResponse } from '~/types/User'
import { User } from '../models/user.model'

export class UserResover {
  @Query((_returns) => [UserMutationResponse])
  async getUsers() {
    return await User.find({})
  }

  @Query(() => UserMutationResponse)
  async getUser(@Arg('user_id') user_id: string) {
    return await User.find({ _id: user_id })
  }
}
