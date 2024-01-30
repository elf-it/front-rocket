import { login, loginWithAddress } from "@/lib/fetch"
import NextAuth from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {},

            async authorize(credentials){
                const {email, password, address} = credentials
                if(address != "0"){
                    const user = await loginWithAddress({
                        key: process.env.AUTH_KEY,
                        address
                    })

                    if(user.error){
                        return null
                    }
                    return user
                }else{
                    const user = await login({
                        key: process.env.AUTH_KEY,
                        email,
                        password
                    })

                    if(user.error){
                        return null
                    }
                    return user
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/signin",
    },
    callbacks: {
        session: async ({ session, token }) => {
            session.id = token.id
            session.jwt = token.jwt
            session.user = token.user
            return Promise.resolve(session)
        },
        jwt: async ({ token, user, trigger, session }) => {
            if (user) {
                token.id = user.id
                token.jwt = user.pass_hash
                token.user = user

                token.user = user
            }
            if (trigger === "update" && session?.address) {
                token.user.address = session?.address
            }
            return Promise.resolve(token)
        },
    },
}
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST}