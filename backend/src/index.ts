import { ApolloServer } from 'apollo-server'

import { typeDefs } from './types'
import { LayerAPI, resolvers, initDB } from './api'
import SQLite3 from 'better-sqlite3'

// Spin up the DB
const db: SQLite3.Database = SQLite3(':memory:')
initDB(db)

const server: ApolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    dataSources: () => ({
        layerAPI: new LayerAPI(db)
    })
})

server.listen()
.then((): void => {
    console.log('🚀 Server running on localhost:4000')
})