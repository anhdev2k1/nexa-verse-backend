import bcrypt from 'bcryptjs'

const verifyPasword = async (input: string, hash: string): Promise<boolean> => bcrypt.compare(input, hash)

const generatePassword = async (input: string, rounds = 14): Promise<string> => bcrypt.hash(input, rounds)

export const bcryptUtil = {
  verifyPasword,
  generatePassword
}
