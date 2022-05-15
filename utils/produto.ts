import { ObjectId } from "mongodb"
import bdMongodb from "./bdmongo"

const bdwicksell = new bdMongodb(process.env.MONGODB_DATABASE!)
const colecao = process.env.MONGODB_COLLECTION_PRODUTO!

export default class Produto {

    private _id!: ObjectId
    private name!: string | {};
    private description!: string | {};
    private price!: number;
    private image!: string;
    private promotion!: number;

    set(_id: any, name: any, description: any, price: any, image: any, promotion: any) {
        if (_id != undefined) {
            this._id = new ObjectId(_id)
        }
        if (name != undefined) {
            this.name = { $regex: String(name), $options: 'i' }
        }
        if (description != undefined) {
            this.description = { $regex: String(description), $options: 'i' }
        }
        if (price != undefined) {
            this.price = Number(price)
        }
        if (image != undefined) {
            this.image = String(image)
        }
        if (promotion != undefined) {
            this.promotion = Number(promotion)
        }
        console.log(this)
    }

    async insertOne() {
        await bdwicksell.insertOne(colecao, this)
    }

    async findOne() {
        return await bdwicksell.findOne(colecao, this)
    }

    async findAll() {
        return await bdwicksell.findAll(colecao, this)
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