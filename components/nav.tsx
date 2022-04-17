import { NextComponentType } from "next";
import { useSession, signIn, signOut } from "next-auth/react"

const Nav: NextComponentType = () => {
    const { data: session } = useSession()
    if (session) {
        return (
            <div>
                Conectado como {session?.user?.email} <br /><br />
                <a href='#' onClick={() => signOut()}>Sair </a>|{" "}
                <a href='#' onClick={() => signIn("auth0", null!, { prompt: "login" })}>Usar outra conta</a><br />
                <a href='#'>Perfil</a><br />
            </div>
        )
    }
    return (
        <div>
            Não conectado <br /><br />
            <a href='#' onClick={() => signIn("auth0")}>Entrar </a>|{" "}
            <a href='#' onClick={() => signIn("auth0", null!, { prompt: "login" })}>Usar outra conta</a><br />
            <a href='#'>Criar a sua conta</a><br />
        </div>
    )
}

export default Nav