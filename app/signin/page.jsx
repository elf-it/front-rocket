import SigninForm from "@/components/SigninForm"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../api/auth/[...nextauth]/route"

export default async function Signin() {
    const session = await getServerSession(authOptions)

    if(session) redirect("/personal")

    return (<SigninForm />)
}
