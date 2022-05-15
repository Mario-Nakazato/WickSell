import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import DefaultHead from '../components/DefaultHead'
import Footer from '../components/Footer'
import Header from '../components/Header'
import EmailVerifyMessage from '../components/EmailVerifyMessage'
import ProductRollCase from '../components/ProductRollCase'

const Home: NextPage = () => {
	const { data: session, status } = useSession()
	const { query } = useRouter()
	if (session && status == "authenticated") {
		return (
			<>
				<DefaultHead></DefaultHead>
				<Header></Header>
				<ProductRollCase amount={4}></ProductRollCase>
				<ProductRollCase amount={4}></ProductRollCase>
				<ProductRollCase amount={4}></ProductRollCase>
				<ProductRollCase amount={4}></ProductRollCase>
				<ProductRollCase amount={4}></ProductRollCase>

			</>
		)
	} else if (status == "loading") {
		return (
			<>
				<DefaultHead></DefaultHead>
				<Header></Header>
			</>
		)
	} else {
		const popup = (<>
			<EmailVerifyMessage />
		</>)
		const response = (
			<>
				<DefaultHead></DefaultHead>
				<Header></Header>
				<ProductRollCase amount={4}></ProductRollCase>
				<ProductRollCase amount={4}></ProductRollCase>
				<ProductRollCase amount={4}></ProductRollCase>
				<ProductRollCase amount={4}></ProductRollCase>
				<ProductRollCase amount={4}></ProductRollCase>

			</>
		)
		if (query.error == 'AccessDenied') {
			return (<>
				{response}
				{popup}
			</>)
		} else {
			return response;
		}
	}
}

export default Home