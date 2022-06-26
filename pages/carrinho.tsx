import styles from '../styles/Carrinho.module.css'
import Cookies from 'universal-cookie';
import { useState, useEffect } from 'react';
const cookies = new Cookies();
export default function Cart() {
    const [carrinho, setCarrinho] = useState([]);
    useEffect(() => setCarrinho(cookies.get('Cart')), [])

    return <>
        <div className={styles.Container}>
            <h1>Carrinho</h1>
            {carrinho?.map((item, index) => cartViewer(item, index))}
        </div>
        <button onClick={() => cookies.set('Cart', carrinho)}>Set Cookie</button>
        <button onClick={() => cookies.remove('Cart')}>Remove Cookie</button>
        <button onClick={() => { setCarrinho(cookies.get('Cart')); console.log(cookies.get('Cart')) }}>Get Cookie</button>
    </>
}
function cartViewer({ name, description, price, quantity, image }: { name: any, description: any, price: any, quantity: any, image: any }, index: number) {
    return <>
        <div className={styles.CartViewerContainer} key={index}>
            <img src={image?.[0] ? `/api/image/files/${image?.[0]}` : '/product-placeholder.png'}></img>
            <div className={styles.InfoContainer}>
                <h1>{name}</h1>
                <p>{description}</p>
            </div>
            <div>
                <div className={styles.QuantityControl}>
                    <button>menos</button>
                    <h1>{quantity}</h1>
                    <button>mais</button>
                    <button>remover</button>
                    {/* controle de qtd + delete button -->flex */}
                </div>
                <h4>{price}</h4>
                <h3>{price * quantity}</h3>
            </div>
        </div>
    </>
}