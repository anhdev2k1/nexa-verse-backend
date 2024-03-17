import express, { Request } from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import typeDefs from './schemas/typeDefs'
import resolvers from './schemas/resolvers'
import './configs/db'
import { authMiddleware } from './middlewares/verifyToken'
dotenv.config()

const PORT = process.env.PORT || 5000
const app = express() as any
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware
})

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true
  })
)
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const startApolloServer = async () => {
  await server.start()
  server.applyMiddleware({ app })

  app.listen(PORT, () => {
    console.log(`🚀 API server running on port ${PORT}!`)
    console.log(`🚀 Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
  })
}

startApolloServer()
