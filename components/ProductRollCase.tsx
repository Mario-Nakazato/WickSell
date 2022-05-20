import styles from '../styles/Product.module.css'
import ProductCase from './ProductCase'

type props = {
    name: string
    subreddit: string
}

export default function ProductRollCase(props: any) {
    var cases: JSX.Element[] = []
    if (props.props) {
        console.log(props)
        console.log(props.props)
        for (let index = 0; index < props.amount; index++) {
            cases.push(<ProductCase key={index} props={props.props[index]}></ProductCase >)
        }
        return (<>
            <div className={styles.ProductRollCase}>
                {cases}
            </div>

        </>)
    } else {
        return (<></>)
    }
}