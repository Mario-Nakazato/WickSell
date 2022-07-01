import { useState } from 'react'
import styles from '../styles/Carrinho.module.css'
import { brlMonetary } from '../utils/valuesUtils'
export default function CartViewer({ props }: { props: any }, index: number) {
    const [exist, setExist] = useState(true)
    if (props.props) props = props.props
    console.log(props)
    const total = brlMonetary(props.total.toFixed(2))
    if (exist) {
        return (
            <div key={index} >
                <div className={styles.CartViewerContainer} >
                    {props.carrinho.map((item: any, index: number) => (
                        <img key={index} alt='Product Image' src={item.produto.image?.[0] ? `/api/image/files/${item.produto.image?.[0]}` : '/product-placeholder.png'}></img>
                    ))}
                    <div className={styles.InfoContainer}>
                        <h1>{props.carrinho[0].produto.name}</h1>
                        <p>{props.carrinho[0].produto.description}</p>
                    </div>
                    <div className={styles.Controls}>
                        <div className={styles.Monetary}>
                            <h4>Estado: {props.estado}</h4>
                            <h3>Total:</h3>
                            <h1 style={{ fontSize: 'calc(1rem * ' + 20 / total.length + ')' }}>{total}</h1>
                        </div>
                    </div>
                </div>
                <br></br>
            </div >
        )
    } else {
        return <></>
    }
}
