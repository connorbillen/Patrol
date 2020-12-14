const resolvers: any = {
    Query: {
        layers: (_, __, { dataSources }) =>
            dataSources.layerAPI.getLayers(),
        points: (_, { layerIDs }, { dataSources }) =>
            dataSources.layerAPI.getPoints(layerIDs)
    },
    Mutation: {
        addLayer: (_, { title, time_enabled }, { dataSources }) =>
            dataSources.layerAPI.addLayer(title, time_enabled),
        addPoint: (_, { layerID, lat, lon, timestart, timeend }, { dataSources }) =>
            dataSources.layerAPI.addPoint(layerID, lat, lon, timestart, timeend)
    }
}

export default resolvers
