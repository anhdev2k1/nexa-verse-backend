import { ClassType, Field, Int, InterfaceType, ObjectType } from 'type-graphql'

// @InterfaceType()
// export class MutationResponse {
//   @Field()
//   message: string

//   @Field(() => Int)
//   statusCode: number

//   @Field()
//   status?: string
// }

export default function MutationResponse<TData>(TItemClass: ClassType<TData>) {
  @ObjectType({ isAbstract: true })
  abstract class MutationResponseClass {
    @Field()
    message: string

    @Field(() => Int)
    statusCode: number

    @Field()
    status?: string

    @Field(() => TItemClass, { nullable: true })
    metadata?: TData
  }

  return MutationResponseClass
}
