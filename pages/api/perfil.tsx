import type { NextApiRequest, NextApiResponse } from 'next'

import { getSession } from "next-auth/react"
import perfil from "../../utils/bdperfil"

const cPerfil = new perfil(process.env.MONGODB_COLECAO_PERFIL!)
//insomnia/2022.3.0
export default async function apiPerfil(req: NextApiRequest, res: NextApiResponse) {

	console.log("API PERFIL")
	console.log("QUERY")
	console.log(req.query)
	console.log("BODY")
	console.log(req.body)
	console.log("RAWHEADERS")
	console.log(req.rawHeaders)

	//const session = await getSession({ req })

	if (req.method == "POST") {
		const perfil = await cPerfil.findOnePerfil(req.body)
		if(perfil){
			res.status(400).json({ txt: "Ester perfil já foi criado" })
			return
		}
		await cPerfil.insertOnePerfil(req.body)
		res.status(200).json({ txt: "Perfil criado" })
	}

	/*if (req.query.email) {
		let profile: any = { email: req.query.email }
		let usuario = await cPerfilAuth0.findAllProfile(profile)
		res.status(200).json(usuario)
	} else {
		res.status(400).json({ txt: "404" })
	}*/
}