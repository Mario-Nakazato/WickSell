import bdMongodb from "./bdmongo"
import { ObjectId } from "mongodb"
import Produto from "../utils/produto"

const bdwicksell = new bdMongodb(process.env.MONGODB_DATABASE!)
const colecao = process.env.MONGODB_COLLECTION_TRANSACAO!

interface compra { Produto: typeof Produto, quantidade: number }

export default class Transacao {

    private _id!: ObjectId | undefined
    private comprador!: string
    private carrinho!: compra[]
    private estado!: string

    set(_id: any, comprador: any, carrinho: compra[] | null, estado: any) {
        if (_id != undefined) {
            this._id = new ObjectId(_id)
        }
        if (comprador != undefined) {
            this.comprador = String(comprador)
        }
        if (estado != undefined) {
            this.estado = String(estado)
        }
        if (carrinho != undefined) {
            this.carrinho = carrinho
        }
    }

    async insertOne() {
        await bdwicksell.insertOne(colecao, this)
    }

    async findOne() {
        return await bdwicksell.findOne(colecao, this)
    }

    async findAll() {

        var buscar, pesquisa: any[] = [], procura: any[] = []

        if (this._id) {
            buscar = {
                _id: this._id
            }
            pesquisa = await bdwicksell.findAll(colecao, buscar)
        }

        if (this.comprador) {
            buscar = {
                comprador: { $regex: this.comprador, $options: 'i' }
            }
            procura = await bdwicksell.findAll(colecao, buscar)
            pesquisa = pesquisa.concat(procura)
        }

        if (this.estado) {
            buscar = {
                estado: { $regex: this.estado, $options: 'i' }
            }
            procura = await bdwicksell.findAll(colecao, buscar)
            pesquisa = pesquisa.concat(procura)
        } else {
            this._id = undefined
            buscar = {
                _id: this._id,
            }
            return pesquisa = await bdwicksell.findAll(colecao, buscar)
        }

        pesquisa = pesquisa.filter(
            function (e, i) {
                var j
                for (j = 0; j < pesquisa.length; j++) {
                    if (pesquisa[j]._id.toString() == e._id.toString()) {
                        break
                    }
                }
                return j === i
            }
        )

        return pesquisa
    }

    async updateOne() {
        await bdwicksell.updateOne(colecao, { _id: this._id }, { $set: this })
    }

    async replaceOne() {
        await bdwicksell.replaceOne(colecao, { _id: this._id }, this)
    }

    async deleteOne() {
        await bdwicksell.deleteOne(colecao, this)
    }
}