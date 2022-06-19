import { ObjectId } from "mongodb"
import bdMongodb from "./bdmongo"

const bdwicksell = new bdMongodb(process.env.MONGODB_DATABASE!)
const colecao = process.env.MONGODB_COLLECTION_PRODUTO!

export default class Produto {

    private _id!: ObjectId
    private name!: string | {};
    private description!: string | {};
    private price!: number;
    private image!: string[];
    private discount!: number;

    set(_id: any, name: any, description: any, price: any, image: any, discount: any) {
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
    }

    async insertOne() {
        return await bdwicksell.insertOne(colecao, this)
    }

    async findOne() {
        return await bdwicksell.findOne(colecao, this)
    }

    async findAll() {

        var buscar, buscarName: any[] = [], buscarDescription: any[] = [], pesquisa

        if (this.name == undefined && this.description == undefined) {
            this.name = ''
            buscar = {
                _id: this._id,
                name: { $regex: this.name, $options: 'i' }
            }
            return pesquisa = await bdwicksell.findAll(colecao, buscar)
        }

        if (this.name) {
            buscar = {
                _id: this._id,
                name: { $regex: this.name, $options: 'i' }
            }
            buscarName = await bdwicksell.findAll(colecao, buscar)
        }

        if (this.description) {
            buscar = {
                _id: this._id,
                description: { $regex: this.description, $options: 'i' }
            }
            buscarDescription = await bdwicksell.findAll(colecao, buscar)
        }
        pesquisa = buscarName.concat(buscarDescription)

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