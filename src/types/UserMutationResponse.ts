import { User } from '~/schemas/user.schema'
import { MutationResponse } from './MutationResponse'
import { Field, ObjectType } from 'type-graphql'

@ObjectType({ implements: MutationResponse })
export class UserMutationResponse implements MutationResponse {
  message?: string
  status: string
  status_code: number

  @Field({ nullable: true })
  user?: User

  @Field({ nullable: true })
  accessToken?: string
}
