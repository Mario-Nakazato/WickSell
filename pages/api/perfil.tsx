import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from "next-auth/react"
import perfil from "../../utils/cperfil"

const cperfil = new perfil(process.env.MONGODB_COLLECTION_PERFIL!)

export default async function apiPerfil(req: NextApiRequest, res: NextApiResponse) {

	const session = await getSession({ req })

	if (!session) {//req.rawHeaders.filter((value) => { return value == "insomnia/2022.3.0" })[0] !== "insomnia/2022.3.0"
		res.status(400).json({ txt: "Acesso negado." })
		return
	}

	const email = await cperfil.setEmail(session?.user?.email!)
	
	if (email == undefined) {
		res.status(400).json({ txt: "Email não existe." })
		return
	}
	
	const docperfil = await cperfil.findOnePerfil()

	if (req.method == "GET") {
		
		if (!docperfil) {
			res.status(400).json({ txt: "Perfil não existe." })
			return
		}
		res.status(200).json(docperfil)

	} else if (req.method == "POST") {

		if (docperfil) {
			res.status(400).json({ txt: "Perfil já existe." })
			return
		}
		if(req.body.email != email){
			res.status(400).json({ txt: "Email da sessão não é igual ao body." })
			return
		}
		await cperfil.insertOnePerfil(req.body)
		res.status(200).json({ txt: "Perfil criado." })

	} else if (req.method == "PUT") {

		if (!docperfil) {
			res.status(400).json({ txt: "Perfil não existe." })
			return
		}
		if(req.body.email != email){
			res.status(400).json({ txt: "Email da sessão não é igual ao body." })
			return
		}
		await cperfil.replaceOnePerfil(req.body)
		res.status(200).json({ txt: "Perfil substituido." })

	} else if (req.method == "PATCH") {

		if (!docperfil) {
			res.status(400).json({ txt: "Perfil não existe." })
			return
		}
		if(req.body.email != email){
			res.status(400).json({ txt: "Email da sessão não é igual ao body." })
			return
		}
		await cperfil.updateOnePerfil(req.body)
		res.status(200).json({ txt: "Perfil atualizado." })

	} else if (req.method == "DELETE") {

		if (!docperfil) {
			res.status(400).json({ txt: "Perfil não existe." })
			return
		}
		await cperfil.deleteOnePerfil()
		res.status(200).json({ txt: "Perfil excluido." })

	} else {
		res.status(400).json({ txt: "Metodo invalido." })
	}
}