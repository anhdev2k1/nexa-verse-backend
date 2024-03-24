import express from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import './configs/db'
import { buildSchema } from 'type-graphql'
import { UserResolver } from './resolvers/user.resolve'

dotenv.config()

const PORT = process.env.PORT || 5000
const app = express() as any

app.use(cors())
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const startApolloServer = async () => {
  const server = new ApolloServer({
    schema: await buildSchema({
      validate: false,
      resolvers: [UserResolver]
    })
    // context: authMiddleware,
  })

  await server.start()
  server.applyMiddleware({ app })

  app.listen(PORT, () => {
    console.log(`🚀 API server running on port ${PORT}!`)
    console.log(`🚀 Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
  })
}

startApolloServer()
