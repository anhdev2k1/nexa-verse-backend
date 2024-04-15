/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/no-namespace */
import express, { static as static_ } from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import '~/configs/db'
import { buildSchema } from 'type-graphql'
import http from 'http'
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
import { Server } from 'socket.io'
import context from './middlewares/verifyToken'
import { socketInstance } from './socket'
import { AuthResolver } from './modules/auth/resolvers/auth.resolve'
import { WorkspaceResolver } from './modules/workspace/resolvers/workspace.resolve'
dotenv.config()

const PORT = process.env.PORT || 8080
const app = express() as any
const httpServer = http.createServer(app)

//@Create socket server
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    credentials: true
  },
  connectionStateRecovery: {}
})

global.__basedir = __dirname
global.__io = io
declare global {
  namespace globalThis {
    var __basedir: string
    var __io: Server
  }
}

app.use(cors({ credentials: true }))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/assets/images', static_('./src/assets/images'))
//@Socket instance
socketInstance()

//@Create apollo server
const startApolloServer = async () => {
  const server = new ApolloServer({
    schema: await buildSchema({
      validate: false,
      resolvers: [AuthResolver, WorkspaceResolver]
    }),
    context: context,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  })

  await server.start()
  server.applyMiddleware({ app })

  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}!`)
    console.log(`🚀 Using GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
  })
}

startApolloServer()
