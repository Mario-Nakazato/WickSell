import styles from '../styles/Carrinho.module.css'
import Cookies from 'universal-cookie';
import { useState, useEffect } from 'react';
import useSWR from 'swr';
const cookies = new Cookies();

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
    useEffect(() => setCarrinho(cookies.get('Cart')), [])
    const { data, error } = useSWR(() => `/api/produto/?_id=62b8a1aa761d06ee7cde4606`, fetcher)

    return <>
        <div className={styles.Container}>
            <h1>Carrinho</h1>
            {carrinho?.map((item, index) => cartViewer({ ...data }, index))}
        </div>
        <button onClick={() => cookies.set('Cart', carrinho)}>Set Cookie</button>
        <button onClick={() => cookies.remove('Cart')}>Remove Cookie</button>
        <button onClick={() => { setCarrinho(cookies.get('Cart')); console.log(cookies.get('Cart')) }}>Get Cookie</button>
    </>
}
function cartViewer({ name, description, price, quantity, image }: { name: any, description: any, price: any, quantity: any, image: any }, index: number) {
    return <>
        <div className={styles.CartViewerContainer} key={index}>
            <img alt='Product Image' src={image?.[0] ? `/api/image/files/${image?.[0]}` : '/product-placeholder.png'}></img>
            <div className={styles.InfoContainer}>
                <h1>{name}</h1>
                <p>{description}</p>
            </div>
            <div>
                <div className={styles.QuantityContainers}>
                    <div className={styles.QuantityControl}>
                        <button className={styles.Minus}>&minus;</button>
                        <h1>{quantity || 5}</h1>
                        <button className={styles.Plus}>&#43;</button>
                    </div>
                    <button className={styles.Trash}>&times;</button>
                </div>
                <h4>{price}</h4>
                <h3>{price * quantity|| price*5}</h3>
            </div>
        </div>
    </>
}