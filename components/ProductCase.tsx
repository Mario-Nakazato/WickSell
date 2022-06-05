import { NextComponentType } from "next";
import Image from "next/image";
import Link from 'next/link'
import styles from '../styles/Product.module.css'

export default function ProductCase(props: any) {
    if (props.props) {
        props = props.props
    }
    var promotion = ''
    var price = ''
    var image
    var link = ``
    var linkAs = ``
    if (props.promotion && props.promotion > 0) {
        promotion = 'R$ ' + props.promotion
    } else if (props.promotion && props.promotion == 0) {
        promotion = ''
    } else {
        promotion = 'R$ 999,90'
    }
    if (props.price && props.promotion && props.promotion < props.price) {
        price = 'R$ ' + props.promotion
        promotion = 'R$ ' + props.price
    } else {
        price = 'R$ ' + (props.price || '3999,99')
    }
    if (props._id) {
        link = `/produto/[id]`
        linkAs = `/produto/${props._id}`
    }
    if (props.image && !props.isPreview) {
        console.log(props.image)
        console.log(image)
        image = window.location.origin + '/api/image/files/' + props.image[0]
        console.log(image)

    } else {
        image = props.image
    }


    return (<>
        <div className={styles.ProductCase}>

            <div>
                <img className={styles.ProductImage} src={image || '/product-placeholder.png'} alt={props.name}></img>
                <div className={styles.ProductName}>{props.name || 'Nome do Produto'}</div>
                <div className={styles.ProductPromotion} >{promotion}</div>
                <div className={styles.ProductPrice}>{price}</div>
                <Link href={link} as={linkAs} passHref>
                    <div className={styles.ProductBuyButton}>Comprar</div>
                </Link>

            </div>
        </div>

    </>)
}