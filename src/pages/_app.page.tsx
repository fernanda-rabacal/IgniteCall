import type { AppProps } from 'next/app'
import { globalStyles } from '@/styles/global'
import { SessionProvider } from 'next-auth/react'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/lib/react-query'
import '../lib/dayjs'
import { DefaultSeo } from 'next-seo'

globalStyles()

export default function App({ Component, pageProps: { session, ...pageProps} }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
        <DefaultSeo
          openGraph={{
            type: 'website',
            locale: 'pt_BR',
            url: 'https://www.ignite-call.com.br/',
            siteName: 'Ignite Call',
          }}
        />
      </SessionProvider>
    </QueryClientProvider>
  )
}
