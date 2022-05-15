import { Profile } from 'next-auth';
import bdMongodb from "./bdmongo"

const bdwicksell = new bdMongodb(process.env.MONGODB_DATABASE!)

export default class cProfile {
    private colecao: string

    constructor(colecao: string) {
        this.colecao = colecao
    }

    async insertOne(profile: Profile & Record<string, unknown>) {
        await bdwicksell.insertOne(this.colecao, profile)
    }

    async findOne(profile: Profile & Record<string, unknown>) {
        const sub = profile.sub
        return bdwicksell.findOne(this.colecao, { sub: sub })
    }

    async findAll(profile: Profile & Record<string, unknown>) {
        const email = profile.email
        return bdwicksell.findAll(this.colecao, { email: email })
    }

    async replaceOne(profile: Profile & Record<string, unknown>) {
        const email = profile.email
        const sub = profile.sub
        await bdwicksell.replaceOne(this.colecao, { sub: sub, email: email }, profile)
    }
}