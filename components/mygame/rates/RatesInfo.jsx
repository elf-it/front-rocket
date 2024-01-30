"use client"
import Tarifs from "@/components/Tarifs"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { getPersonalData } from '@/lib/fetch'

export default function RatesInfo(){

    const {data, status, update} = useSession()
    const [personalData, setPersonalData] = useState(null)

    const getThPersonalData = async (uid) => {
        try {
            const response = await getPersonalData({
				key: process.env.AUTH_KEY,
				uid
			})

            if(response.error){
                setPersonalData(null)
            }else{
                console.log(response)
                setPersonalData(response)
			}
        } catch (error) {
            console.log("Error: ", error)
        }
    }

    useEffect(() => {
        if(personalData == null){
            getThPersonalData(data?.user?.uid)
        }
    }, [data, personalData])

    return(
        <div className="flex w-full flex-wrap">
            <Tarifs data={data} personalData={personalData} update={update} tr={true} />
        </div>
    )
}