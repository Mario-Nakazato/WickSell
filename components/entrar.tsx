import { NextComponentType } from "next";

import { useSession, signIn, signOut } from "next-auth/react"

const Entrar: NextComponentType | any = () => {
    const { data: session, status } = useSession()

    if (status == "loading") return <>Loading...{session}</>;

    if (status == "authenticated") {
        return (
            <>
                Conectado como {session?.user?.email}<br />
                <a onClick={() => signOut()}>Sair</a>
                <a>Perfil</a>
            </>
        )
    } else if (status == "unauthenticated") {
        return (
            <>
                Não conectado<br />
                <a onClick={() => signIn("auth0", null!, { prompt: "login" })}>Entrar</a><br />
                <a onClick={() => signIn("auth0")}>Entrar direto DEBUG</a>
            </>
        )
    }
}

export default Entrar