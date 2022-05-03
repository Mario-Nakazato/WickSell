import mongodb from "./bdmongo"
import { Profile } from "next-auth";

const bdperfil = new mongodb(process.env.MONGODB_DATABASE!)

export default class perfil {
    private colecao: string

    constructor(colecao: string) {
        this.colecao = colecao
    }

    //Profile
    async insertOneProfile(profile: Profile & Record<string, unknown>) {
        await bdperfil.insertOne(this.colecao, profile)
    }

    async findOneProfile(profile: Profile & Record<string, unknown>) {
        const email = profile.email
        const sub = profile.sub
        return bdperfil.findOne(this.colecao, { sub: sub, email: email })
    }

    async findAllProfile(profile: Profile & Record<string, unknown>) {
        const email = profile.email
        const sub = profile.sub
        return bdperfil.findAll(this.colecao, { sub: sub, email: email })
    }

    async replaceOneProfile(profile: Profile & Record<string, unknown>) {
        const email = profile.email
        const sub = profile.sub
        await bdperfil.replaceOne(this.colecao, { sub: sub, email: email }, profile)
    }

    //Perfil
    async insertOnePerfil(perfil: {}) {
        console.log("Inserir Perfil no mongodb")
        await bdperfil.insertOne(this.colecao, perfil)
    }

    async findOnePerfil(perfil: { email: any; }) {
        console.log("Buscar Perfil no mongodb")
        const email = perfil.email
        return bdperfil.findOne(this.colecao, { email: email })
    }

    async replaceOnePerfil() {
        console.log("Substituir Perfil no mongodb")
        //await bdperfil.replaceOne(this.colecao, { sub: sub, email: email }, profile)
    }
}