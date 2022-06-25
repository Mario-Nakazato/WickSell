import { ObjectId } from "mongodb"
import bdMongodb from "./bdmongo"

const bdwicksell = new bdMongodb(process.env.MONGODB_DATABASE!)
const colecao = process.env.MONGODB_COLLECTION_PRODUTO!

export default class Produto {

    private _id!: ObjectId
    private name!: string | {}
    private description!: string | {}
    private price!: number
    private image!: string[]
    private discount!: number
    private amount!: number
    private _idPerfil!: string

    set(_id: any, name: any, description: any, price: any, image: any, discount: any, amount: any, _idPerfil: any) {
        if (_id != undefined) {
            this._id = new ObjectId(_id)
        }
        if (name != undefined) {
            this.name = String(name)
        }
        if (description != undefined) {
            this.description = String(description)
        }
        if (price != undefined) {
            this.price = Number(price)
        }
        if (image != undefined) {
            this.image = new Array(image)
        }
        if (discount != undefined) {
            this.discount = Number(discount)
        }
        if (amount != undefined) {
            this.amount = Number(amount)
        }
        if (_idPerfil != undefined) {
            this._idPerfil = String(_idPerfil)
        }
    }

    async insertOne() {
        return await bdwicksell.insertOne(colecao, this)
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

        if (this.name) {
            buscar = {
                name: { $regex: this.name, $options: 'i' }
            }
            pesquisa = await bdwicksell.findAll(colecao, buscar)
        }

        if (this.description) {
            buscar = {
                description: { $regex: this.description, $options: 'i' }
            }
            procura = await bdwicksell.findAll(colecao, buscar)
            pesquisa = pesquisa.concat(procura)
        }

        if (this.price) {
            buscar = {
                price: { $lte: this.price }
            }
            procura = await bdwicksell.findAll(colecao, buscar)
            pesquisa = pesquisa.concat(procura)
        }

        if (this.discount) {
            buscar = {
                discount: { $lte: this.discount }
            }
            procura = await bdwicksell.findAll(colecao, buscar)
            pesquisa = pesquisa.concat(procura)
        }

        if (this._idPerfil) {
            buscar = {
                _idPerfil: { $regex: this._idPerfil, $options: 'i' }
            }
            procura = await bdwicksell.findAll(colecao, buscar)
            pesquisa = pesquisa.concat(procura)
        }

        if (pesquisa.length == 0) {
            this.name = ''
            buscar = {
                name: { $regex: this.name, $options: 'i' }
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