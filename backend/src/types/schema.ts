import { gql } from 'apollo-server'
import { DocumentNode } from 'graphql'

const typeDefs: DocumentNode = gql`
    # Schemas
    type Layer {
        id: ID!
        title: String!
        time_enabled: Int!
        lat: Float!,
        lon: Float!,
        timestart: Int
        timeend: Int
        points: [Point]
    }

    type Point {
        id: ID!
        lat: Float!
        lon: Float!
        timestamp: Int
    }

    type Query {
        layers: [Layer]!
        points(layerIDs: [ID]!, timestart: Int, timeend: Int): [Point]!
    }

    type Mutation {
        addLayer(title: String!, time_enabled: Int!, lat: Float!, lon: Float!, time_start: Int, time_end: Int): AddLayerResponse!
        addPoint(lat: Float!, lon: Float!, layerID: ID!, timestamp: Int): AddPointResponse!
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
