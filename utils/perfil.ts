import bdMongodb from "./bdmongo"
import Auth from "./auth"

const bdwicksell = new bdMongodb(process.env.MONGODB_DATABASE!)
const colecao = process.env.MONGODB_COLLECTION_PERFIL!
const auth = new Auth()

export default class Perfil {

    private email!: string
    private name!: string
    private birthDate!: string
    private cpf!: string
    private phone!: string
    private carrinho: any[] = []
    private estoque: any[] = []

    set(name: string, birthDate: string, cpf: string, phone: string) {
        this.name = name
        this.birthDate = birthDate
        this.cpf = cpf
        this.phone = phone
    }

    async setEmail(sub: string) {
        const docprofile = await auth.setProfile(sub)
        return this.email = docprofile?.email
    }

    async insertOne() {
        await bdwicksell.insertOne(colecao, this)
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