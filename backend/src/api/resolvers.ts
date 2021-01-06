const resolvers: any = {
    Query: {
        layers: (_, __, { dataSources }) =>
            dataSources.layerAPI.getLayers(),
        points: (_, { layerIDs, timestart, timeend }, { dataSources }) =>
            dataSources.layerAPI.getPoints(layerIDs, timestart, timeend)
    },
    Mutation: {
        addLayer: (_, { title, time_enabled, lat, lon, time_start, time_end }, { dataSources }) =>
            dataSources.layerAPI.addLayer(title, time_enabled, lat, lon, time_start, time_end),
        addPoint: (_, { layerID, lat, lon, timestamp }, { dataSources }) =>
            dataSources.layerAPI.addPoint(layerID, lat, lon, timestamp)
    }
}

export default resolvers
