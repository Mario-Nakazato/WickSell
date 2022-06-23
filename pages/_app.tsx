import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import Footer from '../components/Footer'
import DefaultHead from '../components/DefaultHead'
import Header from '../components/Header'
function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	return (
		<SessionProvider session={session}>
			<DefaultHead />
			<Header />
			<div className='Container'>
				<Component {...pageProps} />
			</div>
			<Footer />
		</SessionProvider>
	)
}

export default MyApp