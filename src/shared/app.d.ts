import lodash from 'lodash'
export type SelectOptions<T> = {
  [K in keyof T]: number
}

export type Doc<T, K> = (Document<unknown, object, T> & Omit<T & { _id: Types.ObjectId }, keyof K> & K) | null

interface IGetInfoParams<T> {
  fields: string[]
  object: T
}

export const getInfodata = <T>({ fields, object }: IGetInfoParams<T>) => {
  return lodash.pick(object, fields)
}
