import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import Perfil from "../../utils/perfil"

export default async function apiPerfil(req: NextApiRequest, res: NextApiResponse) {

	const session = await getSession({ req })

	if (!session) {//req.rawHeaders.filter((value) => { return value == "insomnia/2022.3.0" })[0] !== "insomnia/2022.3.0"
		res.status(400).json({ txt: "Acesso negado." })
		return
	}

	const perfil = new Perfil()
	const email = await perfil.setEmail(session?.user?.email!)

	if (email == undefined) {
		res.status(400).json({ txt: "Email não existe." })
		return
	}

	const docperfil = await perfil.findOne()

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
		const { name, birthDate, cpf, phone } = req.body
		perfil.set(name, birthDate, cpf, phone)
		await perfil.insertOne()
		res.status(200).json({ txt: "Perfil criado.", perfil })

	} else if (req.method == "PUT") {

		if (!docperfil) {
			res.status(400).json({ txt: "Perfil não existe." })
			return
		}
		if (req.body.email != email) {
			res.status(400).json({ txt: "Email da sessão não é igual ao body." })
			return
		}
		const { name, birthDate, cpf, phone } = req.body
		perfil.set(name, birthDate, cpf, phone)
		await perfil.replaceOne()
		res.status(200).json({ txt: "Perfil substituído." })

	} else if (req.method == "PATCH") {

		if (!docperfil) {
			res.status(400).json({ txt: "Perfil não existe." })
			return
		}
		if (req.body.email != email) {
			res.status(400).json({ txt: "Email da sessão não é igual ao body." })
			return
		}
		const { name, birthDate, cpf, phone } = req.body
		perfil.set(name, birthDate, cpf, phone)
		await perfil.updateOne()
		res.status(200).json({ txt: "Perfil atualizado." })

	} else if (req.method == "DELETE") {

		if (!docperfil) {
			res.status(400).json({ txt: "Perfil não existe." })
			return
		}
		await perfil.deleteOne()
		res.status(200).json({ txt: "Perfil excluído." })

	} else {
		res.status(400).json({ txt: "Método invalido." })
	}
}