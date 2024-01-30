import AddAddress from "@/components/AddAddress"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function AddWallet() {

    const session = await getServerSession(authOptions)

    if(session?.user?.address) redirect("/personal")

    return (<AddAddress />)
}