import { gql } from 'apollo-server'
import { DocumentNode } from 'graphql'

const typeDefs: DocumentNode = gql`
    # Schemas
    type Layer {
        id: ID!
        title: String!
        time_enabled: Boolean!
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
        points(layerID: ID!): [Point]!
    }

    type Mutation {
        addLayer(title: String!, time_enabled: Boolean!): AddLayerResponse!
        addPoint(lat: Float!, lon: Float!, timestart: Int, timeend: Int, layerID: ID!): AddPointResponse!
    }

    type AddLayerResponse {
        success: Boolean!
        id: ID
    }

    type AddPointResponse {
        success: Boolean!
    }
`

export default typeDefs
