import { Provider } from 'react-redux'

import '../styles/globals.css'
import Home from './index'
import state from '../state'

function MyApp({ Component, pageProps }) {
  if (typeof Component === typeof Home) {
    return (
      <Provider store={state}>
        <Component {...pageProps} />
      </Provider>
    )
  } else {
    return <Component {...pageProps} />
  }
}

export default MyApp
