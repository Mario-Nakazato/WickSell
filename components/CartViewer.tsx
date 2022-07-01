import { useState } from 'react'
import styles from '../styles/Carrinho.module.css'
import { brlMonetary } from '../utils/valuesUtils'
export default function CartViewer({ props }:
    { props: any }) {
    if (props.props) props = props.props
    const subTotal = brlMonetary(((Number(props.produto.price) - Number(props.produto.price) * Number(props.produto.discount) / 100) * Number(props.quantidade)).toFixed(2))
    return (
        <div  >
            <div className={styles.CartViewerContainer}>
                <img alt='Product Image' src={props.produto.image?.[0] ? `/api/image/files/${props.produto.image?.[0]}` : '/product-placeholder.png'}></img>
                <div className={styles.InfoContainer}>
                    <h1>{props.produto.name}</h1>
                    <p>{props.produto.description}</p>
                </div>
                <div className={styles.Controls}>
                    <div className={styles.QuantityContainers}>
                        <div className={styles.QuantityControl}>
                            <h1>Quantidade:{props.quantidade}</h1>
                        </div>
                    </div>
                    <div className={styles.Monetary}>
                        <h5>{brlMonetary(props.produto.price)}</h5>
                        <h4>{brlMonetary((props.produto.price - props.produto.price * props.produto.discount / 100).toFixed(2))}</h4>
                        <h3>Subtotal:</h3>
                        <h1 style={{ fontSize: 'calc(1rem * ' + 20 / subTotal.length + ')' }}>{subTotal}</h1>
                    </div>
                </div>
                <br></br>
            </div>
        </div >
    )
}

