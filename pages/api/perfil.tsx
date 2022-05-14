import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import Perfil from "../../utils/perfil"

const perfil = new Perfil()

export default async function apiPerfil(req: NextApiRequest, res: NextApiResponse) {

	const session = await getSession({ req })

	if (!session) {//req.rawHeaders.filter((value) => { return value == "insomnia/2022.3.0" })[0] !== "insomnia/2022.3.0"
		res.status(400).json({ txt: "Acesso negado." })
		return
	}

	const { email, docperfil } = await perfil.setPerfil(session?.user?.email!)

	if (email == undefined) {
		res.status(400).json({ txt: "Email não existe." })
		return
	}

	if (req.method == "GET") {

		if (!docperfil) {
			res.status(200).json({ email: email })
			return
		}
		res.status(200).json(docperfil)

	} else if (req.method == "POST") {

		if (docperfil) {
			res.status(400).json({ txt: "Perfil já existe." })
			return
		}
		if (req.body.email != email) {
			res.status(400).json({ txt: "Email da sessão não é igual ao body." })
			return
		}
		await perfil.insertOnePerfil(req.body)
		res.status(200).json({ txt: "Perfil criado." })

	} else if (req.method == "PUT") {

		if (!docperfil) {
			res.status(400).json({ txt: "Perfil não existe." })
			return
		}
		if (req.body.email != email) {
			res.status(400).json({ txt: "Email da sessão não é igual ao body." })
			return
		}
		await perfil.replaceOnePerfil(req.body)
		res.status(200).json({ txt: "Perfil substituido." })

	} else if (req.method == "PATCH") {

		if (!docperfil) {
			res.status(400).json({ txt: "Perfil não existe." })
			return
		}
		if (req.body.email != email) {
			res.status(400).json({ txt: "Email da sessão não é igual ao body." })
			return
		}
		await perfil.updateOnePerfil(req.body)
		res.status(200).json({ txt: "Perfil atualizado." })

	} else if (req.method == "DELETE") {

		if (!docperfil) {
			res.status(400).json({ txt: "Perfil não existe." })
			return
		}
		await perfil.deleteOnePerfil()
		res.status(200).json({ txt: "Perfil excluido." })

	} else {
		res.status(400).json({ txt: "Metodo invalido." })
	}
}