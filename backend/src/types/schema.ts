import { gql } from 'apollo-server'
import { DocumentNode } from 'graphql'

const typeDefs: DocumentNode = gql`
  # Schemas
  type Layer {
    id: ID!
    title: String!
    points: [Point]
  }

  type Point {
    id: ID!
    lat: Float!
    lon: Float!
    timestart: Int
    timeend: Int
  }

  type Query {
    layers: [Layer]!
    points(layerId: ID!): [Point]!
  }

  type Mutation {
    createLayer(title: String!): CreateLayerResponse!
    addPoint(layerId: ID!, lat: Float!, lon: Float!): AddPointResponse!
  }
  
  type CreateLayerResponse {
    success: Boolean!
    id: Int
  }

  type AddPointResponse {
    success: Boolean!
  }
`

export default typeDefs
