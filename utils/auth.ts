import { Profile } from 'next-auth'
import bdMongodb from "./bdmongo"

const bdwicksell = new bdMongodb(process.env.MONGODB_DATABASE!)
const colecao = process.env.MONGODB_COLLECTION_PROFILE!
export default class Auth {

    private profile: (Profile & Record<string, unknown>) | null | undefined

    async signInProfile(profile: Profile & Record<string, unknown>) {
        const docprofile = await this.findOne(profile)
        if (profile.sub === docprofile?.sub) {
            await this.replaceOne(profile)
        } else {
            await this.insertOne(profile)
        }
    }

    async setProfile(sub: string) {
        sub == undefined ? sub = "" : sub
        return this.profile = await this.findOne({ sub: sub })
    }

    async insertOne(profile: Profile & Record<string, unknown>) {
        await bdwicksell.insertOne(colecao, profile)
    }

    async findOne(profile: Profile & Record<string, unknown>) {
        const sub = profile.sub
        return await bdwicksell.findOne(colecao, { sub: sub })
    }

    async findAll(profile: Profile & Record<string, unknown>) {
        const email = profile.email
        return await bdwicksell.findAll(colecao, { email: email })
    }

    async replaceOne(profile: Profile & Record<string, unknown>) {
        const email = profile.email
        const sub = profile.sub
        await bdwicksell.replaceOne(colecao, { sub: sub, email: email }, profile)
    }
}