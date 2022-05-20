import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import DefaultHead from '../components/DefaultHead'
import Footer from '../components/Footer'
import Header from '../components/Header'
import EmailVerifyMessage from '../components/EmailVerifyMessage'
import ProductRollCase from '../components/ProductRollCase'
import ProductCase from '../components/ProductCase'
import InfinityLoading from '../components/InfinityLoading'

var produtos: JSX.Element[] = []

fetch('api/produto/', {
	method: "GET",
}).then(res => res.json()).then(res => {
	//console.log(res[i])
	produtos.push(<ProductRollCase key={1} props={res} amount={2}></ProductRollCase >)
}).catch(error => {
	console.log(error)
});

const Home: NextPage = () => {
	const { data: session, status } = useSession()
	const { query } = useRouter()


	if (session && status == "authenticated") {
		return (
			<>
				<DefaultHead></DefaultHead>
				<Header></Header>
				{produtos}
			</>
		)
	} else if (!produtos || status == "loading") {
		return (
			<>
				<DefaultHead />
				<Header />
				{produtos}
				<InfinityLoading active={true} />
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
				{produtos}
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