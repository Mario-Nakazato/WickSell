import multer from 'multer'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import Produto from "../../utils/produto"

export default async function apiProduto(req: NextApiRequest, res: NextApiResponse) {

    const produto = new Produto()

    if (req.method == "GET") {

        const { _id, name, description, price, discount } = req.query
        try {
            produto.set(_id, name, description, price, null, discount)
        } catch (e) {
            res.status(400).json({ txt: "_id invalido." })
            return
        }
        const documentoProduto = await produto.findAll()
        res.status(200).json(documentoProduto)
        return
    }

    const session = await getSession({ req })

    if (!session && req.rawHeaders.filter((value) => { return value == "insomnia/2022.4.1" })[0] !== "insomnia/2022.4.1") {
        res.status(400).json({ txt: "Acesso negado." })
        return
    }

    if (req.method == "POST") {

        const { name, description, price, discount, imageFilesName } = req.body
        try {
            produto.set(null, name, description, price, imageFilesName, discount)
        } catch (e) {
            res.status(400).json({ txt: "_id invalido." })
            return
        }
        const insertedProduto = await produto.insertOne()

        const redirectUrl = '/produto/' + insertedProduto.insertedId
        res.redirect(308, redirectUrl)
        
    } else if (req.method == "PUT") {

        const { _id, name, description, price, image, discount } = req.body
        if (!_id) {
            res.status(400).json({ txt: "_id não encontrado no body." })
            return
        }
        produto.set(_id, null, null, null, null, null)
        const documentoProduto = await produto.findOne()
        if (!documentoProduto) {
            res.status(400).json({ txt: "Produto não existe." })
            return
        }
        produto.set(_id, name, description, price, image, discount)
        await produto.replaceOne()
        res.status(200).json({ txt: "Produto substituído." })

    } else if (req.method == "PATCH") {

        const { _id, name, description, price, image, discount } = req.body
        if (!_id) {
            res.status(400).json({ txt: "_id não encontrado no body." })
            return
        }
        produto.set(_id, null, null, null, null, null)
        const documentoProduto = await produto.findOne()
        if (!documentoProduto) {
            res.status(400).json({ txt: "Produto não existe." })
            return
        }
        produto.set(_id, name, description, price, image, discount)
        await produto.updateOne()
        res.status(200).json({ txt: "Produto atualizado." })

    } else if (req.method == "DELETE") {

        const { _id } = req.query
        if (!_id) {
            res.status(400).json({ txt: "_id não existe." })
            return
        }
        try {
            produto.set(_id, null, null, null, null, null)
        } catch (e) {
            res.status(400).json({ txt: "_id invalido." })
            return
        }
        const documentoProduto = await produto.findOne()
        if (!documentoProduto) {
            res.status(400).json({ txt: "Produto não existe." })
            return
        }
        await produto.deleteOne()
        res.status(200).json({ txt: "Produto excluído." })

    } else {
        res.status(400).json({ txt: "Método invalido." })
    }
}