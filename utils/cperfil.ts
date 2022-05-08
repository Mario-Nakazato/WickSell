import bdMongodb from "./bdmongo"
import Auth from "./auth"

const bdwicksell = new bdMongodb(process.env.MONGODB_DATABASE!)
const auth = new Auth()

export default class perfil {
    private colecao: string
    private email: string | undefined

    constructor(colecao: string) {
        this.colecao = colecao
    }

    async setEmail(sub: string) {
        const docprofile = await auth.setProfile(sub)
        return this.email = docprofile?.email
    }

    async insertOnePerfil(perfil: {}) {
        await bdwicksell.insertOne(this.colecao, perfil)
    }

    async findOnePerfil() {
        return await bdwicksell.findOne(this.colecao, { email: this.email })
    }

    async updateOnePerfil(perfil: {}) {
        await bdwicksell.updateOne(this.colecao, { email: this.email }, { $set: perfil })
    }

    async replaceOnePerfil(perfil: {}) {
        await bdwicksell.replaceOne(this.colecao, { email: this.email }, perfil)
    }

    async deleteOnePerfil() {
        await bdwicksell.deleteOne(this.colecao, { email: this.email })
    }
}