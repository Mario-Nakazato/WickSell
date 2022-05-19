import styles from '../styles/InfinityLoading.module.css'

type props = {
    active: boolean
}

export default function InfinityLoading(props: props) {
    if (props.active) {
        return (<>
            <div className={styles.Container}>
                <div className={styles.Loader}></div>
            </div>
        </>)
    } else {
        return (<></>)
    }
}