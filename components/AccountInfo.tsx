import { NextComponentType } from "next";
import { useSession, signIn, signOut } from "next-auth/react"

const AccountInfo: NextComponentType | any = () => {

    const { data: session, status } = useSession()

    if (status == "loading") return <>Loading...{session}</>;

    if (status == "authenticated") {
        return (
            <>
                <div id="accountInfo">
                    <div id="account-btn">
                        <a id="login-btn" onClick={() => signOut()}>Sair</a>

                        <div id="btn-separator" >|</div>
                        <a id="register-btn">Perfil</a>

                    </div>

                    <div>
                        <img id="profile-img" alt="Profile" src={session?.user?.image!}></img>
                    </div>
                    <div style={{ marginLeft: '2rem' }}>

                        Conectado como {session?.user?.email}<br />

                    </div>
                </div>
            </>
        )
    } else if (status == "unauthenticated") {
        return (
            <div id="accountInfo">
                <div id="account-btn">
                    <a id="login-btn" onClick={() => signIn("auth0", null!, { prompt: "login" })}>Entrar</a>
                    <div id="btn-separator" >|</div>
                    <a id="register-btn" onClick={() => signIn("auth0")}>DEBUG Entrar</a>
                </div>
                <div>
                    <img id="profile-img" src="/profile-placeholder.png"></img>
                </div>
            </div>
        )
    }
}
export default AccountInfo