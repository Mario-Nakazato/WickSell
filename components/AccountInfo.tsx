import { NextComponentType } from "next";
import { useSession, signIn, signOut } from "next-auth/react"
import styles from "../styles/AccountInfo.module.css"
const AccountInfo: NextComponentType | any = () => {

    const { data: session, status } = useSession()

    if (status == "loading") return <>Loading...{session}</>;

    if (status == "authenticated") {
        return (
            <>
                <div className={styles.AccountInfo}>
                    <div className={styles.AccountBtn}>
                        <a className={styles.LoginBtn} onClick={() => signOut()}>Sair</a>

                        <div className={styles.SeparatorBar} >|</div>
                        <a className={styles.RegisterBtn}>Perfil</a>

                    </div>

                    <div>
                        <img className={styles.ProfileImg} alt="Profile" src={session?.user?.image!}></img>
                    </div>
                    <div style={{position: "absolute", bottom: 0, right: 0}}>

                        Conectado como {session?.user?.email}<br />

                    </div>
                </div>
            </>
        )
    } else if (status == "unauthenticated") {
        return (
            <div className={styles.AccountInfo}>
                <div className={styles.AccountBtn}>
                    <a className={styles.LoginBtn} onClick={() => signIn("auth0", null!, { prompt: "login" })}>Entrar</a>
                    <div className={styles.SeparatorBar} >|</div>
                    <a className={styles.RegisterBtn} onClick={() => signIn("auth0")}>Entrar cache</a>
                </div>
                <div>
                    <img className={styles.ProfileImg} src="/profile-placeholder.png"></img>
                </div>
            </div>
        )
    }
}
export default AccountInfo