"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useWeb3Modal } from '@web3modal/react'
import { useContractRead, useContractWrite, useAccount, useConnect, useBalance, useWaitForTransaction, useFeeData, useNetwork, useSwitchNetwork } from 'wagmi'
import { buy } from '@/lib/fetch'
import usdtABI from '../abi/usdtABI.json'
import sellerABI from '../abi/sellerABI.json'
import { ethers } from "ethers"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Link from 'next/link'
import Image from 'next/image'
import IconCheck from "../public/check.svg"
import IconNo from "../public/no.svg"
import { ConnectKitButton } from 'connectkit'
import { FaTimes } from "react-icons/fa"
import contractData from "../contractData.json"

export default function Tarifs({data, personalData, update, tr}){

    const { connect, connectors, error: errorConnect, isLoading: isLoadingC, pendingConnector } = useConnect()
    const { address, connector: activeConnector, isConnected, isDisconnected } = useAccount()
    const { chain } = useNetwork()
    const { chains, error: errorSwitch, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork()
    const { open } = useWeb3Modal()

    const router = useRouter()

    const [fee, setFee] = useState(0)
    const [value, setValue] = useState(0)
    const [upgrade, setUpgrade] = useState(null)
    const [usdtBalance, setUsdtBalance] = useState(0)
    const [usdtWidth, setUsdtWidth] = useState(0)
    const [usdtAllowance, setUsdtAllowance] = useState(0)
    const [waitPackage, setWaitPackage] = useState(false)
    const BNBBalance = useBalance({address})
    
    const [ppackage, setPpackage] = useState(0)
    const [ccount, setCcount] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [showModalSuccess, setShowModalSuccess] = useState(false)

    const handleSessionUpdate = async () => {
        await update()
    }

    const getUsdtBalance = useContractRead({
        address: contractData.usdt,
        abi: usdtABI,
        functionName: 'balanceOf',
        args: [address],
        watch: true,
        onSuccess(dt) {
            setUsdtBalance(parseFloat(ethers.formatEther(dt)))
        },
    })

    const getUsdtAllowance = useContractRead({
        address: contractData.usdt,
        abi: usdtABI,
        functionName: 'allowance',
        args: [address, contractData.contract],
        watch: true,
        onSuccess(dt) {
            setUsdtAllowance(parseFloat(ethers.formatEther(dt)))
        },
    })

    const approve = useContractWrite({
        address: contractData.usdt,
        abi: usdtABI,
        functionName: 'approve',
        onMutate(dt){
            setWaitPackage(true)
        },
        onError(error){
            setWaitPackage(false)
        }
    })

    const waitForTransactionUSDT = useWaitForTransaction({
        hash: approve.data?.hash,
        onSuccess(datas) {
            toast("Подтвердите транзакцию покупки в кошельке")
            buyPackage.write({
                args: [contractData.usdt, ccount, ppackage, data?.user?.mes_key, data?.user?.sign],
                from: address,
            })
        }
    })

    const buys = async (hash) => {
        try {
            const response = await buy({
				key: process.env.AUTH_KEY,
				uid: data?.user?.uid,
                hash
			})

            if(response.error){
                console.log("Buy error: ", response.error)
            }
        } catch (error) {
            console.log("Error during buy: ", error)
        }
    }

    const buyPackage = useContractWrite({
        address: contractData.contract,
        abi: sellerABI,
        functionName: 'buy',
        onError(error){
            console.log(error)
        },
        onSuccess(d){
            buys(d.hash)
        }
    }) //data, error, isLoading, isSuccess, isError, write

    const waitForTransaction = useWaitForTransaction({
        hash: buyPackage.data?.hash,
        onSuccess(dt) {
            toast("Покупка оплачена")
            setWaitPackage(false)
            setShowModal(false)
            handleSessionUpdate()
            router.replace("/personal/sprints")
        }
    })

    const feeData = useFeeData({
        watch: true,
        onSuccess(dt) {
            setFee(parseFloat(dt.formatted.gasPrice))
        },
    })

    useEffect(() => {
        if(personalData != null && upgrade == null){
            setUpgrade(personalData?.monts)
        }
    }, [personalData])

    return(
        <>
        {personalData != null &&
        <>
            {personalData?.referal_link != "x" &&
            <div className={`min-w-[300px] md:min-w-[60%] lg:min-w-[unset] w-full md:w-auto lg:w-1/2 ${tr && personalData?.monts ? "xl:w-1/3" : "xl:w-1/3"} md:px-[10px] mb-[20px] xl:mb-0 self-stretch`}>
                <div className="h-full">
                    <div className="bg-gradient-to-t from-violet-600 to-purple-400 shadow px-[18px] py-[22px] pb-[35px] rounded-t-[18px] overflow-hidden relative">
                        <picture>
                        <img src="/tariffs/bg1.png" alt="" className="absolute right-0 top-0 h-[88%]" />
                        </picture>
                        <div>
                            <div className="text-white text-[11px] font-bold uppercase">Standart</div>
                            <div className="mt-[4px] text-white text-lg font-bold">27 USDT</div>
                        </div>
                        <div className="mt-[26px] relative z-10">
                            <div className="flex items-center">
                                <span className="text-white text-lg font-bold">1</span>
                                <span className="ml-[3px]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"
                                        fill="none">
                                        <path d="M10 17.5C9.74911 17.4997 9.50411 17.4239 9.29688 17.2824C6.22696 15.1984 4.89766 13.7695 4.16446 12.8762C2.60196 10.9719 1.85391 9.0168 1.87501 6.89961C1.89962 4.47344 3.8461 2.5 6.21407 2.5C7.93594 2.5 9.12852 3.46992 9.82305 4.27773C9.84505 4.30307 9.87224 4.32338 9.90277 4.3373C9.93329 4.35122 9.96645 4.35842 10 4.35842C10.0336 4.35842 10.0667 4.35122 10.0972 4.3373C10.1278 4.32338 10.155 4.30307 10.177 4.27773C10.8715 3.46914 12.0641 2.5 13.7859 2.5C16.1539 2.5 18.1004 4.47344 18.125 6.9C18.1461 9.01758 17.3973 10.9727 15.8356 12.8766C15.1023 13.7699 13.7731 15.1988 10.7031 17.2828C10.4959 17.4241 10.2509 17.4998 10 17.5Z"
                                            fill="white"/>
                                    </svg>
                                </span>
                            </div>
                            <div className="mt-[2px] text-white text-xs font-normal">Игровая жизнь</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-[18px] px-[18px] py-[18px] mt-[-18px] relative">
                        <div className="pb-4">
                            <ul className="list-none m-0 px-0">
                                <li className="flex">
                                    <span className="pt-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                            fill="none">
                                            <g clip-path="url(#clip0_2109_680)">
                                            <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                                fill="#1C1C1C"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_2109_680">
                                            <rect width="12" height="12" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="pl-[5px] text-gray-500 text-xs font-normal">
                                        Подписка на месяц
                                    </span>
                                </li>
                                <li className="flex mt-[6px]">
                                    <span className="pt-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                            fill="none">
                                            <g clip-path="url(#clip0_2109_680)">
                                            <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                                fill="#1C1C1C"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_2109_680">
                                            <rect width="12" height="12" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="pl-[5px] text-gray-500 text-xs font-normal">
                                        Базовые спринты + Проект Х
                                    </span>
                                </li>
                                <li className="flex mt-[6px]">
                                    <span className="pt-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                            fill="none">
                                            <g clip-path="url(#clip0_2109_680)">
                                            <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                                fill="#1C1C1C"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_2109_680">
                                            <rect width="12" height="12" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="pl-[5px] text-gray-500 text-xs font-normal">
                                        Трекер по достижению целей
                                    </span>
                                </li>
                                <li className="flex mt-[6px]">
                                    <span className="pt-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                            fill="none">
                                            <g clip-path="url(#clip0_2109_680)">
                                            <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                                fill="#1C1C1C"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_2109_680">
                                            <rect width="12" height="12" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="pl-[5px] text-gray-500 text-xs font-normal">
                                        Удобная система отчетов
                                    </span>
                                </li>
                                <li className="flex mt-[6px]">
                                    <span className="pt-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                            fill="none">
                                            <g clip-path="url(#clip0_2109_680)">
                                            <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                                fill="#1C1C1C"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_2109_680">
                                            <rect width="12" height="12" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="pl-[5px] text-gray-500 text-xs font-normal">
                                        Партнерская программа
                                    </span>
                                </li>
                                <li className="flex mt-[6px] opacity-0">
                                    <span className="pt-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                            fill="none">
                                            <g clip-path="url(#clip0_2109_680)">
                                            <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                                fill="#1C1C1C"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_2109_680">
                                            <rect width="12" height="12" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="pl-[5px] text-gray-500 text-xs font-normal">
                                        0
                                    </span>
                                </li>
                                <li className="flex mt-[6px] opacity-0">
                                    <span className="pt-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                            fill="none">
                                            <g clip-path="url(#clip0_2109_680)">
                                            <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                                fill="#1C1C1C"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_2109_680">
                                            <rect width="12" height="12" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="pl-[5px] text-gray-500 text-xs font-normal">
                                        0
                                    </span>
                                </li>
                                <li className="flex mt-[6px] opacity-0">
                                    <span className="pt-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                            fill="none">
                                            <g clip-path="url(#clip0_2109_680)">
                                            <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                                fill="#1C1C1C"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_2109_680">
                                            <rect width="12" height="12" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="pl-[5px] text-gray-500 text-xs font-normal">
                                        0
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div className="w-full">
                            <div className="flex w-full justify-between items-center">
                                <div>
                                    <span className="block text-black text-sm font-semibold">1 мес</span>
                                    <span className="block text-gray-500 text-[8px] font-medium">1 игровая жизнь</span>
                                </div>
                                <div className="text-black text-sm font-semibold">
                                    27 USDT
                                </div>

                                <div>
                                    <button
                                        onClick={() => {
                                            if(isConnected){
                                                if(usdtBalance >= 27 * 1){
                                                    setPpackage(1)
                                                    setValue(27)
                                                    setCcount(1)
                                                    setShowModal(true)
                                                }else{
                                                    toast("Недостаточно USDT")
                                                }
                                            }else{
                                                setShowModalSuccess(true)
                                            }
                                        }} className="h-[31px] px-[20px] rounded-md border border-purple-200 justify-center items-center inline-flex text-center text-violet-600 text-[10px] font-semibold transition-colors hover:text-white hover:bg-violet-600">
                                        Купить
                                    </button>
                                </div>
                            </div>
                            <div className="flex w-full justify-between items-center bg-[url('/tariffs/line.svg')] bg-no-repeat bg-top mt-[10px] pt-[10px]">
                                <div>
                                    <span className="block text-black text-sm font-semibold">3 мес</span>
                                    <span className="block text-gray-500 text-[8px] font-medium">3 игровые жизни</span>
                                </div>
                                <div className="text-black text-sm font-semibold">
                                    81 USDT
                                </div>

                                <div>
                                    <button
                                        onClick={() => {
                                            if(isConnected){
                                                if(usdtBalance >= 27 * 3){
                                                    setPpackage(3)
                                                    setValue(27)
                                                    setCcount(1)
                                                    setShowModal(true)
                                                }else{
                                                    toast("Недостаточно USDT")
                                                }
                                            }else{
                                                setShowModalSuccess(true)
                                            }
                                        }} className="h-[31px] px-[20px] rounded-md border border-purple-200 justify-center items-center inline-flex text-center text-violet-600 text-[10px] font-semibold transition-colors hover:text-white hover:bg-violet-600">
                                        Купить
                                    </button>
                                </div>
                            </div>
                            <div className="flex w-full justify-between items-center bg-[url('/tariffs/line.svg')] bg-no-repeat bg-top mt-[10px] pt-[10px]">
                                <div>
                                    <span className="block text-black text-sm font-semibold">6 мес</span>
                                    <span className="block text-gray-500 text-[8px] font-medium">6 игровых жизней</span>
                                </div>
                                <div className="text-black text-sm font-semibold">
                                    162 USDT
                                </div>

                                <div>
                                    <button
                                        onClick={() => {
                                            if(isConnected){
                                                if(usdtBalance >= 27 * 6){
                                                    setPpackage(6)
                                                    setValue(27)
                                                    setCcount(1)
                                                    setShowModal(true)
                                                }else{
                                                    toast("Недостаточно USDT")
                                                }
                                            }else{
                                                setShowModalSuccess(true)
                                            }
                                        }} className="h-[31px] px-[20px] rounded-md border border-purple-200 justify-center items-center inline-flex text-center text-violet-600 text-[10px] font-semibold transition-colors hover:text-white hover:bg-violet-600">
                                        Купить
                                    </button>
                                </div>
                            </div>
                            <div className="flex w-full justify-between items-center bg-[url('/tariffs/line.svg')] bg-no-repeat bg-top mt-[10px] pt-[10px]">
                                <div>
                                    <span className="block text-black text-sm font-semibold">12 мес</span>
                                    <span className="block text-gray-500 text-[8px] font-medium">12 игровых жизней</span>
                                </div>
                                <div className="text-black text-sm font-semibold">
                                    324 USDT
                                </div>

                                <div>
                                    <button
                                        onClick={() => {
                                            if(isConnected){
                                                if(usdtBalance >= 27 * 12){
                                                    setPpackage(12)
                                                    setValue(27)
                                                    setCcount(1)
                                                    setShowModal(true)
                                                }else{
                                                    toast("Недостаточно USDT")
                                                }
                                            }else{
                                                setShowModalSuccess(true)
                                            }
                                        }} className="h-[31px] px-[20px] rounded-md border border-purple-200 justify-center items-center inline-flex text-center text-violet-600 text-[10px] font-semibold transition-colors hover:text-white hover:bg-violet-600">
                                        Купить
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }
            <div className={`min-w-[300px] md:min-w-[60%] lg:min-w-[unset] w-full md:w-auto lg:w-1/2 ${tr && personalData?.monts ? "xl:w-1/3" : "xl:w-1/3"} md:px-[10px] mb-[20px] xl:mb-0 self-stretch`}>
                <div className="h-full">
                    <div className="bg-gradient-to-t from-violet-600 to-purple-400 shadow px-[18px] py-[22px] pb-[35px] rounded-t-[18px] overflow-hidden relative">
                        <picture>
                        <img src="/tariffs/bg2.png" alt="" className="absolute right-0 top-0 h-[calc(100%+20px)]" />
                        </picture>
                        <div>
                            <div className="text-white text-[11px] font-bold uppercase">Optimal</div>
                            <div className="mt-[4px] text-white text-lg font-bold">35 USDT</div>
                        </div>
                        <div className="mt-[26px] relative z-10">
                            <div className="flex items-center">
                                <span className="text-white text-lg font-bold">1</span>
                                <span className="ml-[3px]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"
                                        fill="none">
                                        <path d="M10 17.5C9.74911 17.4997 9.50411 17.4239 9.29688 17.2824C6.22696 15.1984 4.89766 13.7695 4.16446 12.8762C2.60196 10.9719 1.85391 9.0168 1.87501 6.89961C1.89962 4.47344 3.8461 2.5 6.21407 2.5C7.93594 2.5 9.12852 3.46992 9.82305 4.27773C9.84505 4.30307 9.87224 4.32338 9.90277 4.3373C9.93329 4.35122 9.96645 4.35842 10 4.35842C10.0336 4.35842 10.0667 4.35122 10.0972 4.3373C10.1278 4.32338 10.155 4.30307 10.177 4.27773C10.8715 3.46914 12.0641 2.5 13.7859 2.5C16.1539 2.5 18.1004 4.47344 18.125 6.9C18.1461 9.01758 17.3973 10.9727 15.8356 12.8766C15.1023 13.7699 13.7731 15.1988 10.7031 17.2828C10.4959 17.4241 10.2509 17.4998 10 17.5Z"
                                            fill="white"/>
                                    </svg>
                                </span>
                            </div>
                            <div className="mt-[2px] text-white text-xs font-normal">Игровая жизнь</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-[18px] px-[18px] py-[18px] mt-[-18px] relative">
                        <div className="pb-4">
                            <ul className="list-none m-0 px-0">
                                <li className="flex">
                                    <span className="pt-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                            fill="none">
                                            <g clip-path="url(#clip0_2109_680)">
                                            <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                                fill="#1C1C1C"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_2109_680">
                                            <rect width="12" height="12" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="pl-[5px] text-gray-500 text-xs font-normal">
                                        Подписка на месяц
                                    </span>
                                </li>
                                {personalData?.referal_link != "x" &&
                                <li className="flex mt-[6px]">
                                    <span className="pt-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                            fill="none">
                                            <g clip-path="url(#clip0_2109_680)">
                                            <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                                fill="#1C1C1C"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_2109_680">
                                            <rect width="12" height="12" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="pl-[5px] text-gray-500 text-xs font-normal">
                                        Базовые спринты + Проект Х
                                    </span>
                                </li>
                                }
                                <li className="flex mt-[6px]">
                                    <span className="pt-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                            fill="none">
                                            <g clip-path="url(#clip0_2109_680)">
                                            <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                                fill="#1C1C1C"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_2109_680">
                                            <rect width="12" height="12" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="pl-[5px] text-gray-500 text-xs font-normal">
                                        Трекер по достижению целей
                                    </span>
                                </li>
                                <li className="flex mt-[6px]">
                                    <span className="pt-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                            fill="none">
                                            <g clip-path="url(#clip0_2109_680)">
                                            <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                                fill="#1C1C1C"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_2109_680">
                                            <rect width="12" height="12" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="pl-[5px] text-gray-500 text-xs font-normal">
                                        Удобная система отчетов
                                    </span>
                                </li>
                                {personalData?.referal_link != "x" &&
                                <li className="flex mt-[6px]">
                                    <span className="pt-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                            fill="none">
                                            <g clip-path="url(#clip0_2109_680)">
                                            <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                                fill="#1C1C1C"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_2109_680">
                                            <rect width="12" height="12" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="pl-[5px] text-gray-500 text-xs font-normal">
                                        Партнерская программа
                                    </span>
                                </li>
                                }
                                <li className="flex mt-[6px]">
                                    <span className="pt-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                            fill="none">
                                            <g clip-path="url(#clip0_2109_680)">
                                            <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                                fill="#1C1C1C"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_2109_680">
                                            <rect width="12" height="12" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="pl-[5px] text-violet-600 text-xs font-bold">
                                        Экспертные спринты
                                    </span>
                                </li>
                                <li className="flex mt-[6px] opacity-0">
                                    <span className="pt-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                            fill="none">
                                            <g clip-path="url(#clip0_2109_680)">
                                            <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                                fill="#1C1C1C"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_2109_680">
                                            <rect width="12" height="12" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="pl-[5px] text-gray-500 text-xs font-normal">
                                        0
                                    </span>
                                </li>
                                <li className="flex mt-[6px] opacity-0">
                                    <span className="pt-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                            fill="none">
                                            <g clip-path="url(#clip0_2109_680)">
                                            <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                                fill="#1C1C1C"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_2109_680">
                                            <rect width="12" height="12" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="pl-[5px] text-gray-500 text-xs font-normal">
                                        0
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div className="w-full">
                            <div className="flex w-full justify-between items-center">
                                <div>
                                    <span className="block text-black text-sm font-semibold">1 мес</span>
                                    <span className="block text-gray-500 text-[8px] font-medium">1 игровая жизнь</span>
                                </div>
                                <div className="text-black text-sm font-semibold">
                                    35 USDT
                                </div>

                                <div>
                                    <button
                                        onClick={() => {
                                            if(isConnected){
                                                if(usdtBalance >= 35 * 1){
                                                    setPpackage(1)
                                                    setValue(35)
                                                    setCcount(3)
                                                    setShowModal(true)
                                                }else{
                                                    toast("Недостаточно USDT")
                                                }
                                            }else{
                                                setShowModalSuccess(true)
                                            }
                                        }} className="h-[31px] px-[20px] rounded-md border border-purple-200 justify-center items-center inline-flex text-center text-violet-600 text-[10px] font-semibold transition-colors hover:text-white hover:bg-violet-600">
                                        Купить
                                    </button>
                                </div>
                            </div>
                            <div className="flex w-full justify-between items-center bg-[url('/tariffs/line.svg')] bg-no-repeat bg-top mt-[10px] pt-[10px]">
                                <div>
                                    <span className="block text-black text-sm font-semibold">3 мес</span>
                                    <span className="block text-gray-500 text-[8px] font-medium">3 игровые жизни</span>
                                </div>
                                <div className="text-black text-sm font-semibold">
                                    105 USDT
                                </div>

                                <div>
                                    <button
                                        onClick={() => {
                                            if(isConnected){
                                                if(usdtBalance >= 35 * 3){
                                                    setPpackage(3)
                                                    setValue(35)
                                                    setCcount(3)
                                                    setShowModal(true)
                                                }else{
                                                    toast("Недостаточно USDT")
                                                }
                                            }else{
                                                setShowModalSuccess(true)
                                            }
                                        }} className="h-[31px] px-[20px] rounded-md border border-purple-200 justify-center items-center inline-flex text-center text-violet-600 text-[10px] font-semibold transition-colors hover:text-white hover:bg-violet-600">
                                        Купить
                                    </button>
                                </div>
                            </div>
                            <div className="flex w-full justify-between items-center bg-[url('/tariffs/line.svg')] bg-no-repeat bg-top mt-[10px] pt-[10px]">
                                <div>
                                    <span className="block text-black text-sm font-semibold">6 мес</span>
                                    <span className="block text-gray-500 text-[8px] font-medium">6 игровых жизней</span>
                                </div>
                                <div className="text-black text-sm font-semibold">
                                    210 USDT
                                </div>

                                <div>
                                    <button
                                        onClick={() => {
                                            if(isConnected){
                                                if(usdtBalance >= 35 * 6){
                                                    setPpackage(6)
                                                    setValue(35)
                                                    setCcount(3)
                                                    setShowModal(true)
                                                }else{
                                                    toast("Недостаточно USDT")
                                                }
                                            }else{
                                                setShowModalSuccess(true)
                                            }
                                        }} className="h-[31px] px-[20px] rounded-md border border-purple-200 justify-center items-center inline-flex text-center text-violet-600 text-[10px] font-semibold transition-colors hover:text-white hover:bg-violet-600">
                                        Купить
                                    </button>
                                </div>
                            </div>
                            <div className="flex w-full justify-between items-center bg-[url('/tariffs/line.svg')] bg-no-repeat bg-top mt-[10px] pt-[10px]">
                                <div>
                                    <span className="block text-black text-sm font-semibold">12 мес</span>
                                    <span className="block text-gray-500 text-[8px] font-medium">12 игровых жизней</span>
                                </div>
                                <div className="text-black text-sm font-semibold">
                                    420 USDT
                                </div>

                                <div>
                                    <button
                                        onClick={() => {
                                            if(isConnected){
                                                if(usdtBalance >= 35 * 12){
                                                    setPpackage(12)
                                                    setValue(35)
                                                    setCcount(3)
                                                    setShowModal(true)
                                                }else{
                                                    toast("Недостаточно USDT")
                                                }
                                            }else{
                                                setShowModalSuccess(true)
                                            }
                                        }} className="h-[31px] px-[20px] rounded-md border border-purple-200 justify-center items-center inline-flex text-center text-violet-600 text-[10px] font-semibold transition-colors hover:text-white hover:bg-violet-600">
                                        Купить
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {personalData?.referal_link != "x" &&
            <div className={`min-w-[300px] md:min-w-[60%] lg:min-w-[unset] w-full md:w-auto lg:w-1/2 ${tr && personalData?.monts ? "xl:w-1/3" : "xl:w-1/3"} md:px-[10px] mb-[20px] xl:mb-0 self-stretch`}>
                <div className="h-full">
                    <div className="bg-gradient-to-t from-violet-600 to-purple-400 shadow px-[18px] py-[22px] pb-[35px] rounded-t-[18px] overflow-hidden relative">
                        <picture>
                        <img src="/tariffs/bg3.png" alt="" className="absolute right-0 top-0 h-[calc(100%+20px)]" />
                        </picture>
                        <div>
                            <div className="text-white text-[11px] font-bold uppercase">VIP</div>
                            <div className="mt-[4px] text-white text-lg font-bold">150 USDT</div>
                        </div>
                        <div className="mt-[26px] relative z-10">
                            <div className="flex items-center">
                                <span className="text-white text-lg font-bold">1</span>
                                <span className="ml-[3px]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"
                                        fill="none">
                                        <path d="M10 17.5C9.74911 17.4997 9.50411 17.4239 9.29688 17.2824C6.22696 15.1984 4.89766 13.7695 4.16446 12.8762C2.60196 10.9719 1.85391 9.0168 1.87501 6.89961C1.89962 4.47344 3.8461 2.5 6.21407 2.5C7.93594 2.5 9.12852 3.46992 9.82305 4.27773C9.84505 4.30307 9.87224 4.32338 9.90277 4.3373C9.93329 4.35122 9.96645 4.35842 10 4.35842C10.0336 4.35842 10.0667 4.35122 10.0972 4.3373C10.1278 4.32338 10.155 4.30307 10.177 4.27773C10.8715 3.46914 12.0641 2.5 13.7859 2.5C16.1539 2.5 18.1004 4.47344 18.125 6.9C18.1461 9.01758 17.3973 10.9727 15.8356 12.8766C15.1023 13.7699 13.7731 15.1988 10.7031 17.2828C10.4959 17.4241 10.2509 17.4998 10 17.5Z"
                                            fill="white"/>
                                    </svg>
                                </span>
                            </div>
                            <div className="mt-[2px] text-white text-xs font-normal">Игровая жизнь</div>
                        </div>
                    </div>
                    <div className="bg-white rounded-[18px] px-[18px] py-[18px] mt-[-18px] relative">
                        <div className="pb-4">
                            <ul className="list-none m-0 px-0">
                                <li className="flex">
                                    <span className="pt-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                            fill="none">
                                            <g clip-path="url(#clip0_2109_680)">
                                            <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                                fill="#1C1C1C"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_2109_680">
                                            <rect width="12" height="12" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="pl-[5px] text-gray-500 text-xs font-normal">
                                        Подписка на месяц
                                    </span>
                                </li>
                                <li className="flex mt-[6px]">
                                    <span className="pt-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                            fill="none">
                                            <g clip-path="url(#clip0_2109_680)">
                                            <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                                fill="#1C1C1C"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_2109_680">
                                            <rect width="12" height="12" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="pl-[5px] text-gray-500 text-xs font-normal">
                                        Базовые спринты + Проект Х
                                    </span>
                                </li>
                                <li className="flex mt-[6px]">
                                    <span className="pt-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                            fill="none">
                                            <g clip-path="url(#clip0_2109_680)">
                                            <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                                fill="#1C1C1C"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_2109_680">
                                            <rect width="12" height="12" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="pl-[5px] text-gray-500 text-xs font-normal">
                                        Трекер по достижению целей
                                    </span>
                                </li>
                                <li className="flex mt-[6px]">
                                    <span className="pt-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                            fill="none">
                                            <g clip-path="url(#clip0_2109_680)">
                                            <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                                fill="#1C1C1C"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_2109_680">
                                            <rect width="12" height="12" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="pl-[5px] text-gray-500 text-xs font-normal">
                                        Удобная система отчетов
                                    </span>
                                </li>
                                <li className="flex mt-[6px]">
                                    <span className="pt-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                            fill="none">
                                            <g clip-path="url(#clip0_2109_680)">
                                            <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                                fill="#1C1C1C"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_2109_680">
                                            <rect width="12" height="12" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="pl-[5px] text-gray-500 text-xs font-normal">
                                        Партнерская программа
                                    </span>
                                </li>
                                <li className="flex mt-[6px]">
                                    <span className="pt-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                            fill="none">
                                            <g clip-path="url(#clip0_2109_680)">
                                            <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                                fill="#1C1C1C"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_2109_680">
                                            <rect width="12" height="12" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="pl-[5px] text-gray-500 text-xs font-normal">
                                        Экспертные спринты
                                    </span>
                                </li>
                                <li className="flex mt-[6px]">
                                    <span className="pt-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                            fill="none">
                                            <g clip-path="url(#clip0_2109_680)">
                                            <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                                fill="#1C1C1C"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_2109_680">
                                            <rect width="12" height="12" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="pl-[5px] text-xs text-purple-500 font-bold">
                                        Личный куратор
                                    </span>
                                </li>
                                <li className="flex mt-[6px]">
                                    <span className="pt-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                            fill="none">
                                            <g clip-path="url(#clip0_2109_680)">
                                            <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                                fill="#1C1C1C"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_2109_680">
                                            <rect width="12" height="12" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="pl-[5px] text-xs text-purple-500 font-bold">
                                        Работа в группе (до 10 человек)
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div className="w-full">
                            <div className="flex w-full justify-between items-center">
                                <div>
                                    <span className="block text-black text-sm font-semibold">1 мес</span>
                                    <span className="block text-gray-500 text-[8px] font-medium">1 игровая жизнь</span>
                                </div>
                                <div className="text-black text-sm font-semibold">
                                    150 USDT
                                </div>

                                <div>
                                    <button
                                    disabled={true}
                                    className="h-[31px] px-[20px] disabled:text-gray-400 disabled:border-gray-400 rounded-md border border-purple-200 justify-center items-center inline-flex text-center text-violet-600 text-[10px] font-semibold transition-colors hover:text-white">Купить</button>
                                </div>
                            </div>
                            <div className="flex w-full justify-between items-center bg-[url('/tariffs/line.svg')] bg-no-repeat bg-top mt-[10px] pt-[10px]">
                                <div>
                                    <span className="block text-black text-sm font-semibold">3 мес</span>
                                    <span className="block text-gray-500 text-[8px] font-medium">3 игровые жизни</span>
                                </div>
                                <div className="text-black text-sm font-semibold">
                                    450 USDT
                                </div>

                                <div>
                                    <button
                                    disabled={true}
                                    className="h-[31px] px-[20px] disabled:text-gray-400 disabled:border-gray-400 rounded-md border border-purple-200 justify-center items-center inline-flex text-center text-violet-600 text-[10px] font-semibold transition-colors hover:text-white">Купить</button>
                                </div>
                            </div>
                            <div className="flex w-full justify-between items-center bg-[url('/tariffs/line.svg')] bg-no-repeat bg-top mt-[10px] pt-[10px]">
                                <div>
                                    <span className="block text-black text-sm font-semibold">6 мес</span>
                                    <span className="block text-gray-500 text-[8px] font-medium">6 игровых жизней</span>
                                </div>
                                <div className="text-black text-sm font-semibold">
                                    900 USDT
                                </div>

                                <div>
                                    <button
                                    disabled={true}
                                    className="h-[31px] px-[20px] disabled:text-gray-400 disabled:border-gray-400 rounded-md border border-purple-200 justify-center items-center inline-flex text-center text-violet-600 text-[10px] font-semibold transition-colors hover:text-white">Купить</button>
                                </div>
                            </div>
                            <div className="flex w-full justify-between items-center bg-[url('/tariffs/line.svg')] bg-no-repeat bg-top mt-[10px] pt-[10px]">
                                <div>
                                    <span className="block text-black text-sm font-semibold">12 мес</span>
                                    <span className="block text-gray-500 text-[8px] font-medium">12 игровых жизней</span>
                                </div>
                                <div className="text-black text-sm font-semibold">
                                    1800 USDT
                                </div>

                                <div>
                                    <button
                                    disabled={true}
                                    className="h-[31px] px-[20px] disabled:text-gray-400 disabled:border-gray-400 rounded-md border border-purple-200 justify-center items-center inline-flex text-center text-violet-600 text-[10px] font-semibold transition-colors hover:text-white">Купить</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }
            {tr && personalData?.monts > 0 &&
            <div className="min-w-[300px] md:min-w-[60%] lg:min-w-[unset] w-full md:w-auto lg:w-1/2 xl:w-1/3 md:px-[10px] mb-[20px] md:mt-4 self-stretch">
                <div className="h-full">
                    <div className="h-[178px] bg-gradient-to-t from-violet-600 to-purple-400 shadow px-[18px] py-[22px] pb-[35px] rounded-t-[18px] overflow-hidden relative">
                        <div>
                            <div className="text-white text-[11px] font-bold uppercase">Мой тариф</div>
                            <div className="mt-[4px] text-white text-lg font-bold">{personalData?.monts * 30} дней до конца оплаченного периода</div>
                        </div>
                        <div className="mt-[26px] relative z-10">
                            <div className="flex items-center">
                                <span className="text-white text-lg font-bold">{upgrade}</span>
                                <span className="ml-[3px]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"
                                        fill="none">
                                        <path d="M10 17.5C9.74911 17.4997 9.50411 17.4239 9.29688 17.2824C6.22696 15.1984 4.89766 13.7695 4.16446 12.8762C2.60196 10.9719 1.85391 9.0168 1.87501 6.89961C1.89962 4.47344 3.8461 2.5 6.21407 2.5C7.93594 2.5 9.12852 3.46992 9.82305 4.27773C9.84505 4.30307 9.87224 4.32338 9.90277 4.3373C9.93329 4.35122 9.96645 4.35842 10 4.35842C10.0336 4.35842 10.0667 4.35122 10.0972 4.3373C10.1278 4.32338 10.155 4.30307 10.177 4.27773C10.8715 3.46914 12.0641 2.5 13.7859 2.5C16.1539 2.5 18.1004 4.47344 18.125 6.9C18.1461 9.01758 17.3973 10.9727 15.8356 12.8766C15.1023 13.7699 13.7731 15.1988 10.7031 17.2828C10.4959 17.4241 10.2509 17.4998 10 17.5Z"
                                            fill="white"/>
                                    </svg>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="h-[calc(100%-158px)] bg-white rounded-[18px] px-[18px] py-[18px] mt-[-18px] relative">
                        <div className="pb-4">
                        <ul className="list-none m-0 px-0">
                                <li className="flex">
                                    <span className="pt-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                            fill="none">
                                            <g clip-path="url(#clip0_2109_680)">
                                            <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                                fill="#1C1C1C"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_2109_680">
                                            <rect width="12" height="12" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="pl-[5px] text-gray-500 text-xs font-normal">
                                        Подписка на месяц
                                    </span>
                                </li>
                                <li className="flex mt-[6px]">
                                    <span className="pt-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                            fill="none">
                                            <g clip-path="url(#clip0_2109_680)">
                                            <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                                fill="#1C1C1C"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_2109_680">
                                            <rect width="12" height="12" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="pl-[5px] text-gray-500 text-xs font-normal">
                                        Базовые спринты + Проект Х
                                    </span>
                                </li>
                                <li className="flex mt-[6px]">
                                    <span className="pt-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                            fill="none">
                                            <g clip-path="url(#clip0_2109_680)">
                                            <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                                fill="#1C1C1C"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_2109_680">
                                            <rect width="12" height="12" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="pl-[5px] text-gray-500 text-xs font-normal">
                                        Трекер по достижению целей
                                    </span>
                                </li>
                                <li className="flex mt-[6px]">
                                    <span className="pt-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                            fill="none">
                                            <g clip-path="url(#clip0_2109_680)">
                                            <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                                fill="#1C1C1C"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_2109_680">
                                            <rect width="12" height="12" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="pl-[5px] text-gray-500 text-xs font-normal">
                                        Удобная система отчетов
                                    </span>
                                </li>
                                <li className="flex mt-[6px]">
                                    <span className="pt-[2px]">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                                            fill="none">
                                            <g clip-path="url(#clip0_2109_680)">
                                            <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                                fill="#1C1C1C"/>
                                            </g>
                                            <defs>
                                            <clipPath id="clip0_2109_680">
                                            <rect width="12" height="12" fill="white"/>
                                            </clipPath>
                                            </defs>
                                        </svg>
                                    </span>
                                    <span className="pl-[5px] text-violet-600 text-xs font-bold">
                                        Экспертные спринты
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div className="w-full">
                            <div className="text-black text-sm">Выбери кол-во месяцев</div>
                            <div className="w-full mb-6">
                                <input
                                    type="range"
                                    min="1"
                                    max={personalData?.monts}
                                    step="1"
                                    value={upgrade}
                                    onChange={event => setUpgrade(event.target.value)}
                                    className="transparent h-1.5 w-full cursor-pointer appearance-none rounded-lg border-transparent bg-violet-600"
                                />
                            </div>
                            <div className="flex w-full justify-between items-center">
                                <div>
                                    <span className="block text-black text-sm font-semibold">{upgrade} мес</span>
                                </div>
                                <div className="text-black text-sm font-semibold">
                                    {upgrade * 8} USDT
                                </div>

                                <div>
                                    <button 
                                        onClick={() => {
                                            if(isConnected){
                                                setPpackage(upgrade)
                                                setValue(8)
                                                setCcount(2)
                                                setShowModal(true)
                                            }else{
                                                setShowModalSuccess(true)
                                            }
                                        }} className="h-[31px] px-[20px] rounded-md border border-purple-200 justify-center items-center inline-flex text-center text-violet-600 text-[10px] font-semibold transition-colors hover:text-white hover:bg-violet-600">
                                        Повысить
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            }
            {showModal &&
            <>
                <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[99999] outline-none focus:outline-none"
                >
                    <div className="absolute top-0 left-0 right-0 bottom-0" onClick={() => setShowModal(false)}></div>
                    <div className="relative w-full md:w-3/4 max-h-full mx-auto">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            <div className="flex items-center justify-center p-5">
                                <h3 className="text-2xl text-black">
                                Оплата заказа
                                </h3>
                            </div>
                            <div className='w-full h-full flex flex-col md:flex-row justify-start items-start'>
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
                                                value={personalData?.address}
                                                className="block w-full px-4 mr-4 py-2 text-[#17103c] text-xs h-[50px] bg-white border border-[#e8e8e8] rounded-md focus:outline-none"
                                            />
                                            {address &&
                                            <>
                                                {address == personalData?.address ?
                                                    <Image
                                                        priority
                                                        src={IconCheck}
                                                        alt="Rocket"
                                                        height={20}
                                                    />
                                                :
                                                    <Image
                                                        priority
                                                        src={IconNo}
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
                                                value={address && address}
                                                className="block w-full px-4 mr-4 py-2 text-[#17103c] text-xs h-[50px] bg-white border border-[#e8e8e8] rounded-md focus:outline-none"
                                            />
                                            {address &&
                                            <>
                                                {address == personalData?.address ?
                                                    <Image
                                                        priority
                                                        src={IconCheck}
                                                        alt="Rocket"
                                                        height={20}
                                                    />
                                                :
                                                    <Image
                                                        priority
                                                        src={IconNo}
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
                                                            src={IconNo}
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
                                                    src={IconNo}
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
                                            {usdtBalance >= ppackage ?
                                                <Image
                                                    priority
                                                    src={IconCheck}
                                                    alt="Rocket"
                                                    height={20}
                                                />
                                            :
                                                <Image
                                                    priority
                                                    src={IconNo}
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
                            <div className='flex w-full mb-6 flex-row justify-center items-center'>
                                <button
                                onClick={() => setShowModal(false)}
                                className="px-6 py-2 mr-4 text-white tracking-wide transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
                                    Закрыть
                                </button>
                                {personalData?.address ?
                                <>
                                {chains.map((x) => (
                                    <>
                                    {!switchNetwork || x.id === chain?.id ?
                                        <>
                                        {(usdtBalance >= ppackage && address == personalData?.address && BNBBalance?.data?.formatted) >= 0.00114 &&
                                        <button
                                        disabled={waitPackage}
                                        onClick={() => {
                                            approve.write({
                                                args: [contractData.contract, ethers.parseEther((ppackage * value).toString())],
                                                from: address,
                                            })
                                            toast("Разрешите использование USDT в кошельке (Подтвердите транзакцию)")
                                        }}
                                        className="px-6 py-2 tracking-wide min-h-6 text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
                                            {waitPackage ?
                                            <>
                                            Оплата
                                                <span
                                                className="inline-block pl-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-emerald-950 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                                role="status"
                                                >
                                                    <span
                                                        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                                                </span>
                                                </>
                                            :
                                                <>Оплатить</>
                                            }
                                        </button>
                                        }
                                        </>
                                        :
                                        <button
                                        disabled={!switchNetwork || x.id === chain?.id}
                                        key={x.id}
                                        onClick={() => switchNetwork?.(x.id)}
                                        className="px-6 py-2 tracking-wide min-h-6 text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] disabled:[background:linear-gradient(180deg,_rgba(0,_0,_0,_0),_rgba(0,_0,_0,_0.32)),_rgba(255,_255,_255,_0.12)]">
                                            {isLoading && pendingChainId === x.id ?
                                                <>
                                                Сменить сеть
                                                <span
                                                className="inline-block pl-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-emerald-950 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                                role="status"
                                                >
                                                    <span
                                                        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                                                </span>
                                                </>
                                            :
                                                <>Сменить сеть</>
                                            }
                                        </button>
                                    }
                                    </>
                                ))}
                                </>
                                :
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
            {showModalSuccess &&
                <>
                    <div
                    className="justify-center items-start md:items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[99999] outline-none focus:outline-none"
                    >
                        <div className="absolute top-0 left-0 right-0 bottom-0" onClick={() => setShowModalSuccess(false)}></div>
                        <div className="relative w-full md:w-1/3 m-auto">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full justify-center items-center bg-white outline-none focus:outline-none">
                                <div className="absolute top-5 right-5 w-5 h-5 flex justify-center items-center" onClick={() => setShowModalSuccess(false)}>
                                    <FaTimes className="cursor-pointer text-black" height={20} width={20} />
                                </div>
                                <div className='flex w-full my-6 flex-row justify-center items-center'>
                                {personalData?.address ?
                                <ConnectKitButton.Custom>
                                    {({ isConnecting, show, hide, address, ensName, chain }) => {
                                        return (
                                        <button onClick={show} className="h-[31px] px-[20px] rounded-md border border-purple-200 justify-center items-center inline-flex text-center text-violet-600 text-[10px] font-semibold transition-colors hover:text-white hover:bg-violet-600">
                                            {isConnecting ?
                                            <>
                                                Подключить кошелек
                                                <span
                                                    className="inline-block pl-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-emerald-950 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                                    role="status"
                                                >
                                                    <span
                                                        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                                                </span>
                                            </>
                                            :
                                            <>
                                                Подключить кошелек
                                            </>
                                            }
                                        </button>
                                        );
                                    }}
                                </ConnectKitButton.Custom>
                                :
                                    <Link href="/addwallet" className='h-[31px] px-[20px] rounded-md border border-purple-200 justify-center items-center inline-flex text-center text-violet-600 text-[10px] font-semibold transition-colors hover:text-white hover:bg-violet-600'>Привязать кошелек</Link>
                                }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fixed inset-0 z-[99980] left-0 top-0 bottom-0 right-0 backdrop-blur-lg bg-gray-800/40"></div>
                </>
                }
            <ToastContainer
                position="top-left"
                autoClose={10000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
                toastClassName="z-[9999999]"
                className="[--toastify-color-progress-light:#8532EE]"
            />
        </>
        }
        </>
    )
}