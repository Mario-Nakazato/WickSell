import { NextComponentType } from "next";
import { useSession, signIn, signOut } from "next-auth/react"

const Nav: NextComponentType = () => {
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
    return (
        <div>
            Não conectado <br /><br />
            <button onClick={() => signIn("auth0")}>Entrar </button>|{" "}
            <button onClick={() => signIn("auth0", null!, { prompt: "login" })}>Usar outra conta</button><br />
            <button>Criar a sua conta</button><br />
        </div>
    )
}

export default Nav