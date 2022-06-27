import { useState } from 'react'
import styles from '../styles/Carrinho.module.css'
export default function CartViewer({ props, transaction, session }: { props: any, transaction: any, session: any }, index: number) {
    const [onAwait, setOnAwait] = useState(false)
    const [exist, setExist] = useState(true)
    if (props.props) props = props.props
    if (exist) {
        return (
            <div key={index}>
                <div className={styles.CartViewerContainer} >
                    <img alt='Product Image' src={props.produto.image?.[0] ? `/api/image/files/${props.produto.image?.[0]}` : '/product-placeholder.png'}></img>
                    <div className={styles.InfoContainer}>
                        <h1>{props.produto.name}</h1>
                        <p>{props.produto.description}</p>
                    </div>
                    <div>
                        <div className={styles.QuantityContainers}>
                            <div className={styles.QuantityControl}>
                                <button className={styles.Minus} onClick={async () => {
                                    if (props.produto && session) {
                                        await buyButtonHandler(transaction, props.produto, session, -1, setOnAwait, setExist)
                                    }
                                }} disabled={onAwait}>&minus;</button>
                                <h1>{props.quantidade}</h1>
                                <button className={styles.Plus} onClick={async () => {
                                    if (props.produto && session) {
                                        await buyButtonHandler(transaction, props.produto, session, +1, setOnAwait, setExist)
                                    }
                                }} disabled={onAwait}>&#43;</button>
                            </div>
                            <button className={styles.Trash} onClick={async () => {
                                if (props.produto && session) {
                                    await deleteButtonHandler(transaction, props.produto, session, setOnAwait, setExist)
                                }
                            }} disabled={onAwait}>&times;</button>
                        </div>
                        <h4>{props.produto.price}</h4>
                        <h3>{props.produto.price * props.quantity || props.produto.price * 5}</h3>
                    </div>
                </div>
                <br></br>
            </div>
        )
    } else {
        return <></>
    }
}

async function buyButtonHandler(transaction: any, data: any, session: any, number: number, onAwaitFc: Function, existFc: Function) {
    const control = document.getElementsByClassName(styles.QuantityContainers)[0]
    onAwaitFc(true)
    console.log(control)
    if (transaction && transaction.carrinho.length > 0) {
        var stocked = false
        transaction.carrinho.forEach((item: any, index: number) => {
            if (item.produto._id === data._id) {
                item.quantidade += number
                stocked = true
            }
            if (item.quantidade <= 0) {
                transaction.carrinho.pop(index)
                existFc(false)
            }
        })
        var dataBody: any
        if (stocked) {
            dataBody = { _id: transaction._id, carrinho: transaction.carrinho }
        }
        await fetch(`/api/transacao`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataBody)
        }).then(res => { if (res.status !== 200) alert('Falha ao adicionar ao carrinho'); })
    }
    control.classList.remove(styles.Loading)
    onAwaitFc(false)
}

async function deleteButtonHandler(transaction: any, data: any, session: any, onAwaitFc: Function, existFc: Function) {
    onAwaitFc(true)
    if (transaction && transaction.carrinho.length > 0) {
        var stocked = false
        transaction.carrinho.forEach((item: any, index: number) => {
            if (item.produto._id === data._id) {
                transaction.carrinho.pop(index)
                stocked = true
                existFc(false)
            }
        })
        var dataBody: any
        if (stocked) {
            dataBody = { _id: transaction._id, carrinho: transaction.carrinho }
        }
        await fetch(`/api/transacao`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataBody)
        }).then(res => { if (res.status !== 200) alert('Falha ao adicionar ao carrinho'); })
    }
    onAwaitFc(false)
}