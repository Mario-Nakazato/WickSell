import Product from '../models/Product'
import styles from '../styles/Product.module.css'
import ProductCase from './ProductCase'

type props = {
    name: string
    subreddit: string
}

export default function ProductRollCase(props: any) {
    var cases: JSX.Element[] = []
    for (let index = 0; index < props.amount; index++) {
        cases.push(<ProductCase></ProductCase >)
    }
    return (<>
        <div className={styles.ProductRollCase}>
            {cases}
        </div>

    </>)
}