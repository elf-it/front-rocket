"use client"
import Link from "next/link"
import Image from 'next/image'
import bigLogoWhite from "../public/logos/bigLogoWhite.svg"
import IconDown from "../public/icons/iconDown.svg"
import { useState, useEffect } from "react"
import { getCookie, setCookie } from 'cookies-next'
import { useRouter } from "next/navigation"

export default function AuthNav() {

    const currentLang = getCookie()

    const router = useRouter()

    const [language, setLanguage] = useState("ru")

    const lang = [
        "ru"
    ]

    const setLang = (lng) => {
        setCookie("lang", lng)
        setLanguage(lng)
        router.refresh()
    }

    useEffect(() => {
        //setLanguage(getCookie("lang"))
    }, [])

    return(
        <>
            <nav className="flex w-full flex-nowrap items-center justify-between bg-white py-[0.6rem] text-black h-20">
                <div className="flex w-full flex-wrap items-center justify-between px-4">
                <Link href="/" className="flex items-center">
                    <Image
                        priority
                        src={bigLogoWhite}
                        alt="Rocket"
                        height={50}
                    />
                </Link>
                <ul className="relative flex items-center !md:w-full">
                    <li className="relative cursor-pointer mr-4 px-4 py-2 flex items-start rounded-md hover:shadow-[0px_15px_17px_-8px_rgba(0,0,0,_0.22)] box-border border-[1px] border-solid border-gray" data-te-dropdown-ref>
                        <button
                            className="flex w-full h-full items-center justify-center text-black hover:text-gray-700 focus:text-gray-700"
                            id="navbarDropdownAuth"
                            role="button"
                            data-te-dropdown-toggle-ref
                            aria-expanded="false">
                            <span className="relative inline-block overflow-hidden decoration-inherit">
                            {language}
                            </span>
                            <Image
                                priority
                                src={IconDown}
                                alt="Rocket"
                                height={20}
                            />
                        </button>
                        <ul
                            className="absolute left-auto right-0 z-[1000] float-left m-0 mt-1 hidden min-w-[10rem] list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg [&[data-te-dropdown-show]]:block"
                            aria-labelledby="navbarDropdownAuth"
                            data-te-dropdown-menu-ref>
                            {lang.map((item, i) => (
                                <li key={i}>
                                <button
                                    className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-md font-normal text-gray-700 hover:bg-gray-100 active:text-zinc-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-gray-400"
                                    onClick={() => setLang(item)}
                                    data-te-dropdown-item-ref>
                                    <span className="mr-4">{item}</span>
                                </button>
                                </li>
                            ))}
                        </ul>
                    </li>
                </ul>
                </div>
            </nav>
        </>
    )
}