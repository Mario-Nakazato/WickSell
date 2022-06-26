import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { getAllByIds } from "../../utils/produto"
import Perfil from '../../utils/perfil'

export default async function apiProduto(req: NextApiRequest, res: NextApiResponse) {

    if (req.method == "GET") {
        // const { ids } = req.body.json()

        const documentoProduto = await getAllByIds(['62b8a1aa761d06ee7cde4606', '62b89ab3761d06ee7cde4601'])
        return res.status(200).json(documentoProduto)
    }

}