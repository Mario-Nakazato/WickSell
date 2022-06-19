import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import { useRouter } from 'next/router'
import DefaultHead from '../components/DefaultHead'
import Header from '../components/Header'
import EmailVerifyMessage from '../components/EmailVerifyMessage'
import ProductRollCase from '../components/ProductRollCase'
import InfinityLoading from '../components/InfinityLoading'
import styles from '../styles/Home.module.css'
import { server } from '../config'
import { useSession } from 'next-auth/react'


export default function Home({ data }: { data: any }) {
	const { data: session, status } = useSession()
	const { query } = useRouter()
	var produtos: JSX.Element[] = []

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
	if (status == "loading") {
		return (
			<>
				<DefaultHead />
				<Header />
				<InfinityLoading active={true} />
			</>
		)
	}
	else if (session && status == "authenticated") {
		return (
			<>
				<DefaultHead></DefaultHead>
				<Header></Header>
				<div className={styles.Body}>
					{produtos}
				</div>
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
				<div className={styles.Body}>
					{produtos}
				</div>
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

export const getStaticProps: GetStaticProps = async () => {
	const produtos = await fetch(`${server}/api/produto/`).then((res) => res.json())
	return {
		props: {
			data: produtos,
		},
		revalidate: 8
	}
}