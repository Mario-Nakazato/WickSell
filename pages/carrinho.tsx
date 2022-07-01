import styles from '../styles/Carrinho.module.css'
import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { useSession } from 'next-auth/react';
import CartViewer from '../components/CartView';
import { brlMonetary } from '../utils/valuesUtils';

export default function Cart() {
    const [onAwait, setOnAwait] = useState(false)
    const [quantity, setQuantity] = useState(0)
    const [quantityIsSet, setQuantityIsSet] = useState(false)
    const [carrinho, setCarrinho] = useState([]);
    const [total, setTotal] = useState(0);
    const { data: session, status } = useSession()
    const { data, error } = useSWR(() => session?.user?.email && `/api/transacao/?comprador=${session?.user?.email}&estado=Carrinho`, fetcher)
    if (status === 'authenticated' && session?.user?.email && data) {
        if (data?.carrinho && data.carrinho.length > 0 && carrinho.length === 0) {
            setCarrinho(data.carrinho)
            setTotal(data?.total)
        }
    }
    console.log(data)
    if (quantity == 0 && carrinho.length > 0 && !quantityIsSet) {
        let tempQuantity = 0;
        carrinho.forEach((item: any) => { tempQuantity += item.quantidade })
        setQuantity(tempQuantity)
        setQuantityIsSet(true)
    }
    if (quantityIsSet && quantity <= 0) window.location.reload()

    return <>
        <div className={styles.Container}>
            <h1>Carrinho</h1>
            {carrinho.length > 0 ?
                <>
                    {carrinho.map((item, index) => <CartViewer props={item} transaction={data} session={session} total={total} setTotal={setTotal} onAwait={onAwait} setOnAwait={setOnAwait} quantity={quantity} setQuantity={setQuantity} key={index}></CartViewer>)}
                    <div className={styles.Result}>
                        <h2>Quantidade: {quantity}</h2>
                        <h2>Total: {brlMonetary(total.toFixed(2))}</h2>
                        <button onClick={async () => {
                            setOnAwait(!onAwait)
                            const dataBody = { _id: data._id, carrinho: data.carrinho, estado: "Processando" }
                            await fetch(`/api/transacao`, {
                                method: 'PATCH',
                                headers: {
                                    'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(dataBody)
                            }).then(res => { if (res.status !== 200) alert('Falha ao alterar o carrinho'); })
                            setOnAwait(false)
                            window.location.reload()
                        }}>Finalizar a Compra</button>
                    </div>
                </>
                : <h1>Você não possui nenhum item no carrinho</h1>
            }
        </div>
    </>
}

const fetcher = async (url: string) => await fetch(url).then(async (res) => {
    if (res.status !== 200) {
        console.log(res.status)
    }
    const data = await res.json()
    return data[0]
}).catch((err) => { console.log(err) })