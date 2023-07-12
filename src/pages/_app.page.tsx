import { globalStyles } from '@/styles/global'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { SessionStore } from 'next-auth/core/lib/cookie'
import '../lib/dayjs'

globalStyles()

export default function App({ Component, pageProps: { session, ...pageProps} }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
