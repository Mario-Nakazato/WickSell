import { NextApiRequest, NextApiResponse } from 'next'
import NextAuth from 'next-auth'
import Auth0Provider from 'next-auth/providers/auth0'
import Auth from "../../../utils/auth"

const auth = new Auth()

export default (req: NextApiRequest, res: NextApiResponse) => NextAuth(req, res, {

    providers: [
        Auth0Provider({
            clientId: process.env.AUTH0_CLIENT_ID!,
            clientSecret: process.env.AUTH0_CLIENT_SECRET!,
            issuer: process.env.AUTH0_ISSUER
        })
    ],

    secret: process.env.NEXTAUTH_SECRET,

    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            user.email = profile.sub // trocado para o sub<autenticador [google-oauth2, auth0]>

            await auth.signInProfile(profile)

            if (!profile.email_verified) {
                return false
            }
            return true
        },
        async redirect({ url, baseUrl }) {
            return baseUrl
        },
        async session({ session, user, token }) {
            return session
        },
        async jwt({ token, user, account, profile, isNewUser }) {
            return token
        }
    },

    pages: {
        //signIn: '/auth/signin',
        //signOut: '/auth/signout',
        error: '/', // Error code passed in query string as ?error=
        //verifyRequest: '/auth/verify-request', // (used for check email message)
        //newUser: '/auth/new-user' // New users will be directed here on first sign in (leave the property out if not of interest)
    },
})
}