import Link from 'next/link'
import { server } from "../config";
import styles from '../styles/Product.module.css'
import { currency } from '../utils/InputMask';

export default function ProductCase(props: any) {
    if (props.props) props = props.props

    var price: any
    var discount: any
    var image
    var link = `/produto`
    var linkAs = `/produto`

    if (props.price) {
        price = props.price.toString()
        if (parseFloat(price) !== NaN) price = parseFloat(price)
        else price = 0
    } else { price = 0 }

    if (props.discount) {
        discount = props.discount.toString()
        discount = discount.replace(/,/g, '.')
        discount = discount.replace(/%/g, '')
        if (parseFloat(discount) !== NaN) discount = parseFloat(discount).toFixed(2)
        else discount = 0
    }
    var currentPrice: any = (discount > 0) ? parseFloat((price - price * discount / 100).toFixed(2)) : parseFloat(price)
    currentPrice = brlMonetary(currentPrice)

    var oldPrice = discount > 0 && price ? brlMonetary(price) : ''

    if (props._id) {
        link = `/produto/[id]`
        linkAs = `/produto/${props._id}`
    }
    if (props.image && !props.isPreview) {
        image = server + '/api/image/files/' + props.image[0]

    } else {
        image = props.image
    }

    return (<>
        <Link href={link} as={linkAs} passHref>
            <div className={styles.ProductCase}>
                <div>
                    <img className={styles.ProductImage} src={image || '/product-placeholder.png'} alt={props.name}></img>
                    <div className={styles.ProductName}>{props.name || 'Nome do Produto'}</div>
                    <div className={styles.ProductPromotion} >{oldPrice}</div>
                    <div className={styles.ProductPrice}>{currentPrice}</div>
                    <div className={styles.ProductBuyButton}>Comprar</div>
                </div>
            </div>
        </Link>
    </>)
}
// 1234.56
function brlMonetary(e: any) {
    e = e.toString()
    if (e.includes('.')) {
        e = e.replace('.', ',')
        if (e.length < e.indexOf(',') + 3) {
            for (let i = e.length - e.indexOf(',') - 1; i > 0; i--) {
                e += '0'
            }
        }
    } else {
        if (e.length < 0) {
            e = '0'
        }
        e += ',00'
    }
    e = currency(e)
    e = 'R$ ' + e
    return e
}