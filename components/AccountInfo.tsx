import { NextComponentType } from "next";
import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link";
import styles from "../styles/AccountInfo.module.css"

const AccountInfo: NextComponentType = () => {
    const { data: session, status } = useSession()
    if (status == "authenticated") {
        return (
            <>
                <div className={styles.AccountInfo}>
                    <div>
                        <img className={styles.ProfileImg} alt="Profile" src={session?.user?.image!}></img>
                    </div>
                    <div className={styles.AccountBtn}>
                        <Link href='/perfil'><a className={styles.RegisterBtn}>Perfil</a></Link>
                        <div className={styles.SeparatorBar} >|</div>
                        <a className={styles.LoginBtn} onClick={() => signOut()}>Sair</a>
                    </div>
                    <div style={{ position: "fixed", bottom: 0, right: 15 + 'px' }}>
                        {/*Conectado como {session?.user?.email}*/}
                    </div>
                </div>
            </>
        )
    } else if (status == "unauthenticated" || "loading") {
        return (
            <div className={styles.AccountInfo}>
                <div>
                    <img className={styles.ProfileImg} alt="Profile" src="/profile-placeholder.png" onClick={() => signIn("auth0")}></img>
                </div>
                <div className={styles.AccountBtn}>
                    <a className={styles.LoginBtn} onClick={() => signIn("auth0", null!, { prompt: "login" })}>Entrar</a>
                </div>

            </div >
        )
    } else { return (<></>) }
}
export default AccountInfo