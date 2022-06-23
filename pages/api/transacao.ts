import type { NextApiRequest, NextApiResponse } from 'next'

export default async function apiTransacao(req: NextApiRequest, res: NextApiResponse) {

    if (req.method == "GET") {

        return res.status(200).json({ txt: "GET." })
        
    } else if (req.method == "POST") {

        return res.status(200).json({ txt: "POST." })
        
    } else if (req.method == "PUT") {

        return res.status(200).json({ txt: "PUT." })
        
    } else if (req.method == "PATCH") {

        return res.status(200).json({ txt: "PATCH." })
        
    } else if (req.method == "DELETE") {

        return res.status(200).json({ txt: "DELETE." })
        
    } else {
        res.status(400).json({ txt: "Método invalido." })
    }

}
