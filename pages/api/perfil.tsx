import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from "next-auth/react"
import perfil from "../../utils/cperfil"

const cperfil = new perfil(process.env.MONGODB_COLLECTION_PERFIL!)

export default async function apiPerfil(req: NextApiRequest, res: NextApiResponse) {

	console.log("API PERFIL")
	console.log("QUERY")
	console.log(req.query)
	console.log("BODY")
	console.log(req.body)
	console.log("RAWHEADERS")
	console.log(req.rawHeaders)

	const session = await getSession({ req })

	if (!session && req.rawHeaders.filter((value) => { return value == "insomnia/2022.3.0" }) !== ["insomnia/2022.3.0"]) {
		res.status(400).json(req.rawHeaders.filter((value) => { return value == "insomnia/2022.3.0" }))
		return
	}

	if (req.method == "GET") {

		if (req.query.email == undefined) {
			res.status(400).json({ txt: "Perfil precisa de um email" })
			return
		}
		const docperfil = await cperfil.findOnePerfil({ email: req.query.email })
		if (!docperfil) {
			res.status(400).json({ txt: "Este perfil não existe" })
			return
		}
		res.status(200).json(docperfil)

	} else if (req.method == "POST") {

		if (req.body.email == undefined) {
			res.status(400).json({ txt: "Perfil precisa de um email" })
			return
		}
		const docperfil = await cperfil.findOnePerfil(req.body)
		if (docperfil) {
			res.status(400).json({ txt: "Este perfil já foi criado" })
			return
		}
		await cperfil.insertOnePerfil(req.body)
		res.status(200).json({ txt: "Perfil criado" })

	} else if (req.method == "PUT") {

		res.status(200).json({ txt: "Não implementado alteração generica" })
	} else if (req.method == "PATCH") {

		res.status(200).json({ txt: "Não implementado alteração especifica" })
	} else if (req.method == "DELETE") {

		res.status(200).json({ txt: "Não implementado deletar perfil" })

	} else {
		res.status(400).json({ txt: "Metodo invalido" })
	}
}