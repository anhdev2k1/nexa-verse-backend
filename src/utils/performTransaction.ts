import { ClientSession } from 'mongoose'
import db from '~/configs/db'

type OperationsFunction = (session: ClientSession) => Promise<any>

export const performTransaction = async <T>(operation: OperationsFunction) => {
  let result
  await db.transaction(async (session) => {
    result = await operation(session)
  })
  return result as T
}
