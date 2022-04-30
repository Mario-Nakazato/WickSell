import { NextComponentType } from "next";
import { useSession, signIn, signOut } from "next-auth/react"

const AccountInfo: NextComponentType = () => {
    const { data: session } = useSession()
    if (session) {
        return (
            <div>
                Conectado como {session?.user?.email} <br /><br />
                <button onClick={() => signOut()}>Sair </button>|{" "}
                <button onClick={() => signIn("auth0", null!, { prompt: "login" })}>Usar outra conta</button><br />
                <button>Perfil</button><br />
            </div>
        )
    }
    return (<>
        <div id="accountInfo">
            <div id="account-btn">
                <a id="login-btn" onClick={() => signIn("auth0")}>Entrar</a>
                <div id="btn-separator" >|</div>
                <a id="register-btn" onClick={() => signIn("auth0")}>Registrar-se</a>
            </div>
            <div>
                <img id="profile-img" src="/profile-placeholder.png"></img>
            </div>
        </div>
    </>)

}
export default AccountInfo