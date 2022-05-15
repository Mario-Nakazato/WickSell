import bdMongodb from "./bdmongo"
import Auth from "./auth"

const bdwicksell = new bdMongodb(process.env.MONGODB_DATABASE!)
const colecao = process.env.MONGODB_COLLECTION_PERFIL!
const auth = new Auth()

export default class Perfil {

    private email!: string
    name!: string
    birthDate!: string
    cpf!: string
    phone!: string
    carrinho!: any[]
    estoque!: any[]

    async setEmail(sub: string) {
        const docprofile = await auth.setProfile(sub)
        return this.email = docprofile?.email
    }

    async setPerfil(sub: string) {
        const email = await this.setEmail(sub)
        const docperfil = await this.findOne()
        return { email: email, docperfil: docperfil }
    }

    async insertOne(perfil: Perfil) {
        await bdwicksell.insertOne(colecao, perfil)
    }

    async findOne() {
        return await bdwicksell.findOne(colecao, { email: this.email })
    }

    async updateOne(perfil: Perfil) {
        await bdwicksell.updateOne(colecao, { email: this.email }, { $set: perfil })
    }

    async replaceOne(perfil: Perfil) {
        await bdwicksell.replaceOne(colecao, { email: this.email }, perfil)
    }

    async deleteOne() {
        await bdwicksell.deleteOne(colecao, { email: this.email })
    }
}