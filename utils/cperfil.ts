import Mongodb from "./bdmongo"
import profile from "./cprofile"

const bdwicksell = new Mongodb(process.env.MONGODB_DATABASE!)
const cprofile = new profile(process.env.MONGODB_COLLECTION_PROFILE!)

export default class perfil {
    private colecao: string
    private email: string = ""

    constructor(colecao: string) {
        this.colecao = colecao
    }

    async setEmail(sub: string) {
        const docprofile = await cprofile.findOneProfile({ sub: sub })
        return this.email = docprofile?.email
    }

    async insertOnePerfil(perfil: {}) {
        await bdwicksell.insertOne(this.colecao, perfil)
    }

    async findOnePerfil() {
        return await bdwicksell.findOne(this.colecao, { email: this.email })
    }

    async replaceOnePerfil(perfil: {}) {
        await bdwicksell.replaceOne(this.colecao, { email: this.email }, perfil)
    }

    async deleteOnePerfil() {
        await bdwicksell.deleteOne(this.colecao, { email: this.email })
    }
}