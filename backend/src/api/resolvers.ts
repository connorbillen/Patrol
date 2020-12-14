const resolvers: any = {
    Query: {
        layers: (_, __, { dataSources }) =>
            dataSources.layerAPI.getLayers(),
        points: (_, { layerID }, { dataSources }) =>
            dataSources.layerAPI.getPoints(layerID)
    },
    Mutation: {
        addLayer: (_, { title, time_enabled }, { dataSources }) =>
            dataSources.layerAPI.addLayer(title, time_enabled),
        addPoint: (_, { layerID, lat, lon, timestart, timeend }, { dataSources }) =>
            dataSources.layerAPI.addPoint(layerID, lat, lon, timestart, timeend)
    }
}

export default resolvers
