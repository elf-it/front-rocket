import AddedAddress from "@/components/AddedAddress"
import { getServerSession } from "next-auth"
import { authOptions } from "../api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"

export default async function AddedWallet() {

    const session = await getServerSession(authOptions)

    console.log(session)
    //if(session?.user?.address == null) redirect("/addwallet")

    return (<AddedAddress />)
}
