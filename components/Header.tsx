import AccountInfo from './AccountInfo'
import Image from 'next/image'
import styles from '../styles/Header.module.css'
export default function Header() {
    return (<>
        <header className={styles.Header}>
            <div className={styles.UpperSideHeader}>
                <a className={styles.LogoA} href=""><img className={styles.LogoIcon} src="/logo.png" alt="Logo"></img></a>
                <div className={styles.SearchContainer}>
                    <input type="text" placeholder="Pesquisa" className={styles.SearchInput}></input>
                    <button className={styles.SearchBtn}>Pesquisar</button>
                </div>
                <AccountInfo />
            </div>
            <div className={styles.NavBar}>
                <div className={styles.NavBarTr}>
                    <div className={styles.NavBarUl}>Item 1</div>
                    <div className={styles.NavBarUl}>Item 2</div>
                    <div className={styles.NavBarUl}>Item 3</div>
                    <div className={styles.NavBarUl}>Item 4</div>
                    <div className={styles.NavBarUl}>Item 5</div>
                </div>
            </div>
        </header>
    </>)

}