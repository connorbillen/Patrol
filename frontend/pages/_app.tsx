import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    NormalizedCacheObject
} from '@apollo/client'
import { Provider } from 'react-redux'

import '../styles/globals.css'
import Home from './index'
import state from '../state'

const cache: InMemoryCache = new InMemoryCache({})
const uri: string = 'http://localhost:4000/grahql'
const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
    cache,
    uri
})

function MyApp({ Component, pageProps }) {
    if (typeof Component === typeof Home) {
        return (
            <ApolloProvider client={client}>
                <Provider store={state}>
                    <Component {...pageProps} />
                </Provider>
            </ApolloProvider>
        )
    } else {
        return <Component {...pageProps} />
    }
}

export default MyApp
