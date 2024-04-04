export const socketInstance = () => {
  __io.on('connection', (socket) => {
    console.log('Socket is conneting!')

    socket.on('disconect', () => {
      console.log('Socket disconnected!')
    })
  })
}
