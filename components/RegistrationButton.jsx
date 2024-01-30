import { useSession } from "next-auth/react"
import Link from "next/link"

export default function RegistrationButton({referrer}) {
    const {status} = useSession()
    
    return(
        <>
            {status != "loading" &&
                <>
                {status != "authenticated" &&
                    (
                        <>
                        {referrer != "" &&
                            <Link href="/signup" className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">Зарегистрироваться</Link>
                        }
                        </>
                    )
                }
                </>
            }
        </>
    )
}