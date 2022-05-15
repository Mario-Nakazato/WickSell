import { NextComponentType } from "next";
import Image from "next/image";
import Link from 'next/link'
import Product from "../models/Product";
import styles from '../styles/Product.module.css'

type props = {
    name: string
    subreddit: string
}

export default function ProductCase(props: any) {
    //if (!props.name) props = new Product('1', 'Geladeira FrostFree', 'Ela gela, confia...', '4.999,90', '6.999,90', '/geladeira.jpg')
    var promotion = ''
    var price = ''
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
    if (props.id) {
        link = `/produto/[id]`
        linkAs = `/produto/${props.id}`
    }

    return (<>
        <div className={styles.ProductCase}>

            <Link href={link} as={linkAs}>
                <a>
                    <img className={styles.ProductImage} src={props.image || '/product-placeholder.png'} alt={props.name}></img>
                    <div className={styles.ProductName}>{props.name || 'Nome do Produto'}</div>
                    <div className={styles.ProductPromotion} >{promotion}</div>
                    <div className={styles.ProductPrice}>{price}</div>
                    <div className={styles.ProductBuyButton}>Comprar</div>
                </a>
            </Link>
        </div>

    </>)
}