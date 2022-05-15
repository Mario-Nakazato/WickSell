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
    if (!props.name) props = new Product('1', 'Geladeira FrostFree', 'Ela gela, confia...', 'R$ 4.999,90', 'R$ 6.999,90', '/geladeira.jpg')
    return (<>
        <div className={styles.ProductCase}>

            <Link href="/product/[id]" as={`/product/${props.id}`}>
                <a>
                    <img className={styles.ProductImage} src={props.image} alt={props.name}></img>
                    <div className={styles.ProductName}>{props.name}</div>
                    <div className={styles.ProductPromotion}>{props.promotion}</div>
                    <div className={styles.ProductPrice}>{props.price}</div>
                    <div className={styles.ProductBuyButton}>Comprar</div>
                </a>
            </Link>
        </div>

    </>)
}