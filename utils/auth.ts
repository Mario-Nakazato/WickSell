import { Profile } from 'next-auth';
import cProfile from "./cprofile"

const cprofile = new cProfile(process.env.MONGODB_COLLECTION_PROFILE!)

export default class Auth {

    private profile: (Profile & Record<string, unknown>) | null | undefined

    async signInProfile(profile: Profile & Record<string, unknown>) {
        const docprofile = await cprofile.findOne(profile)
        if (profile.sub === docprofile?.sub) {
            await cprofile.replaceOne(profile)
        } else {
            await cprofile.insertOne(profile)
        }
    }

    async setProfile(sub: string) {
        return this.profile = await cprofile.findOne({ sub: sub })
    }
}