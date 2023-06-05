import '@/styles/globals.css'
import { MoralisProvider } from "react-moralis"
import Head from "next/head"
import { NotificationProvider } from "web3uikit"
import { Header } from '../../components'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Work Groups</title>
        <meta name="description" content="WorkGroups" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MoralisProvider initializeOnMount={false}>
        <NotificationProvider>
          <Header/>
          <Component {...pageProps} />
        </NotificationProvider>
      </MoralisProvider>
    </>
  )
}
