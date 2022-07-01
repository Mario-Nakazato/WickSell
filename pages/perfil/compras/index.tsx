import { useSession } from 'next-auth/react'
import Router from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import styles from '../../../styles/Compra.module.css'
import InfinityLoading from '../../../components/InfinityLoading'
import CartViewHistory from '../../../components/CartViewHistory'

export default function Compras() {
    const [carrinho, setCarrinho] = useState([]);
    const { data: session, status } = useSession()
    const { data, error } = useSWR(() => session?.user?.email && `/api/transacao/?comprador=${session?.user?.email}&estado=Carrinho&excetoEstado=true`, fetcher)

    // console.log('data',data)
    if (status === 'loading' || !data) return <InfinityLoading active={true} />
    if (status === 'unauthenticated') Router.push('/')
    return (
        <>
            <div>
                <h1>Histórico de Compras</h1>
                <div className={styles.InnerContainer}>
                    <div className={styles.Container}>
                        {data.length > 0 ? data?.map((item: any, index: number) =>
                            <CartViewHistory props={item} key={index}></CartViewHistory>)
                            : <></>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

const fetcher = async (url: string) => await fetch(url).then(async (res) => {

    if (res.status !== 200) {
        console.log(res.status)
    }
    const data = await res.json()
    return data
}).catch((err) => { console.log(err) })