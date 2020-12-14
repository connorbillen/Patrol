import { ApolloServer } from 'apollo-server'

import { typeDefs } from './types'
import { LayerAPI, resolvers, initDB } from './api'
import * as Database from 'better-sqlite3'

// Spin up the DB
const db: Database.Database = Database(':memory:')
initDB(db)

const server: ApolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
        layerAPI: new LayerAPI(db)
    })
});

server.listen()
.then((): void => {
    console.log('🚀 Server running on localhost:4000');
})