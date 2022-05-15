import { ObjectId } from "mongodb"
import bdMongodb from "./bdmongo"

const bdwicksell = new bdMongodb(process.env.MONGODB_DATABASE!)
const colecao = process.env.MONGODB_COLLECTION_PRODUTO!

export default class Produto {
    
    private _id!: ObjectId
    private name!: string;
    private description!: string;
    private price!: number;
    private promoImage!: string;
    private promotion!: string;

    set(_id: any, name: any, price: any) {
        if (_id != undefined) {
            this._id = new ObjectId(_id)
        }
        if (name != undefined) {
            this.name = name
        }
        if (price != undefined) {
            this.price = Number(price)
        }
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

    async updateOne(produto: Produto) {
        //await bdwicksell.updateOne(colecao, { email: this.email }, { $set: produto })
    }

    async replaceOne(produto: Produto) {
        //await bdwicksell.replaceOne(colecao, { email: this.email }, produto)
    }

    async deleteOne() {
        await bdwicksell.deleteOne(colecao, this)
    }
}