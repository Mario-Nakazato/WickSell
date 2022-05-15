import type { NextApiRequest, NextApiResponse } from 'next'
import Produto from "../../utils/produto"

export default async function apiProduto(req: NextApiRequest, res: NextApiResponse) {

    const produto = new Produto()

    if (req.method == "GET") {

        const { _id, name, price } = req.query
        try {
            produto.set(_id, name, price)
        } catch (e) {
            res.status(400).json({ txt: "_id invalido." })
            return
        }
        const docproduto = await produto.findAll()
        res.status(200).json(docproduto)

    } else if (req.method == "POST") {
        
        const { name, price } = req.body
        try {
            produto.set(null, name, price)
        } catch (e) {
            res.status(400).json({ txt: "_id invalido." })
            return
        }
        await produto.insertOne()
        res.status(200).json({ txt: "POST", produto: produto })

    } else if (req.method == "PUT") {

        res.status(200).json({ txt: "PUT" })

    } else if (req.method == "PATCH") {

        res.status(200).json({ txt: "PATCH" })

    } else if (req.method == "DELETE") {

        if (!req.query._id) {
            res.status(400).json({ txt: "_id não existe." })
            return
        }
        try {
            produto.set(req.query._id, null, null)
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