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
import useSWR from 'swr'

const fetcher = async (url: string) => {
	const res = await fetch(url)
	const data = await res.json()
	if (res.status !== 200) {
		throw new Error(data.message)
	}
	return data
}

const Home: NextPage = () => {
	const { data: session, status } = useSession()
	const { query } = useRouter()
	var produtos: JSX.Element[] = []
	const { data, error } = useSWR(
		() => `/api/produto/`,
		fetcher
	)
	var amount = 4;
	if (data) {
		for (let i = 0; i < data.length; i++) {
			if (i % 4 == 0 || i == 0) {
				if (data.length - i < 4 && amount == 4) {
					amount = data.length - i
				}
				produtos.push(<ProductRollCase key={i} props={data} init={i} amount={amount}></ProductRollCase >)
			}

		}
	}

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