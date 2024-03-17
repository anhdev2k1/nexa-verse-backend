import { gql } from 'apollo-server-express'

const typeDefs = gql`
  type Thought {
    id: ID!
    content: String!
  }

  type Query {
    thoughts: String!
  }

  type Mutation {
    createThought(content: String!): Thought!
  }
`
export default typeDefs
