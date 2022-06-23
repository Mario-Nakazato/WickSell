import type { NextApiRequest, NextApiResponse } from 'next'

export default async function apiTransacao(req: NextApiRequest, res: NextApiResponse) {

    if (req.method == "GET") {

        res.status(200).json({ txt: "GET." })
        return
    } else if (req.method == "POST") {

        res.status(200).json({ txt: "POST." })
        return
    } else if (req.method == "PUT") {

        res.status(200).json({ txt: "PUT." })
        return
    } else if (req.method == "PATCH") {

        res.status(200).json({ txt: "PATCH." })
        return
    } else if (req.method == "DELETE") {

        res.status(200).json({ txt: "DELETE." })
        return
    } else {
        res.status(400).json({ txt: "Método invalido." })
    }

}
