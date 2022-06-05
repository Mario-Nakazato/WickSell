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
    private promotion!: number;

    set(_id: any, name: any, description: any, price: any, image: any, promotion: any) {
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
        if (promotion != undefined) {
            this.promotion = Number(promotion)
        }
    }

    async insertOne() {
        return await bdwicksell.insertOne(colecao, this)
    }

    async findOne() {
        return await bdwicksell.findOne(colecao, this)
    }

    async findAll() {

        this.name == undefined ? this.name = '' : this.name
        this.description == undefined ? this.description = '' : this.description
        var buscar = {
            _id: this._id,
            name: { $regex: this.name, $options: 'i' },
            description: { $regex: this.description, $options: 'i' }
        }
        return await bdwicksell.findAll(colecao, buscar)
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