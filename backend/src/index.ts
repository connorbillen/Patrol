import { ApolloServer } from 'apollo-server'
import typeDefs from './schema'

const server: ApolloServer = new ApolloServer({ typeDefs });

server.listen().then((): void => {
    console.log('🚀 Server running on localhost:4000');
});
