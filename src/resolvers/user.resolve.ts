import 'reflect-metadata'
import { LoginTicket, OAuth2Client } from 'google-auth-library'
import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql'
import { UserMutationResponse } from '~/types/UserMutationResponse'
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

@Resolver()
export class UserResolver {
  @Query((_returns) => String)
  hello(): string {
    return 'Hello, World!'
  }
  @Mutation((_return) => UserMutationResponse)
  async googleAuth(@Arg('idToken', (type) => String) idToken: string): Promise<UserMutationResponse> {
    try {
      const user_info = (await client.verifyIdToken({
        idToken: idToken,
        audience: client._clientId
      })) as any
      return {
        status: 'success',
        status_code: 200,
        message: 'Auth Successfully'
      }
    } catch (error) {
      return {
        status: 'error',
        status_code: 400,
        message: 'Auth Failed'
      }
    }
  }
}
