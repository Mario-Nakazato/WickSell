import { NextComponentType } from "next";
import Image from "next/image";
import Link from 'next/link'
import Product from "../models/Product";
import styles from '../styles/Product.module.css'

const ProductCase: NextComponentType = (product: any) => {
    product = new Product('1', 'Geladeira FrostFree', 'Ela gela, confia...', 'R$ 4.999,90', 'R$ 6.999,90', '/geladeira.jpg')
    return (<>
        <div className={styles.ProductCase}>

            <Link href="/product/[id]" as={`/product/${product.id}`}>
                <a>
                    <img className={styles.ProductImage} src={product.promoImage} alt={product.name}></img>
                    <div className={styles.ProductName}>{product.name}</div>
                    <div className={styles.ProductPromotion}>{product.promotion}</div>
                    <div className={styles.ProductPrice}>{product.price}</div>
                    <div className={styles.ProductBuyButton}>Comprar</div>
                </a>
            </Link>
        </div>

    </>)
}
export default ProductCase