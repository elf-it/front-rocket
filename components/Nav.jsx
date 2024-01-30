"use client"
import { signOut } from "next-auth/react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import { ToastContainer, toast } from 'react-toastify'
import Image from "next/image"
import IconRef from "../public/icons/iconRef.svg"
import IconExit from "../public/icons/iconExit.svg"
import IconWallets from "../public/icons/iconWallets.svg"
import IconDown from "../public/icons/iconDown.svg"
import IconCheck from "../public/check.svg"
import { FaBars } from "react-icons/fa"
import 'react-toastify/dist/ReactToastify.css'
import usdtABI from '../abi/usdtABI.json'
import { useContext, useEffect, useState } from "react"
import { useWeb3Modal } from '@web3modal/react'
import { useContractRead, useAccount, useBalance, useNetwork, useSwitchNetwork, useDisconnect } from 'wagmi'
import { ethers } from "ethers"
import { getCookie, setCookie } from 'cookies-next'
import Link from "next/link"
import { getAddress } from '@/lib/fetch'
import { useRouter } from "next/navigation"
import { ConnectKitButton } from 'connectkit'

import bigLogo from "../public/logos/bigLogo.svg"
import Lives from "../public/live.svg"
import Star from "../public/star.svg"
import smallUserLogo from "../public/mainNav/smallUserLogo.svg"
import contractData from "../contractData.json"

export default function Nav({title, user, activity, toggle}) {

    const [openLang, setOpenLang] = useState(false)

    const { disconnect } = useDisconnect()

    const currentLang = getCookie("lang")

    const router = useRouter()

    const { address, connector: activeConnector, isConnected, isDisconnected } = useAccount()
    const { chain } = useNetwork()
    const { chains, error: errorSwitch, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork()
    const { open } = useWeb3Modal()

    const [usdtBalance, setUsdtBalance] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [navAddress, setNavAddress] = useState(null)

    const BNBBalance = useBalance({address})

    const [language, setLanguage] = useState("ru")
    const [langObject, setLangObject] = useState(null)

    const lang = [
      "ru"
    ]

    const getnAddress = async (uid) => {
        try {
            const response = await getAddress({
        key: process.env.AUTH_KEY,
        uid
      })

            if(response.error){
              setNavAddress(null)
            }else{
              setNavAddress(response.address)
      }
        } catch (error) {
            console.log("Error: ", error)
        }
    }

    const setLang = (lng) => {
      setCookie("lang", lng)
      setLanguage(lng)
      if(lng == "ru"){
        setLangObject({ref: "Реферальная ссылка скопирована!"})
      }else{
        setLangObject({ref: "The referral link has been copied!"})
      }
      
    }

    const getUsdtBalance = useContractRead({
      address: contractData.usdt,
      abi: usdtABI,
      functionName: 'balanceOf',
      args: [address],
      watch: true,
      onSuccess(data) {
          setUsdtBalance(parseFloat(ethers.formatEther(data)))
      },
  })

  useEffect(() => {
    const init = async () => {
      const { Tooltip, Ripple, initTE } = await import("tw-elements")
      initTE({ Tooltip, Ripple, initTE })
    }
    init()
  }, [])

  useEffect(() => {
    getnAddress(user?.uid)
    //setLanguage(getCookie("lang"))
  }, [user])

    return(
    <>
      <div className="fixed md:absolute top-0 left-0 md:left-60 z-[5000] right-0 bg-black md:bg-white/10 flex justify-between items-center px-4 mb-4">
        <nav
        className="bg-none w-full flex justify-between items-center h-12 border-b border-b-black/10 py-10">
            <div className="text-white md:text-black font-bold hidden md:block">{title}</div>
            <div className='flex items-start flex-1 flex-col md:hidden'>
                <Image
                    priority
                    src={bigLogo}
                    alt="Rocket"
                    className="w-1/4"
                />
            </div>
          <div className="hidden md:flex">
            <div className="md:px-4 flex items-center justify-center text-md">
                <span>{activity?.lives}</span>
                <Image
                    priority
                    src={Lives}
                    alt="Lives"
                    className="px-1 inline-block"
                    height={20}
                />
                <span
                data-te-toggle="tooltip"
                data-te-placement="bottom"
                data-te-ripple-init
                data-te-ripple-color="light"
                title="Жизни можно накапливать. Они спасают тебя, если ты забудешь или не успеешь сдать отчет вовремя."
                >Мои жизни</span>
            </div>
            <div className="pl-2 md:px-4 flex items-center justify-center text-md">
                <span>{activity?.percent}%</span>
                <Image
                    priority
                    src={Star}
                    alt="Lives"
                    className="px-1 inline-block"
                    height={30}
                />
                <Link
                href='/personal/mygame/statuses'
                data-te-toggle="tooltip"
                data-te-placement="top"
                data-te-html="true"
                data-te-ripple-init
                data-te-ripple-color="light"
                title="При повышении статуса, ты больше зарабатываешь за приглашенных тобой игроков. Держи дисциплину что бы перейти на новый уровень. Узнать подробнее."
                >{activity?.level}</Link>
            </div>
            {user?.referal_link != "x" &&
            <div className="relative cursor-pointer mr-4 px-4 py-2 flex items-center rounded-md hover:shadow-[0px_15px_17px_-8px_rgba(0,0,0,_0.22)] box-border border-[1px] border-solid border-gray">
              <CopyToClipboard text={process.env.NEXTAUTH_URL + "?referrer=" + user?.referal_link} onCopy={() => toast(langObject?.ref || "Реферальная ссылка скопирована!")}>
                <div className="flex w-full">
                  <Image
                      priority
                      src={IconRef}
                      alt="Rocket"
                      height={20}
                  />
                  <span className="relative ml-2 overflow-hidden decoration-inherit hidden md:flex">Пригласить в игру</span>
                </div>
              </CopyToClipboard>
            </div>
            }
            <div className={`relative cursor-pointer mr-4 px-4 py-2 flex items-center rounded-md hover:shadow-[0px_15px_17px_-8px_rgba(0,0,0,_0.22)] box-border border-[1px] border-solid ${!isConnected ? "border-red-500" : "border-green-500"}`}>
            {isConnected ?
                <button
                onClick={() => setShowModal(true)}
                >
                    <span className="[&>svg]:h-20 [&>svg]:w-20 [&>svg]:fill-black">
                        <Image
                            priority
                            src={IconWallets}
                            alt="Rocket"
                            className="invert"
                            height={20}
                        />
                    </span>
                </button>
            :
                <ConnectKitButton.Custom>
                {({ show, hide, address, ensName, chain }) => {
                    return (
                    <button onClick={() => show()} >
                        <span className="[&>svg]:h-20 [&>svg]:w-20 [&>svg]:fill-black">
                            <Image
                                priority
                                src={IconWallets}
                                alt="Rocket"
                                className="invert"
                                height={20}
                            />
                        </span>
                    </button>
                    )
                }}
                </ConnectKitButton.Custom>
            }
            </div>
            <div className="relative cursor-pointer mr-4 px-4 py-2 flex items-start rounded-md hover:shadow-[0px_15px_17px_-8px_rgba(0,0,0,_0.22)] box-border border-[1px] border-solid border-gray">
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
                className={`absolute left-auto right-0 z-[1000] float-left m-0 mt-10 min-w-[10rem] list-none overflow-hidden rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg ${openLang ? "block": "hidden"}`}>
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
            <div>
              <Link
                className="mr-4 hidden-arrow flex items-center whitespace-nowrap"
                href="/personal">
                <Image
                    priority
                    alt="Rocket"
                    src={smallUserLogo}
                    height={40}
                    width={40}
                />
              </Link>
            </div>
            <div className="flex items-center justify-center">
              <button data-te-dropdown-item-ref type="button" onClick={() => {disconnect(); signOut()}} className="hidden-arrow flex items-center whitespace-nowrap transition duration-150 ease-in-out motion-reduce:transition-none">
                <Image
                  priority
                  alt="Rocket"
                  src={IconExit}
                  height={20}
                  width={20}
                />
              </button>
            </div>
          </div>
          <button className="flex md:hidden" onClick={toggle}><FaBars className="cursor-pointer text-white" height={20} width={40} /></button>
      </nav>
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
    </div>
    <div className="absolute md:hidden top-20 left-0 md:left-60 right-0 bg-white flex justify-between items-center px-4 mb-4">
        <nav className="bg-none w-full flex justify-between items-center h-12 border-b border-b-black/10 py-10">
            <div className="text-black font-bold">{title}</div>
            <div className="flex">
                <div className="flex pr-1 items-center justify-center text-xs">
                    <span>{activity?.lives}</span>
                    <Image
                        priority
                        src={Lives}
                        alt="Lives"
                        className="px-1 inline-block"
                        height={20}
                    />
                    <span>Мои жизни</span>
                </div>
                <div className="pl-1 flex items-center justify-center text-xs border-l border-l-black/30">
                    <span>{activity?.percent}%</span>
                    <Image
                        priority
                        src={Star}
                        alt="Lives"
                        className="px-1 inline-block"
                        height={30}
                    />
                    <span>Статус: {activity?.level}</span>
                </div>
            </div>
        </nav>
    </div>
    {showModal &&
    <>
        <div className="justify-center items-center flex-col md:flex-row flex overflow-x-hidden z-[99999] overflow-y-auto fixed inset-0 outline-none focus:outline-none">
            <div className="absolute top-0 left-0 right-0 bottom-0" onClick={() => setShowModal(false)}></div>
            <div className="relative w-4/6 mx-auto">
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                    <div className="flex items-center justify-center p-5">
                        <h3 className="text-2xl text-black">
                        Кошелек
                        </h3>
                    </div>
                    <div className='w-full h-full flex flex-row justify-start items-start'>
                        <div className='w-full md:w-1/2 flex flex-col justify-between items-start'>
                            <div className='w-full mb-6 px-6 flex flex-row flex-wrap justify-center items-center'>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-semibold text-black w-full"
                                >
                                    Привязанный кошелек
                                </label>
                                <div className='w-full flex flex-nowrap mt-2'>
                                    <input
                                        type="text"
                                        disabled
                                        value={navAddress}
                                        className="block w-full px-4 mr-4 py-2 text-[#17103c] text-xs h-[50px] bg-white border border-[#e8e8e8] rounded-md focus:outline-none"
                                    />
                                    {address &&
                                    <>
                                        {address == navAddress ?
                                            <Image
                                                priority
                                                src={IconCheck}
                                                alt="Rocket"
                                                height={20}
                                            />
                                        :
                                            <Image
                                                priority
                                                src={IconCheck}
                                                className=' opacity-0'
                                                alt="Rocket"
                                                height={20}
                                            />
                                        }
                                    </>
                                    }
                                </div>
                                <span className="w-full text-black opacity-[0.3] text-xs pt-2 pr-6">
                                Счет в кошельке, связанный с данным аккаунтом
                                </span>
                            </div>
                            <div className='w-full mb-6 px-6 flex flex-row flex-wrap justify-center items-center'>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-semibold text-black w-full"
                                >
                                    Подключенный кошелек
                                </label>
                                <div className='w-full flex flex-nowrap mt-2'>
                                    <input
                                        type="text"
                                        disabled
                                        value={address}
                                        className="block w-full px-4 mr-4 py-2 text-[#17103c] text-xs h-[50px] bg-white border border-[#e8e8e8] rounded-md focus:outline-none"
                                    />
                                    {address &&
                                    <>
                                        {address == navAddress?.address ?
                                            <Image
                                                priority
                                                src={IconCheck}
                                                alt="Rocket"
                                                height={20}
                                            />
                                        :
                                            <Image
                                                priority
                                                src={IconCheck}
                                                className=' opacity-0'
                                                alt="Rocket"
                                                height={20}
                                            />
                                        }
                                    </>
                                    }
                                </div>
                                <span className="w-full text-black opacity-[0.3] text-xs pt-2 pr-6">
                                Счет в кошельке, подключенный к сайту. Для проведения финансовых операций «Подключенный кошелек» и «Привязанный кошелек» должны совпадать
                                </span>
                            </div>
                            <div className='w-full mb-6 px-6 flex flex-row flex-wrap justify-center items-center'>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-semibold text-black w-full"
                                >
                                    Сеть
                                </label>
                                <div className='w-full flex flex-nowrap mt-2'>
                                    <input
                                        type="text"
                                        disabled
                                        value={address && chain?.name}
                                        className="block w-full px-4 mr-4 py-2 text-[#17103c] text-xs h-[50px] bg-white border border-[#e8e8e8] rounded-md focus:outline-none"
                                    />
                                    {address &&
                                    <>
                                        {chains.map((x) => (
                                            <>
                                            {!switchNetwork || x.id === chain?.id ?
                                                <Image
                                                    priority
                                                    src={IconCheck}
                                                    alt="Rocket"
                                                    height={20}
                                                />
                                                :
                                                <Image
                                                    priority
                                                    src={IconCheck}
                                                    className=' opacity-0'
                                                    alt="Rocket"
                                                    height={20}
                                                />
                                            }
                                            </>
                                        ))}
                                    </>
                                    }
                                </div>
                                <span className="w-full text-black opacity-[0.3] text-xs pt-2 pr-6">
                                Отображается сеть, выбранная в подключенном к сайту кошельке. Для проведения транзакций необходимо выбрать сеть Binance Smart Chain.
                                </span>
                            </div>
                        </div>
                        <div className='w-full md:w-1/2 flex flex-col justify-between items-start'>
                            <div className='w-full mb-6 px-6 flex flex-row flex-wrap justify-center items-center'>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-semibold text-black w-full"
                                >
                                    Баланс BNB
                                </label>
                                <div className='w-full flex flex-nowrap mt-2'>
                                    <input
                                        type="text"
                                        disabled
                                        value={BNBBalance?.data?.formatted}
                                        className="block w-full px-4 mr-4 py-2 text-[#17103c] text-xs h-[50px] bg-white border border-[#e8e8e8] rounded-md focus:outline-none"
                                    />
                                    {BNBBalance?.data?.formatted >= 0.00114 ?
                                        <Image
                                            priority
                                            src={IconCheck}
                                            alt="Rocket"
                                            height={20}
                                        />
                                    :
                                        <Image
                                            priority
                                            src={IconCheck}
                                            className=' opacity-0'
                                            alt="Rocket"
                                            height={20}
                                        />
                                    }
                                </div>
                                <span className="w-full text-black opacity-[0.3] text-xs pt-2 pr-6">
                                Баланс BNB в подключенном к сайту кошельке. BNB используются для оплаты комиссии за транзакцию в blockchain
                                </span>
                            </div>
                            <div className='w-full mb-6 px-6 flex flex-row flex-wrap justify-center items-center'>
                                <label
                                    htmlFor="password"
                                    className="block text-sm font-semibold text-black w-full"
                                >
                                    Баланс USDT
                                </label>
                                <div className='w-full flex flex-nowrap mt-2'>
                                    <input
                                        type="text"
                                        disabled
                                        value={usdtBalance}
                                        className="block w-full px-4 mr-4 py-2 text-[#17103c] text-xs h-[50px] bg-white border border-[#e8e8e8] rounded-md focus:outline-none"
                                    />
                                    {usdtBalance > 0 ?
                                        <Image
                                            priority
                                            src={IconCheck}
                                            alt="Rocket"
                                            height={20}
                                        />
                                    :
                                        <Image
                                            priority
                                            src={IconCheck}
                                            className=' opacity-0'
                                            alt="Rocket"
                                            height={20}
                                        />
                                    }
                                </div>
                                <span className="w-full text-black opacity-[0.3] text-xs pt-2 pr-6">
                                Баланс USDT (BEP20) на подключенном кошельке
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className='w-full flex mb-6 flex-row justify-center items-center'>
                        <button
                        onClick={() => setShowModal(false)}
                        className="px-8 py-2 mr-4 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
                            Закрыть
                        </button>
                        {!navAddress &&
                          <Link
                              href="/addwallet"
                              className="px-6 py-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]"
                          >
                              Привязать кошелек
                          </Link>
                          }
                    </div>
                </div>
            </div>
        </div>
        <div className="fixed inset-0 z-[99998] left-0 top-0 bottom-0 right-0 backdrop-blur-lg bg-gray-800/40"></div>
    </>
    }
    </>
    )
}