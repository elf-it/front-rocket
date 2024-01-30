"use client"
import { setCookie } from 'cookies-next'
import { useSession } from "next-auth/react"
import Loading from "./Loading"

export default function UserInfo() {

    setCookie('referrer', '')
    
    const {data, status} = useSession()

    console.log(data)

    return(
        <>
            {status != "loading" ? (
                <>
                    <div className="items-center w-full flex justify-center">
                        
                        <div className="shadow-lg p-8 bg-zinc-300/10 flex flex-col">
                            <div>
                                Referrer: <span className="font-bold">{data?.user?.referrer_id}</span>
                            </div>
                            <div>
                                Address: <span className="font-bold">{data?.user?.address}</span>
                            </div>
                            <div>
                                Email: <span className="font-bold">{data?.user?.email}</span>
                            </div>
                        </div>
                    </div>
                </>)
                :
                (<>
                    <Loading />
                </>)
            }
        </>
    );
}