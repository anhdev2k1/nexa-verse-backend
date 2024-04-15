export const getAvatarUrl = (name: string) => {
  return `${process.env.HOST}/api/assets/images/${name}`
}
