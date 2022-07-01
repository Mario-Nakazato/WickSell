import { useState } from 'react'
import styles from '../styles/Carrinho.module.css'
import { brlMonetary } from '../utils/valuesUtils'
export default function CartViewer({ props, transaction, session, isHistory, total, setTotal, onAwait, setOnAwait }: { props: any, transaction: any, session: any, isHistory?: any, total: number, setTotal: any, onAwait: boolean, setOnAwait: any }, index: number) {
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
                    <div className={styles.Controls}>
                        {!isHistory || isHistory === false ? <div className={styles.QuantityContainers}>
                            <div className={styles.QuantityControl}>
                                <button className={styles.Minus} onClick={async () => {
                                    if (props.produto && session) {
                                        await buyButtonHandler(transaction, props.produto, session, -1, setOnAwait, setExist, setTotal, total)
                                    }
                                }} disabled={onAwait}>&minus;</button>
                                <h1>{props.quantidade}</h1>
                                <button className={styles.Plus} onClick={async () => {
                                    if (props.produto && session) {
                                        await buyButtonHandler(transaction, props.produto, session, +1, setOnAwait, setExist, setTotal, total)
                                    }
                                }} disabled={onAwait}>&#43;</button>
                            </div>
                            <button className={styles.Trash} onClick={async () => {
                                if (props.produto && session) {
                                    await deleteButtonHandler(transaction, props.produto, session, setOnAwait, setExist, setTotal, total)
                                }
                            }} disabled={onAwait}>&times;</button>
                        </div> : <></>}
                        <h4>{brlMonetary(props.produto.price)}</h4>
                        <h3>{brlMonetary((Number(props.produto.price) - Number(props.produto.price) * Number(props.produto.discount) / 100) * Number(props.quantidade))}</h3>
                    </div>
                </div>
                <br></br>
            </div>
        )
    } else {
        return <></>
    }
}

async function buyButtonHandler(transaction: any, data: any, session: any, number: number, onAwaitFc: Function, existFc: Function, setTotal: Function, total: number) {
    const control = document.getElementsByClassName(styles.QuantityContainers)[0]
    onAwaitFc(true)
    var value = 0
    var qtd = 0
    var carrinho: any = []
    if (transaction && transaction.carrinho.length > 0) {
        var stocked = false
        transaction.carrinho.forEach((item: any, index: number) => {
            if (item.produto._id === data._id) {
                item.quantidade += number
                value = (Number(item.produto.price) - Number(item.produto.price) * Number(item.produto.discount) / 100) * number
                stocked = true
                qtd = item.quantidade
            } else {
                carrinho.push(item)
            }
        })
        var dataBody: any
        if (stocked && qtd > 0) {
            dataBody = { _id: transaction._id, carrinho: transaction.carrinho }
        } else if (stocked && qtd <= 0) {
            dataBody = { _id: transaction._id, carrinho: carrinho }
        }
        await fetch(`/api/transacao`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataBody)
        }).then(res => { if (res.status !== 200) alert('Falha ao alterar o carrinho'); else { setTotal(total + value); if (qtd <= 0) existFc(false) } })
    }
    control.classList.remove(styles.Loading)
    onAwaitFc(false)
}

async function deleteButtonHandler(transaction: any, data: any, session: any, onAwaitFc: Function, existFc: Function, setTotal: Function, total: number) {
    onAwaitFc(true)
    var value = 0
    var carrinho: any = []
    if (transaction && transaction.carrinho.length > 0) {
        var stocked = false
        transaction.carrinho.forEach((item: any, index: number) => {
            if (item.produto._id === data._id) {
                stocked = true
                value = (Number(item.produto.price) - Number(item.produto.price) * Number(item.produto.discount) / 100) * item.quantidade
            } else {
                carrinho.push(item)
            }
        })
        var dataBody: any
        if (stocked) {
            dataBody = { _id: transaction._id, carrinho }
        }
        await fetch(`/api/transacao`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dataBody)
        }).then(res => { if (res.status !== 200) alert('Falha ao deletar item no carrinho'); else { setTotal(total - value); existFc(false) } })
    }
    onAwaitFc(false)
}