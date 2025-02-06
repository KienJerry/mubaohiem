import '../styles/global.css'
import '../styles/global.scss'
import 'bootstrap/dist/css/bootstrap.css'
import 'react-toastify/dist/ReactToastify.css'

import { persistor, store } from '@/store'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { SWRConfig } from 'swr'
import { QueryClient, QueryClientConfig, QueryClientProvider } from 'react-query'
import { TAppPropsWithLayout } from '@/types/layout'
import { ToastContainer } from 'react-toastify'
import { ConfigProvider } from 'antd'
// apollo
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

import Head from 'next/head'
import Script from 'next/script'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { library } from '@fortawesome/fontawesome-svg-core'

const client = new ApolloClient({
  uri: 'http://localhost:3000/',
  cache: new InMemoryCache(),
})

const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
}

export const queryClient = new QueryClient(queryClientConfig)

library.add(fab)

const MyApp = ({ Component, pageProps }: TAppPropsWithLayout) => {
  const Layout: any = Component.Layout
  return (
    <Provider store={store}>
      <Script src="https://kit.fontawesome.com/98edee12f6.js" crossOrigin="anonymous" />
      <ApolloProvider client={client}>
        <QueryClientProvider client={queryClient}>
          <PersistGate loading={null} persistor={persistor}>
          {() => (
            <ConfigProvider touch-action="pan-x pan-y">
              <ToastContainer />
              <SWRConfig value={{ revalidateOnFocus: false, shouldRetryOnError: false }}>
                <Head>
                  <link rel="shortcut icon" href="/favicon.ico" />
                  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                </Head>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </SWRConfig>
            </ConfigProvider>
             )}
          </PersistGate>
        </QueryClientProvider>
      </ApolloProvider>
    </Provider>
  )
}

export default MyApp
