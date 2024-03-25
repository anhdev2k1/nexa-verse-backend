import { Field, Int, InterfaceType } from 'type-graphql'

@InterfaceType()
export class MutationResponse {
  @Field()
  message: string
  @Field((type) => Int)
  statusCode: number
  @Field()
  status?: string
}
