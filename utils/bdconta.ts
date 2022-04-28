import bdmongo from "./bdmongo"
import { Profile } from "next-auth";

const bdcontas = new bdmongo(process.env.MONGODB_DATABASE!)

export default class conta {
    private colecao: string

    constructor(colecao: string) {
        this.colecao = colecao
    }

    async replaceOneProfile(profile: Profile & Record<string, unknown>) {
        const email = profile.email
        await bdcontas.replaceOne(this.colecao, { email }, profile)
    }

    async findOneProfile(profile: Profile & Record<string, unknown>) {
        const email = profile.email
        return bdcontas.findOne(this.colecao, { email })
    }

    async insertOneProfile(profile: Profile & Record<string, unknown>) {
        await bdcontas.insertOne(this.colecao, profile)
    }
}