import { NextComponentType } from "next";
import { signIn } from "next-auth/react"
import Link from "next/link";
import styles from '../styles/EmailVerifyMessage.module.css'
const EmailVerifyMessage: NextComponentType = () => {
    return (<>
        <div className={styles.Container}>
            <label className={styles.Label}>Seu email ainda não foi verificado.</label>
            <label className={styles.Label}>Por favor verifique-o, antes de entrar.</label>
            <div className={styles.LinkContainer}>
                <Link href='/'><a className={styles.Link} >Continuar sem verificar</a></Link>
                <div className={styles.LinkSeparator}></div>
                <div className={styles.Link} onClick={() => { signIn("auth0") }}>Já verifiquei o email</div>
            </div>
        </div>
    </>)
}

export default EmailVerifyMessage;
