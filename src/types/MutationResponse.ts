import { Field, Int, InterfaceType } from 'type-graphql'

@InterfaceType()
export class MutationResponse {
  @Field()
  status: string
  @Field((type) => Int)
  status_code: number
  @Field({ nullable: true })
  message?: string
}
