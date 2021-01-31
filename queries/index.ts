import { DocumentNode, gql } from "@apollo/client";

const ADD_POINT: DocumentNode = gql`
  mutation AddPoint(
    $layerID: ID!
    $lat: Float!
    $lon: Float!
    $timestamp: Int
  ) {
    addPoint(layerID: $layerID, lat: $lat, lon: $lon, timestamp: $timestamp) {
      success
    }
  }
`;

const ADD_LAYER: DocumentNode = gql`
  mutation AddLayer(
    $title: String!
    $time_enabled: Int!
    $lat: Float!
    $lon: Float!
    $time_start: Int
    $time_end: Int
  ) {
    addLayer(title: $title
      time_enabled: $time_enabled
      lat: $lat
      lon: $lon
      time_start: $time_start
      time_end: $time_end
    ) {
      success
      id
    }
  }
`;

const GET_POINTS: DocumentNode = gql`
  query GetPoints($layerIDs: [ID]!, $timestart: Int, $timeend: Int) {
    points(layerIDs: $layerIDs, timestart: $timestart, timeend: $timeend) {
      id
      lat
      lon
      timestamp
    }
  }
`;

const GET_LAYERS: DocumentNode = gql`
  query GetLayers {
    layers {
      id
      title
      time_enabled
      lat
      lon
      timestart
      timeend
    }
  }
`;

export { ADD_LAYER, ADD_POINT, GET_LAYERS, GET_POINTS };
