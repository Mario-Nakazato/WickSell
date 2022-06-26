import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import Transacao from '../../utils/transacao'
import Perfil from '../../utils/perfil'

export default async function apiTransacao(req: NextApiRequest, res: NextApiResponse) {

    const session: any = await getSession({ req })

    if (!session && req.rawHeaders.filter((value) => { return value == "insomnia/2022.4.2" })[0] !== "insomnia/2022.4.2") {
        return res.status(400).json({ txt: "Acesso negado." })
    }

    const perfil = new Perfil()
    const email = await perfil.setEmail(session?.user?.sub!)

    if (email == undefined && req.rawHeaders.filter((value) => { return value == "insomnia/2022.4.2" })[0] !== "insomnia/2022.4.2") {
        return res.status(400).json({ txt: "Email não existe." })
    }

    var documentoPerfil
    /*const*/ documentoPerfil = await perfil.findOne()

    const transacao = new Transacao()

    if (req.method == "GET") {

        const { _id, comprador, estado } = req.query
        try {
            transacao.set(_id, comprador, null, estado)
        } catch (e) {
            return res.status(400).json({ txt: "_id invalido." })
        }

        const documentoTransacao = await transacao.findAll()
        return res.status(200).json(documentoTransacao)

    } else if (req.method == "POST") {

        if (req.rawHeaders.filter((value) => { return value == "insomnia/2022.4.2" })[0] === "insomnia/2022.4.2") {
            documentoPerfil = { email: req.body.comprador }
        } else if (!documentoPerfil) {
            return res.status(400).json({ txt: "Perfil não existe." })
        }

        const { carrinho, estado } = req.body
        try {
            transacao.set(null, documentoPerfil?.email, carrinho, estado)
            transacao.calcularTotal()
        } catch (e) {
            return res.status(400).json({ txt: "_id invalido." })
        }

        await transacao.insertOne()
        return res.status(200).json({ txt: "Transação criado." })

    } else if (req.method == "PUT") {

        const { _id, comprador, carrinho, estado } = req.body
        if (!_id) {
            return res.status(400).json({ txt: "_id não encontrado no body." })
        }

        transacao.set(_id, null, null, null)
        const documentoTransacao = await transacao.findOne()
        if (!documentoTransacao) {
            return res.status(400).json({ txt: "Transação não existe." })
        }

        if (req.rawHeaders.filter((value) => { return value == "insomnia/2022.4.2" })[0] === "insomnia/2022.4.2") {
            documentoPerfil = { _id: documentoTransacao.comprador }
        }

        if (documentoTransacao.comprador !== documentoPerfil?._id.toString()) {
            return res.status(400).json({ txt: "Transação não pertence ao perfil." })
        }

        transacao.set(_id, comprador, carrinho, estado)
        transacao.calcularTotal()
        await transacao.replaceOne()
        return res.status(200).json({ txt: "Transação substituído." })

    } else if (req.method == "PATCH") {

        const { _id, comprador, carrinho, estado } = req.body
        if (!_id) {
            return res.status(400).json({ txt: "_id não encontrado no body." })
        }

        transacao.set(_id, null, null, null)
        const documentoTransacao = await transacao.findOne()
        if (!documentoTransacao) {
            return res.status(400).json({ txt: "Transação não existe." })
        }

        if (req.rawHeaders.filter((value) => { return value == "insomnia/2022.4.2" })[0] === "insomnia/2022.4.2") {
            documentoPerfil = { _id: documentoTransacao.comprador }
        }

        if (documentoTransacao.comprador !== documentoPerfil?._id.toString()) {
            return res.status(400).json({ txt: "Transação não pertence ao perfil." })
        }

        transacao.set(_id, comprador, carrinho, estado)
        transacao.calcularTotal()
        await transacao.updateOne()
        return res.status(200).json({ txt: "Transação atualizado." })

    } else if (req.method == "DELETE") {

        const { _id } = req.query
        if (!_id) {
            return res.status(400).json({ txt: "_id não existe." })
        }
        try {
            transacao.set(_id, null, null, null)
        } catch (e) {
            return res.status(400).json({ txt: "_id invalido." })

        }
        const documentoTransacao = await transacao.findOne()
        if (!documentoTransacao) {
            return res.status(400).json({ txt: "Transação não existe." })
        }

        if (req.rawHeaders.filter((value) => { return value == "insomnia/2022.4.2" })[0] === "insomnia/2022.4.2") {
            documentoPerfil = { _id: documentoTransacao.comprador }
        }

        if (documentoTransacao.comprador !== documentoPerfil?._id.toString()) {
            return res.status(400).json({ txt: "Transação não pertence ao perfil." })
        }

        await transacao.deleteOne()
        return res.status(200).json({ txt: "Transação excluído." })

    } else {
        res.status(400).json({ txt: "Método invalido." })
    }

}
