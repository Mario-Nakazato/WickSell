import Mongodb from "./bdmongo"

const bdwicksell = new Mongodb(process.env.MONGODB_DATABASE!)

export default class perfil {
    private colecao: string

    constructor(colecao: string) {
        this.colecao = colecao
    }

    async insertOnePerfil(perfil: {}) {
        console.log("Inserir Perfil no mongodb")
        await bdwicksell.insertOne(this.colecao, perfil)
    }

    async findOnePerfil(perfil: { email: any; }) {
        console.log("Buscar Perfil no mongodb")
        const email = perfil.email
        return bdwicksell.findOne(this.colecao, { email: email })
    }

    async replaceOnePerfil() {
        console.log("Substituir Perfil no mongodb")
        //await bdwicksell.replaceOne(this.colecao, { sub: sub, email: email }, profile)
    }
}