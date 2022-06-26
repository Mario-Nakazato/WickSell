import { useRouter } from 'next/router'
import InfinityLoading from '../../components/InfinityLoading'
import styles from '../../styles/Estoque.module.css'
import useSWR from 'swr'
import ProductCase from '../../components/ProductCase'
import { useState } from 'react'
import { brlMonetary, percentage } from '../../utils/valuesUtils'
import { useSession } from 'next-auth/react'

const fetcher = (url: any) => fetch(url).then((res) => res.json())

export default function Home() {
    const { data: session, status } = useSession()
    const { data } = useSWR(session?.user?.email && `/api/produto?email=${session?.user?.email}`, fetcher)

    return (<>
        <InfinityLoading active={!data || status === 'loading' ? true : false} />
        <div className={styles.Container}>
            <div className={styles.ProductsContainer}>
                {data?.map((product: any, i: number) => { return <ProductCase key={i} props={data[i]}></ProductCase> })}
            </div>
        </div>
    </>)
}