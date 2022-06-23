import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import Perfil from "../../utils/perfil"

export default async function apiPerfil(req: NextApiRequest, res: NextApiResponse) {

	const session = await getSession({ req })

	if (!session /*&& req.rawHeaders.filter((value) => { return value == "insomnia/2022.4.2" })[0] !== "insomnia/2022.4.2"*/) {
		return res.status(400).json({ txt: "Acesso negado." })
	}

	const perfil = new Perfil()
	const email = await perfil.setEmail(session?.user?.email!)

	if (email == undefined) {
		return res.status(400).json({ txt: "Email não existe." })
	}

	const documentoPerfil = await perfil.findOne()

	if (req.method == "GET") {

		if (!documentoPerfil) {
			return res.status(200).json({ email: email })
		}
		res.status(200).json(documentoPerfil)

	} else if (req.method == "POST") {

		if (documentoPerfil) {
			return res.status(400).json({ txt: "Perfil já existe." })
		}
		if (req.body.email != email) {
			return res.status(400).json({ txt: "Email da sessão não é igual ao body." })
		}
		const { name, birthDate, cpf, phone } = req.body
		perfil.set(name, birthDate, cpf, phone)
		await perfil.insertOne()
		res.status(200).json({ txt: "Perfil criado.", perfil })

	} else if (req.method == "PUT") {

		if (!documentoPerfil) {
			return res.status(400).json({ txt: "Perfil não existe." })
		}
		if (req.body.email != email) {
			return res.status(400).json({ txt: "Email da sessão não é igual ao body." })
		}
		const { name, birthDate, cpf, phone } = req.body
		perfil.set(name, birthDate, cpf, phone)
		await perfil.replaceOne()
		res.status(200).json({ txt: "Perfil substituído." })

	} else if (req.method == "PATCH") {

		if (!documentoPerfil) {
			return res.status(400).json({ txt: "Perfil não existe." })
		}
		if (req.body.email != email) {
			return res.status(400).json({ txt: "Email da sessão não é igual ao body." })
		}
		const { name, birthDate, cpf, phone } = req.body
		perfil.set(name, birthDate, cpf, phone)
		await perfil.updateOne()
		res.status(200).json({ txt: "Perfil atualizado." })

	} else if (req.method == "DELETE") {

		if (!documentoPerfil) {
			return res.status(400).json({ txt: "Perfil não existe." })
		}
		await perfil.deleteOne()
		res.status(200).json({ txt: "Perfil excluído." })

	} else {
		res.status(400).json({ txt: "Método invalido." })
	}
}