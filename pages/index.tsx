import type { GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import EmailVerifyMessage from '../components/EmailVerifyMessage'
import InfinityLoading from '../components/InfinityLoading'
import styles from '../styles/Home.module.css'
import { server } from '../config'
import { useSession } from 'next-auth/react'
import ProductCase from '../components/ProductCase'


export default function Home({ data }: { data: any }) {
	const { data: session, status } = useSession()
	const { query } = useRouter()

	if (status == "loading") return <InfinityLoading active={true} />

	else if (session && status == "authenticated") {
		return (
			<>
				<div className={styles.Body}>
					<div className={styles.ProductsContainer}>
						{data?.map((product: any, i: number) => { return <ProductCase key={i} props={data[i]}></ProductCase> })}
					</div>
				</div>
			</>
		)
	} else {
		const popup = (<>
			<EmailVerifyMessage />
		</>)
		const response = (
			<>
				<div className={styles.Body}>
					<div className={styles.ProductsContainer}>
						{data?.map((product: any, i: number) => { return <ProductCase key={i} props={data[i]}></ProductCase> })}
					</div>
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