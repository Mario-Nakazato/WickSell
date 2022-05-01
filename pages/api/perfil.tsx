import type { NextApiRequest, NextApiResponse } from 'next'

import { getSession } from "next-auth/react"
import perfil from "../../utils/bdperfil"

const cperfil = new perfil(process.env.MONGODB_COLECAO_PERFILAUTH0!)

export default async function apiPerfil(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  if (session) {
    let profile: any = { sub: session?.user?.email }
    let usuario: any = await cperfil.findOneProfile(profile)
    profile = { email: usuario?.email }
    usuario = await cperfil.findAllProfile(profile)

    res.status(200).json(usuario)
  } else {
    res.status(400).json({ txt: "404" })
  }
}