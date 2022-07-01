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
    const { data, error } = useSWR(() => session?.user?.email && `/api/transacao/?comprador=${session?.user?.email}&estado=Carrinho&execetoEstado=true`, fetcher)
    if (status === 'authenticated' && session?.user?.email && data) {
        if (data && data.carrinho.length > 0 && carrinho.length === 0) setCarrinho(data.carrinho)
        console.log(data?.carrinho, carrinho)
    }
    if (status === 'loading' || !data) return <InfinityLoading active={true} />
    if (status === 'unauthenticated') Router.push('/')
    return (
        <>
            <div>
                <h1>Histórico de Compras</h1>
                <div className={styles.InnerContainer}>
                    <div className={styles.ItensContainer}>
                        {carrinho.length > 0 ? carrinho?.map((item, index) =>
                            <CartViewHistory props={item} key={index}></CartViewHistory>)
                            : <></>
                        }
                    </div>
                    <div className={styles.ResumeContainer}>
                        <h1>Total: R$ {data?.total}</h1>
                    </div>
                </div>
            </div>
        </>
    )
}

const fetcher = async (url: string) => await fetch(url).then(async (res) => {
    const dataTemp = await res.json()
    const data = dataTemp[0]
    if (res.status !== 200) {
        console.log(data.message)
    }
    return data
}).catch((err) => { console.log(err) })