import AccountInfo from './AccountInfo'
import styles from '../styles/Header.module.css'
import Link from 'next/link'
import { useState } from 'react'

export default function Header() {
    const [searchText, setSearchText] = useState('')
    return (<>
        <header className={styles.Header}>
            <div className={styles.UpperSideHeader}>
                <Link href="/"><a className={styles.LogoA} ><img className={styles.LogoIcon} src="/logo.png" alt="Logo"></img></a></Link>
                <form action='/api/produto' method='get' className={styles.SearchContainer}>
                    <input type="text" name='name' placeholder="Pesquisa" value={searchText} onChange={e => {
                        setSearchText(e.target.value);
                    }} className={styles.SearchInput}></input>
                    {/* <input type="text" name='description' value={searchText} onChange={e => {
                        setSearchText(e.target.value);
                    }} style={{ display: 'none' }}></input> */}
                    <button type='submit' className={styles.SearchBtn}><img className={styles.SearchIcon} src='/lupa-icon.svg' alt="Search Icon"></img></button>
                </form>
                <AccountInfo />
            </div>
            <div className={styles.NavBar}>
                <div className={styles.NavBarTr}>
                    <Link href="/produto/"><a className={styles.NavBarUl}>Produto</a></Link>
                    <Link href="/api/image/files"><a className={styles.NavBarUl}>Files</a></Link>
                    <div className={styles.NavBarUl}>Item 3</div>
                    <div className={styles.NavBarUl}>Item 4</div>
                    <div className={styles.NavBarUl}>Item 5</div>
                </div>
            </div>
        </header>
    </>)
}