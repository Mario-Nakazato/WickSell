import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import Produto from "../../utils/produto"
import Perfil from '../../utils/perfil'

export default async function apiProduto(req: NextApiRequest, res: NextApiResponse) {

    const produto = new Produto()

    if (req.method == "GET") {

        const { _id, name, description, price, discount, amount, _idPerfil } = req.query
        try {
            produto.set(_id, name, description, price, null, discount, amount, _idPerfil)
        } catch (e) {
            res.status(400).json({ txt: "_id invalido." })
            return
        }
        const documentoProduto = await produto.findAll()
        res.status(200).json(documentoProduto)
        return
    }

    const session = await getSession({ req })
    if (!session /*&& req.rawHeaders.filter((value) => { return value == "insomnia/2022.4.2" })[0] !== "insomnia/2022.4.2"*/) {
        res.status(400).json({ txt: "Acesso negado." })
        return
    }

    const perfil = new Perfil()
    const email = await perfil.setEmail(session?.user?.email!)
    const documentoPerfil = await perfil.findOne()

    if (req.method == "POST") {

        if (!documentoPerfil) {
            res.status(400).json({ txt: "Perfil não existe." })
            return
        }

        const { name, description, price, discount, imageFilesName, amount } = req.body
        try {
            produto.set(null, name, description, price, imageFilesName, discount, amount, documentoPerfil._id.toString())
        } catch (e) {
            res.status(400).json({ txt: "_id invalido." })
            return
        }
        const insertedProduto = await produto.insertOne()

        perfil.setEstoque(documentoPerfil?.estoque)
        await perfil.inserirProdutoEstoque(insertedProduto.insertedId.toString())

        /*//Apenas para debugar insomnia
        if (req.rawHeaders.filter((value) => { return value == "insomnia/2022.4.2" })[0] === "insomnia/2022.4.2") {
            res.status(200).json({ txt: "Produto criado. Insomnia" })
            return
        }*/

        const redirectUrl = '/produto/' + insertedProduto.insertedId
        res.redirect(308, redirectUrl)

    } else if (req.method == "PUT") {

        const { _id, name, description, price, image, discount, amount, _idPerfil } = req.body
        if (!_id) {
            res.status(400).json({ txt: "_id não encontrado no body." })
            return
        }

        perfil.setEstoque(documentoPerfil?.estoque)
        if (perfil.getProdutoEstoque(_id) == -1) {
            res.status(400).json({ txt: "Produto não pertence ao perfil." })
            return
        }

        produto.set(_id, null, null, null, null, null, null, null)
        const documentoProduto = await produto.findOne()
        if (!documentoProduto) {
            res.status(400).json({ txt: "Produto não existe." })
            return
        }
        produto.set(_id, name, description, price, image, discount, amount, _idPerfil)
        await produto.replaceOne()
        res.status(200).json({ txt: "Produto substituído." })

    } else if (req.method == "PATCH") {

        const { _id, name, description, price, image, discount, amount, _idPerfil } = req.body
        if (!_id) {
            res.status(400).json({ txt: "_id não encontrado no body." })
            return
        }

        perfil.setEstoque(documentoPerfil?.estoque)
        if (perfil.getProdutoEstoque(_id) == -1) {
            res.status(400).json({ txt: "Produto não pertence ao perfil." })
            return
        }

        produto.set(_id, null, null, null, null, null, null, null)
        const documentoProduto = await produto.findOne()
        if (!documentoProduto) {
            res.status(400).json({ txt: "Produto não existe." })
            return
        }
        produto.set(_id, name, description, price, image, discount, amount, _idPerfil)
        await produto.updateOne()
        res.status(200).json({ txt: "Produto atualizado." })

    } else if (req.method == "DELETE") {

        const { _id } = req.query
        if (!_id) {
            res.status(400).json({ txt: "_id não existe." })
            return
        }
        try {
            produto.set(_id, null, null, null, null, null, null, null)
        } catch (e) {
            res.status(400).json({ txt: "_id invalido." })
            return
        }
        const documentoProduto = await produto.findOne()
        if (!documentoProduto) {
            res.status(400).json({ txt: "Produto não existe." })
            return
        }

        perfil.setEstoque(documentoPerfil?.estoque)
        if (perfil.getProdutoEstoque(_id) == -1) {
            res.status(400).json({ txt: "Produto não pertence ao perfil." })
            return
        }

        await produto.deleteOne()
        await perfil.excluirProdutoEstoque(_id)

        res.status(200).json({ txt: "Produto excluído." })

    } else {
        res.status(400).json({ txt: "Método invalido." })
    }
}