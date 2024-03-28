import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import { ApolloServer } from 'apollo-server-express'
import cors from 'cors'
import './configs/db'
import { buildSchema } from 'type-graphql'
import { UserResolver } from './resolvers/user.resolve'
import { refreshTokenRouter } from './routes/refreshtoken.route'
import { Context } from './shared/app.type'
import expressPlayground from 'graphql-playground-middleware-express'
dotenv.config()

const PORT = process.env.PORT || 8080
const app = express() as any

// app.get('/graphiql', graphqlPlaygroundMiddleware({ endpoint: '/graphql' }), () => {})
app.get('/graphql', expressPlayground({ endpoint: '/graphql' }), function (req: Request, res: Response) {
  res.end('')
})
app.use(cors({ credentials: true }))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', refreshTokenRouter)

const startApolloServer = async () => {
  const server = new ApolloServer({
    schema: await buildSchema({
      validate: false,
      resolvers: [UserResolver]
    }),
    // context: authMiddleware,
    context: ({ req, res }) => ({ req, res }),
  })

  await server.start()
  server.applyMiddleware({ app })

  app.listen(PORT, () => {
    console.log(`🚀 API server running on port ${PORT}!`)
    console.log(`🚀 Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`)
  })
}

startApolloServer()
