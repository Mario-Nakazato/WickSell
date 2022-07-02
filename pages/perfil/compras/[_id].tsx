import { useSession } from 'next-auth/react'
import Router, { useRouter } from 'next/router'
import { useState } from 'react'
import useSWR from 'swr'
import CartViewer from '../../../components/CartViewer'
import CartViewHistory from '../../../components/CartViewHistory'
import InfinityLoading from '../../../components/InfinityLoading'
import styles from '../../../styles/Compra.module.css'
import styles2 from '../../../styles/Carrinho.module.css'
export default function Compra() {
    const router = useRouter()
    const { _id } = router.query
    const [carrinho, setCarrinho] = useState([]);
    const { data: session, status } = useSession()
    const { data, error } = useSWR(() => _id && `/api/transacao?_id=${_id}`, fetcher)
    console.log(data)
    if (status === 'authenticated' && session?.user?.email && data) {
        if (data && data.carrinho.length > 0 && carrinho.length === 0) setCarrinho(data.carrinho)
        console.log(data?.carrinho, carrinho)
    }
    if (status === 'loading') return <InfinityLoading active={true} />
    if (status === 'unauthenticated') Router.push('/')
    return (
        <div >
            <h1 style={{ marginLeft: '10rem' }}>Compra</h1>
            <div className={styles2.InnerContainer}>
                <div className={styles2.Container}>
                    {carrinho.length > 0 ? carrinho?.map((item, index) =>
                        <>
                            <CartViewer props={item} key={index}></CartViewer>
                            <br></br>
                        </>)
                        : <></>
                    }
                </div>
            </div>
            <div className={styles.Result}>
                <h1 >Total: R$ {data?.total.toFixed(2)}</h1>
                <h1>Estado: {data?.estado}</h1>
            </div>
        </div>
    )
}

const fetcher = async (url: string) => await fetch(url).then(async (res) => {

    if (res.status !== 200) {
        console.log(res.status)
    }
    const dataTemp = await res.json()
    const data = dataTemp[0]
    return data
}).catch((err) => { console.log(err) })