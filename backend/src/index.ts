import { ApolloServer } from 'apollo-server'
import { Database } from 'sqlite3'

import { typeDefs } from './types'
import { LayerAPI } from './api'

const db: Database = new Database('./DB.db')
const layerAPI: LayerAPI = new LayerAPI(db);
layerAPI.getLayers();

const server: ApolloServer = new ApolloServer({
    typeDefs,
    dataSources: () => ({
        layerAPI: new LayerAPI(db)
    })
});

server.listen().then((): void => {
    console.log('🚀 Server running on localhost:4000');
});
