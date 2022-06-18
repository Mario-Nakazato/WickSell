import Link from 'next/link'
import { server } from "../config";
import styles from '../styles/Product.module.css'
import { currency } from '../utils/InputMask';

export default function ProductCase(props: any) {
    if (props.props) {
        props = props.props
    }
    // var price = props.price.toString()
    // price = price.replace(/\./g, '')
    // price = price.replace(/,/g, '.')
    // if (parseFloat(price) !== NaN) price = parseFloat(price).toFixed(2)
    // else price = 0
    // var discount = props.discount!.toString()
    // discount = discount.replace(/,/g, '.')
    // discount = discount.replace(/%/g, '')

    // if (parseFloat(discount) !== NaN) discount = parseFloat(discount).toFixed(2)
    // else discount = 0


    // var currentPrice: any = (discount > 0) ? parseFloat((price - price * discount / 100).toFixed(2)) : parseFloat(price)


    // var oldPrice = price

    // oldPrice = currency(oldPrice)
    // currentPrice = currentPrice.toString()
    // if (currentPrice.includes('.')) {
    //     currentPrice = currentPrice.replace('.', ',')
    //     if (currentPrice.length < currentPrice.indexOf(',') + 3) {
    //         for (let i = currentPrice.length - currentPrice.indexOf(',')-1; i > 0; i--) {
    //             currentPrice += '0'
    //         }
    //     }
    // }else{
    //     currentPrice += ',00'
    // }
    // currentPrice=currency(currentPrice)


    var image
    var link = ``
    var linkAs = ``




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
                    {/* <div className={styles.ProductPromotion} >{oldPrice}</div> */}
                    {/* <div className={styles.ProductPrice}>{currentPrice}</div> */}
                    <div className={styles.ProductBuyButton}>Comprar</div>
                </div>
            </div>
        </Link>
    </>)
}