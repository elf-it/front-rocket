"use client"
import { usePathname } from 'next/navigation'
import Link from "next/link"
import Image from "next/image"
import bigLogo from "../public/logos/bigLogo.svg"
import userLogo from "../public/mainNav/userLogo.svg"
import IconHome from "../public/icons/iconHome.svg"
import IconGame from "../public/mainNav/game.svg"
import IconDiscipline from "../public/icons/iconDiscipline.svg"
import IconNews from "../public/icons/iconNews.svg"
import IconDown from "../public/icons/iconDown.svg"
import IconRef from "../public/icons/iconRef.svg"
import IconSprints from "../public/icons/iconSprints.svg"
import IconStruct from "../public/icons/iconStruct.svg"
import IconWallets from "../public/icons/iconWallets.svg"
import IconAdmin from "../public/icons/iconAdmin.svg"
import IconProfile from "../public/icons/iconProfile.svg"
import IconExit from "../public/icons/iconExit.svg"
import { FaBars, FaTimes } from "react-icons/fa"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import Nav from './Nav'
import MainNav from './MainNav'
import { getToSideNav } from '@/lib/fetch'
import { CopyToClipboard } from "react-copy-to-clipboard"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getCookie, setCookie } from 'cookies-next'
import { useDisconnect } from 'wagmi'

export default function SideNav({children}) {

    const { disconnect } = useDisconnect()

    const [openLang, setOpenLang] = useState(false)

    const [open, setOpen] = useState(false)
    const currentLang = getCookie("lang")

    const [language, setLanguage] = useState("ru")
    const [langObject, setLangObject] = useState(null)

    const [date, setDate] = useState(null)

    const lang = [
      "ru"
    ]

    const setLang = (lng) => {
        setCookie("lang", lng)
        setLanguage(lng)
        if(lng == "ru"){
            setLangObject({ref: "Реферальная ссылка скопирована!"})
        }else{
            setLangObject({ref: "The referral link has been copied!"})
        }
    
    }

    const toggle = () => {
        setOpen(!open)
    }

    const {data, status} = useSession()

    const [user, setUser] = useState(null)

    const pathname = usePathname()
    const path = [
        "/",
        "/signin",
        "/signup",
        "/recovery",
        "/addwallet",
        "/addedwallet"
    ]
    const useNav = path.includes(pathname)
    const sign = pathname != "/signin" & pathname != "/signup" & pathname != "/recovery" ? true : false

    const getUser = async (uid) => {
        try {
            const response = await getToSideNav({
				key: process.env.AUTH_KEY,
				uid
			})

            if(response.error){
                setUser(null)
            }else{
				setUser(response)
                if(response.monts_timestamp != 0){
                    const dt = new Date(response.monts_timestamp * 1000)
                    const mm = dt.getMonth() < 10 ? "0" + (dt.getMonth() + 1).toString() : (dt.getMonth() + 1).toString()
                    const day = dt.getDate() < 10 ? "0" + dt.getDate().toString() : dt.getDate().toString()
                    setDate({yeaar: dt.getFullYear(), months: mm, day: day})
                }

			}
        } catch (error) {
            console.log("Error: ", error)
        }
    }

    useEffect(() => {
        setLanguage(getCookie("lang"))
    }, [user])
    
    useEffect(() => {
        if(user == null){
            getUser(data?.user?.uid)
            
        }
        const init = async () => {
            const { Sidenav, Dropdown, Ripple, initTE } = await import("tw-elements")
            initTE({ Sidenav, Dropdown, Ripple })
        }
        init()
    }, [data])

    const buttons = [
        {link: "/personal/mygame", text: "Моя игра", img: IconGame, visible: true},
        {link: "/personal/mygame/rates", text: "Тарифы", img: IconGame, visible: true},
        {link: "/personal/mygame/statuses", text: "Статусы", img: IconGame, visible: true},
        {link: "/personal", text: "Личный кабинет", img: IconHome, visible: data?.user?.referal_link != "x"},
        //{link: "/personal/profile", text: "Профиль", img: IconProfile},
        {link: "/personal/wallets", text: "Финансы", img: IconWallets, visible: data?.user?.referal_link != "x"},
        {link: "/personal/sprints", text: "Спринты", img: IconSprints, visible: true},
        //{link: "/personal/discipline", text: "Отчет по дисциплине", img: IconDiscipline},
        {link: "/personal/structure", text: "Партнерская программа", img: IconStruct, visible: data?.user?.referal_link != "x"},
        //{link: "/personal/news", text: "Новости", img: IconNews},
        //{link: "/personal/admin", text: "Админ панель", img: IconAdmin}
    ]

    const title = buttons.find((item) => item.link == pathname)

    return(
        <>
        {!useNav ?
            <>
                <nav
                    className={`fixed left-0 top-0 bottom-0 pb-24 z-[6000] md:z-0 md:w-60 transition-all duration-300 bg-black shadow-[0_4px_12px_0_rgba(0,0,0,0.07),_0_2px_4px_rgba(0,0,0,0.05)] ${open ? "w-full" : "w-0"}`}>
                    <div className={`w-full h-full flex-col overflow-auto md:flex ${open ? "flex" : "hidden"}`}>
                        <nav className='bg-none w-full flex md:hidden justify-between items-center px-4 h-12 mb-4 pt-6'>
                            <div>
                                <div className='flex items-center flex-1 flex-col'>
                                    <Image
                                        priority
                                        src={bigLogo}
                                        alt="Rocket"
                                        className="w-1/4"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-center">
                                <button data-te-dropdown-item-ref type="button" onClick={() => {disconnect(); signOut()}} className="hidden-arrow flex items-center whitespace-nowrap transition duration-150 ease-in-out motion-reduce:transition-none mr-4 [&>svg>path]:fill-white cursor-pointer">
                                    <svg width="21" height="22" viewBox="0 0 21 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.7907 11L13.8096 13.981L13.8094 13.9813C13.6863 14.1043 13.6172 14.2713 13.6172 14.4453C13.6172 14.4558 13.6174 14.4663 13.6179 14.4768C13.6258 14.6398 13.694 14.794 13.8094 14.9094C13.9325 15.0324 14.0994 15.1016 14.2734 15.1016C14.4475 15.1016 14.6144 15.0324 14.7375 14.9094L14.7377 14.9091L18.1828 11.464C18.3059 11.341 18.375 11.174 18.375 11C18.375 10.826 18.3059 10.659 18.1828 10.536L14.7376 7.09073C14.6144 6.96758 14.4475 6.89844 14.2734 6.89844C14.0994 6.89844 13.9325 6.96758 13.8094 7.09065C13.6863 7.21372 13.6172 7.38064 13.6172 7.55469C13.6172 7.72874 13.6863 7.89566 13.8094 8.01873L16.7907 11Z" fill="#060B39"/>
                                    <path d="M8.53125 11.6562H17.7188C18.0812 11.6562 18.375 11.3624 18.375 11C18.375 10.6376 18.0812 10.3438 17.7188 10.3438H8.53125C8.16881 10.3438 7.875 10.6376 7.875 11C7.875 11.3624 8.16881 11.6562 8.53125 11.6562Z" fill="#060B39"/>
                                    <path d="M3.9375 4.4375H8.53125C8.89369 4.4375 9.1875 4.14369 9.1875 3.78125C9.1875 3.41881 8.89369 3.125 8.53125 3.125H3.9375C3.39384 3.125 3.00942 3.50942 3.00942 3.50942C2.625 3.89384 2.625 4.4375 2.625 4.4375V17.5625C2.625 18.1062 3.00942 18.4906 3.00942 18.4906C3.39384 18.875 3.9375 18.875 3.9375 18.875H8.53125C8.89369 18.875 9.1875 18.5812 9.1875 18.2188C9.1875 17.8563 8.89369 17.5625 8.53125 17.5625H3.9375V4.4375Z" fill="#060B39"/>
                                    </svg>
                                </button>
                            </div>
                            <div className='flex md:hidden' onClick={toggle}><FaTimes className="cursor-pointer text-white" height={20} width={40} /></div>
                        </nav>
                        <div className="pt-6 mb-6 hidden md:flex">
                            <div className="flex w-full items-center flex-col">
                                <Image
                                    priority
                                    src={bigLogo}
                                    alt="Rocket"
                                    className="w-[60%]"
                                />
                            </div>
                        </div>
                        <div className="mb-6">
                            <div className="flex w-full items-center flex-col">
                                <Image
                                    src={userLogo}
                                    alt="Avatar"
                                    className="mb-4 h-auto rounded-full align-middle w-[40%] object-cover"
                                />

                                <h4 className="mb-2 w-full px-2 text-2xl text-white text-center font-medium leading-[1.2] text-ellipsis overflow-hidden hover:text-clip">{data?.user?.login}</h4>
                                <p className="mb-2 text-white">Ранг: {user?.qualification || 0}</p>
                                <p className="mb-2 text-white/50 text-center text-sm">{date && date != 0 ? `${"Активен до " + date.day + "." + date.months + "." + date.yeaar}` : "Не активен"}</p>
                                {date && date != 0 &&
                                <p className="mb-2 text-white/50 text-center text-sm">Тариф: {user?.expert > 0 ? "EXPERT" : "STANDART"}</p>
                                }
                            </div>
                        </div>
                        <div>
                            <ul
                                className="m-0 list-none px-[0.2rem]">
                                {buttons.map((item, i) => (
                                    <li key={i} className="relative">
                                        {item.visible &&
                                        <>
                                        {pathname == item.link ?
                                        <>
                                            <Link
                                                className="flex mx-6 text-white text-left group md:hidden h-12 cursor-pointer items-center truncate px-4 py-4 rounded-md opacity-1 [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]"
                                                onClick={() => {
                                                    setOpen(false)
                                                    getUser(data?.user?.uid)
                                                }}
                                                href={item.link}
                                                >
                                                    <span
                                                    className="mr-4 [&>svg]:h-20 [&>svg]:w-20 [&>svg]:fill-gray-300">
                                                        <Image
                                                            priority
                                                            src={item.img}
                                                            alt="Rocket"
                                                            height={20}
                                                        />
                                                    </span>
                                                    <span className='text-xs whitespace-normal'>{item.text}</span>
                                            </Link>
                                            <Link
                                                className="md:flex mx-6 text-white text-left group hidden h-12 cursor-pointer items-center truncate px-4 py-4 rounded-md opacity-1 [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]"
                                                href={item.link}
                                                >
                                                    <span
                                                    className="mr-4 [&>svg]:h-20 [&>svg]:w-20 [&>svg]:fill-gray-300">
                                                        <Image
                                                            priority
                                                            src={item.img}
                                                            alt="Rocket"
                                                            height={20}
                                                        />
                                                    </span>
                                                    <span className='text-xs whitespace-normal'>{item.text}</span>
                                            </Link>
                                        </>
                                        :
                                        <>
                                            <Link
                                            className="flex mx-6 text-white text-left opacity-[0.4] group md:hidden h-12 cursor-pointer items-center truncate px-4 py-4 hover:rounded-md hover:opacity-1 hover:[background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]"
                                            onClick={() => setOpen(false)}
                                            href={item.link}
                                            >
                                                <span
                                                className="mr-4 [&>svg]:h-20 [&>svg]:w-20 [&>svg]:fill-gray-300">
                                                    <Image
                                                        priority
                                                        src={item.img}
                                                        alt="Rocket"
                                                        height={20}
                                                    />
                                                </span>
                                                <span className='text-xs whitespace-normal'>{item.text}</span>
                                            </Link>
                                            <Link
                                            className="md:flex mx-6 text-white text-left opacity-[0.4] group hidden h-12 cursor-pointer items-center truncate px-4 py-4 hover:rounded-md hover:opacity-1 hover:[background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]"
                                            href={item.link}
                                            >
                                                <span
                                                className="mr-4 [&>svg]:h-20 [&>svg]:w-20 [&>svg]:fill-gray-300">
                                                    <Image
                                                        priority
                                                        src={item.img}
                                                        alt="Rocket"
                                                        height={20}
                                                    />
                                                </span>
                                                <span className='text-xs whitespace-normal'>{item.text}</span>
                                            </Link>
                                        </>
                                        }
                                        </>
                                        }
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <div className='absolute flex justify-end md:hidden left-0 right-0 bottom-0 pb-4'>
                        {data?.user?.referal_link != "x" &&
                        <div>
                            <CopyToClipboard text={process.env.NEXTAUTH_URL + "?referrer=" + data?.user?.referal_link} onCopy={() => toast(langObject?.ref || "Реферальная ссылка скопирована!")}>
                                <div className="flex mx-6 text-white text-left group md:hidden h-12 cursor-pointer items-center truncate px-4 py-4 rounded-md opacity-1 [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
                                <Image
                                    priority
                                    src={IconRef}
                                    alt="Rocket"
                                    height={20}
                                />
                                    <span className="relative ml-2 overflow-hidden decoration-inherit flex">Пригласить в игру</span>
                                </div>
                            </CopyToClipboard>
                        </div>
                        }
                        <div className="relative cursor-pointer mr-4 px-4 py-2 flex items-start rounded-md hover:shadow-[0px_15px_17px_-8px_rgba(0,0,0,_0.22)] box-border border-[1px] border-solid border-gray bg-white">
                            <button
                                className="flex items-center justify-center text-black hover:text-gray-700 focus:text-gray-700"
                                onClick={() => setOpenLang(!openLang)}
                                >
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
                                className={`absolute left-auto right-0 bottom-8 z-[1000] float-left m-0 mb-10 min-w-[10rem] list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg ${openLang ? "block": "hidden"}`}>
                                {lang.map((item, i) => (
                                    <li key={i}>
                                    <button
                                        className="block w-full whitespace-nowrap bg-transparent px-4 py-2 text-md font-normal text-gray-700 hover:bg-gray-100 active:text-zinc-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-gray-400"
                                        onClick={() => {
                                            setLang(item)
                                            setOpenLang(false)
                                        }}
                                        data-te-dropdown-item-ref>
                                        <span className="mr-4">{item}</span>
                                    </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                    <ToastContainer
                        position="top-left"
                        autoClose={2000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                        className="[--toastify-color-progress-light:#8532EE]"
                    />
                </nav>
                <Nav title={title?.text} user={data?.user} activity={user} toggle={toggle} />
                <div className="flex px-6 md:pl-72 pb-10 md:pr-12 w-full pt-48 md:pt-28 items-start flex-wrap [background:linear-gradient(180deg,_#f5f5f5,_#f1f1f1)]">{children}</div>
            </>
        :
            <>
                {sign &&
                    <MainNav user={data?.user} page={pathname} />
                }
                {children}
            </>
        }
        </>
    )
}