import type { NextApiRequest, NextApiResponse } from 'next'
import Produto from "../../utils/produto"

export default async function apiProduto(req: NextApiRequest, res: NextApiResponse) {

    const produto = new Produto()
    
    if (req.method == "GET") {

        const { _id, name, description, price, promotion } = req.query
        try {
            produto.set(_id, name, description, price, null, promotion)
        } catch (e) {
            res.status(400).json({ txt: "_id invalido." })
            return
        }
        const docproduto = await produto.findAll()
        res.status(200).json(docproduto)

    } else if (req.method == "POST") {

        const { name, description, price, image, promotion } = req.body
        try {
            produto.set(null, name, description, price, image, promotion)
        } catch (e) {
            res.status(400).json({ txt: "_id invalido." })
            return
        }
        await produto.insertOne()
        res.status(200).json({ txt: "Produto criado." })

    } else if (req.method == "PUT") {

        const { _id, name, description, price, image, promotion } = req.body
        if (!_id) {
            res.status(400).json({ txt: "_id não encontrado no body." })
            return
        }
        produto.set(_id, null, null, null, null, null)
        const docproduto = await produto.findOne()
        if (!docproduto) {
            res.status(400).json({ txt: "Produto não existe." })
            return
        }
        produto.set(_id, name, description, price, image, promotion)
        await produto.replaceOne()
        res.status(200).json({ txt: "Produto substituido." })

    } else if (req.method == "PATCH") {

        const { _id, name, description, price, image, promotion } = req.body
        if (!_id) {
            res.status(400).json({ txt: "_id não encontrado no body." })
            return
        }
        produto.set(_id, null, null, null, null, null)
        const docproduto = await produto.findOne()
        if (!docproduto) {
            res.status(400).json({ txt: "Produto não existe." })
            return
        }
        produto.set(_id, name, description, price, image, promotion)
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
        const docproduto = await produto.findOne()
        if (!docproduto) {
            res.status(400).json({ txt: "Produto não existe." })
            return
        }
        await produto.deleteOne()
        res.status(200).json({ txt: "Produto excluido." })

    } else {
        res.status(400).json({ txt: "Metodo invalido." })
    }
}