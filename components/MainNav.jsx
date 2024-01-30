"use client"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useDisconnect } from 'wagmi'
import { signOut } from "next-auth/react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import Image from 'next/image'
import bigLogoWhite from "../public/logos/bigLogoWhite.svg"
import bigLogoBlack from "../public/logos/bigLogo.svg"
import IconRef from "../public/icons/iconRef.svg"
import IconExit from "../public/icons/iconExit.svg"
import { ToastContainer, toast } from 'react-toastify'
import IconDown from "../public/icons/iconDown.svg"
import 'react-toastify/dist/ReactToastify.css'
import { useSearchParams } from "next/navigation"
import { useState } from "react"

export default function MainNav({user, page}) {
    const {status} = useSession()
    const { disconnect } = useDisconnect()
    const searchParams = useSearchParams()
    const referrer = searchParams.get('referrer') || ""

    const notify = () => toast.success("Реферальная ссылка скопирована!")

    const [language, setLanguage] = useState("ru")
    const isPageAdd = page == "/addwallet" || page == "/addedwallet" ? true : false

    const lang = [
        "ru"
      ]
    
    return(
        <>
            {status != "loading" &&
            <>
            <nav className={status == "authenticated" ? "text-black absolute z-50 flex w-full flex-nowrap items-center justify-between py-[0.6rem] h-20" : "text-white bg-none absolute z-50 flex w-full flex-nowrap items-center justify-between py-[0.6rem] h-20"}>
                <div className="flex w-full flex-wrap items-center justify-between px-4">
                    {isPageAdd ?
                    <Link href="/" className="flex items-center">
                        <Image
                            priority
                            src={bigLogoWhite}
                            alt="Rocket"
                            className="h-[30px] md:h-[50px] w-auto"
                        />
                    </Link>
                    :
                    <Link href="/" className="flex items-center">
                        <Image
                            priority
                            src={bigLogoBlack}
                            alt="Rocket"
                            className="h-[30px] md:h-[50px] w-auto"
                        />
                    </Link>
                    }
                    <ul className="relative flex items-center !md:w-full">
                        {status == "unauthenticated" &&
                            <>
                            {referrer != "" &&
                                <Link
                                    href="/signup"
                                    className={"px-4 py-2 text-white text-sm md:text-lg"}
                                >
                                    Регистрация
                                </Link>
                            }
                            </>
                        }
                        {isPageAdd ?
                        <>
                            <Link
                                href="/personal/mygame"
                                className={"px-4 py-2 mr-6 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]"}
                            >
                                В кабинет
                            </Link>
                            <button data-te-dropdown-item-ref type="button" onClick={() => {disconnect(); signOut()}} className="hidden-arrow flex items-center whitespace-nowrap transition duration-150 ease-in-out motion-reduce:transition-none">
                                <Image
                                priority
                                alt="Rocket"
                                src={IconExit}
                                height={20}
                                width={20}
                                />
                            </button>
                        </>
                        :
                        <Link
							href="/signin"
                            className={"px-4 py-2 tracking-wide text-white transition-colors duration-200 transform rounded-md  [background:linear-gradient(180deg,_rgba(60,_8,_126,_0),_rgba(60,_8,_126,_0.32)),_rgba(113,_47,_255,_0.12)] shadow-[0px_0px_12px_rgba(191,_151,_255,_0.24)_inset] box-border border-[1px] border-solid border-[#4d2f8c] text-sm md:text-lg"}
						>
							Вход
						</Link>
                        }
                    </ul>
                </div>
            </nav>
            <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick
            />
            </>
            }
        </>
    )
}