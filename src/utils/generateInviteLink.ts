export default function generateInviteLink(typeInvite: string, secretKey: string) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const inviteCode = [...Array(15)].map(() => characters.charAt(Math.floor(Math.random() * characters.length))).join('')

  const combinedString = inviteCode + secretKey
  const hexEncodedString = Array.from(combinedString, (char) => char.charCodeAt(0).toString(16)).join('')

  return `${process.env.HOST}/${typeInvite}/invite/` + hexEncodedString.substring(0, 15)
}
