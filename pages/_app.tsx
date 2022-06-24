import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import Footer from '../components/Footer'
import DefaultHead from '../components/DefaultHead'
import Header from '../components/Header'
import CookieConsent from 'react-cookie-consent'
const CookieDisclaimerText = 'Este site utiliza cookies para melhorar o uso do site. Ao continuar a navegar, você concorda com a utilização de cookies.'

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	return (
		<SessionProvider session={session}>
			<DefaultHead />
			<Header />
			<div className='Container'>
				<Component {...pageProps} />
			</div>
			<Footer />
			<CookieConsent
				location="bottom"
				buttonText="Aceitar"
				style={{ background: "#23486e", fontSize: '20px' }}
				contentStyle={{ padding: '10px 10px 10px 100px' }}
				buttonStyle={{ background: "white", color: "#1a3a5b", fontSize: "17px", padding: "10px 20px", margin: "0px 60px 0px 0px" }}
				expires={5}
			>{CookieDisclaimerText}</CookieConsent>
		</SessionProvider >
	)
}

export default MyApp