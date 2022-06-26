import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import Produto from "../../utils/produto"
import Perfil from '../../utils/perfil'
//import { getAllByIds } from "../../utils/produto"

export default async function apiProduto(req: NextApiRequest, res: NextApiResponse) {

    const produto = new Produto()

    if (req.method == "GET") {

        const { _id, name, description, price, discount, amount, email/*, _ids*/ } = req.query

        /*if (_ids !== undefined) {
            const documentoProduto = await getAllByIds(_ids)
            return res.status(200).json(documentoProduto)
        }*/

        try {
            produto.set(_id, name, description, price, null, discount, amount, email)
        } catch (e) {
            return res.status(400).json({ txt: "_id invalido." })
        }
        const documentoProduto = await produto.findAll()
        return res.status(200).json(documentoProduto)
    }

    const session: any = await getSession({ req })
    if (!session /*&& req.rawHeaders.filter((value) => { return value == "insomnia/2022.4.2" })[0] !== "insomnia/2022.4.2"*/) {
        return res.status(400).json({ txt: "Acesso negado." })
    }

    const perfil = new Perfil()
    const email = await perfil.setEmail(session?.user?.sub!)
    const documentoPerfil = await perfil.findOne()

    if (req.method == "POST") {

        if (!documentoPerfil) {
            return res.status(400).json({ txt: "Perfil não existe." })
        }

        const { name, description, price, discount, imageFilesName, amount } = req.body
        try {
            produto.set(null, name, description, price, imageFilesName, discount, amount, email)
        } catch (e) {
            return res.status(400).json({ txt: "_id invalido." })
        }
        const insertedProduto = await produto.insertOne()

        /*//Apenas para debugar insomnia
        if (req.rawHeaders.filter((value) => { return value == "insomnia/2022.4.2" })[0] === "insomnia/2022.4.2") {
            return res.status(200).json({ txt: "Produto criado. Insomnia" })
        }*/

        const redirectUrl = '/produto/' + insertedProduto.insertedId
        res.redirect(308, redirectUrl)

    } else if (req.method == "PUT") {

        const { _id, name, description, price, imageFilesName, discount, amount } = req.body
        if (!_id) {
            return res.status(400).json({ txt: "_id não encontrado no body." })
        }

        produto.set(_id, null, null, null, null, null, null, null)
        const documentoProduto = await produto.findOne()
        if (!documentoProduto) {
            return res.status(400).json({ txt: "Produto não existe." })
        }

        if (documentoProduto.email !== email) {
            return res.status(400).json({ txt: "Produto não pertence ao perfil." })
        }

        produto.set(_id, name, description, price, imageFilesName, discount, amount, email)
        await produto.replaceOne()
        res.status(200).json({ txt: "Produto substituído." })

    } else if (req.method == "PATCH") {

        const { _id, name, description, price, imageFilesName, discount, amount } = req.body
        if (!_id) {
            return res.status(400).json({ txt: "_id não encontrado no body." })
        }

        produto.set(_id, null, null, null, null, null, null, null)
        const documentoProduto = await produto.findOne()
        if (!documentoProduto) {
            return res.status(400).json({ txt: "Produto não existe." })
        }

        if (documentoProduto.email !== email) {
            return res.status(400).json({ txt: "Produto não pertence ao perfil." })
        }

        produto.set(_id, name, description, price, imageFilesName, discount, amount, null)
        await produto.updateOne()
        res.status(200).json({ txt: "Produto atualizado." })

    } else if (req.method == "DELETE") {

        const { _id } = req.query
        if (!_id) {
            return res.status(400).json({ txt: "_id não existe." })
        }
        try {
            produto.set(_id, null, null, null, null, null, null, null)
        } catch (e) {
            return res.status(400).json({ txt: "_id invalido." })

        }
        const documentoProduto = await produto.findOne()
        if (!documentoProduto) {
            return res.status(400).json({ txt: "Produto não existe." })
        }

        if (documentoProduto.email !== email) {
            return res.status(400).json({ txt: "Produto não pertence ao perfil." })
        }

        await produto.deleteOne()

        res.status(200).json({ txt: "Produto excluído." })

    } else {
        res.status(400).json({ txt: "Método invalido." })
    }
}