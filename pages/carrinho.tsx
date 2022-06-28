import styles from '../styles/Carrinho.module.css'
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import CartViewer from '../components/CartView';

const fetcher = async (url: string) => await fetch(url).then(async (res) => {
    const dataTemp = await res.json()
    const data = dataTemp[0]
    if (res.status !== 200) {
        console.log(data.message)
    }
    return data
}).catch((err) => { console.log(err) })

export default function Cart() {
    const [carrinho, setCarrinho] = useState([]);
    const { data: session, status } = useSession()
    const { data, error } = useSWR(() => session?.user?.email && `/api/transacao/?comprador=${session?.user?.email}`, fetcher)
    if (status === 'authenticated' && session?.user?.email && data) {
        if (data && data.carrinho.length > 0 && carrinho.length === 0) setCarrinho(data.carrinho)
        console.log(data?.carrinho, carrinho)
    }
    return <>
        <div className={styles.Container}>
            <h1>Carrinho</h1>
            {carrinho.length > 0 ? carrinho?.map((item, index) =>
                <CartViewer props={item} transaction={data} session={session} key={index}></CartViewer>)
                :
                <h1>Você não possui nenhum item no carrinho</h1>
            }
        </div>
    </>
}
