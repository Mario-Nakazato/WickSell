import { NextComponentType } from "next";
import { useSession, signIn, signOut } from "next-auth/react"

const Nav: NextComponentType = () => {
    const { data: session } = useSession()
    if (session) {
        return (
            <>
                Conectado como {session?.user?.email} <br />
                <a onClick={() => signOut()}>Sair</a>
            </>
        )
    }
    return (
        <>
            Não conectado <br />
            <a onClick={() => signIn("auth0", null!, { prompt: "login" })}>Entrar</a><br />
            <a onClick={() => signIn("auth0")}>Entrar</a>
        </>
    )
}

export default Nav