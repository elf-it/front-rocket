"use client"
import { setCookie } from 'cookies-next'
import { useSession } from "next-auth/react"
import { useEffect, useState } from 'react'
import { getPersonalData, activitybutton, buy, setPurpose, withdraw } from '@/lib/fetch'
import { useRouter, usePathname } from "next/navigation"
import { useWeb3Modal } from '@web3modal/react'
import { useContractRead, useContractWrite, useAccount, useConnect, useBalance, useWaitForTransaction, useFeeData, useNetwork, useSwitchNetwork } from 'wagmi'
import usdtABI from '../abi/usdtABI.json'
import sellerABI from '../abi/sellerABI.json'
import { ethers } from "ethers"

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Image from 'next/image'
import Info from "../public/icons/info.svg"
import IconChip from "../public/cards/iconChip.svg"
import IconWaweWhite from "../public/cards/iconWaweWhite.svg"
import IconWaweBlack from "../public/cards/iconWaweBlack.svg"
import Lives from "../public/live.svg"
import IconCheck from "../public/check.svg"
import IconNo from "../public/no.svg"

import Loading from "./Loading"
import Link from 'next/link'
import Tarifs from './Tarifs'
import contractData from "../contractData.json"

export default function PersonalInfo() {

    setCookie('referrer', '')

    const pathname = usePathname()
    
    const {data, status, update} = useSession()

    const router = useRouter()
    const { connect, connectors, error: errorConnect, isLoading: isLoadingC, pendingConnector } = useConnect()
    const { address, connector: activeConnector, isConnected, isDisconnected } = useAccount()
    const { chain } = useNetwork()
    const { chains, error: errorSwitch, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork()
    const { open } = useWeb3Modal()

    const [personalData, setPersonalData] = useState(null)
    const [timer, setTimer] = useState({d: 0, h: 0, m: 0})
    const [usdtBalance, setUsdtBalance] = useState(0)
    const [textConfirm, setTextConfirm] = useState("i m ok")
    const [error, setError] = useState("")
    const [usdtAllowance, setUsdtAllowance] = useState(0)
    const [waitPackage, setWaitPackage] = useState(false)
    const [waitWithdraw, setWaitWithdraw] = useState(false)
    const [fee, setFee] = useState(0)
    const [showModal, setShowModal] = useState(false)
    const [showModalWd, setShowModalWd] = useState(false)
    const [ppackage, setPpackage] = useState(0)
    const [purpose, setnPurpose] = useState("")
    const [usdtWidth, setUsdtWidth] = useState(0)

    const [nextEnableButton, setNextEnableButton] = useState("")

    const BNBBalance = useBalance({address})

    const handleSessionUpdate = async () => {
        await update()
    }

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
                args: [contractData.usdt, 1, ppackage, data?.user?.mes_key, data?.user?.sign],
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

    const withdraws = async (hash) => {
        try {
            const response = await withdraw({
				key: process.env.AUTH_KEY,
				uid: data?.user?.uid,
                hash
			})

            if(response.error){
                console.log("Withdraw error: ", response.error)
            }
        } catch (error) {
            console.log("Error during withdraw: ", error)
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
        }
    })

    const withdrawn = useContractWrite({
        address: contractData.contract,
        abi: sellerABI,
        value: ethers.parseEther('0.0017'),
        functionName: 'withdrawIncome',
        onError(error){
            console.log(error)
            setWaitWithdraw(false)
            toast("Ошибка вывода средств")
        },
        onSuccess(d){
            withdraws(d.hash)
        }
    }) //data, error, isLoading, isSuccess, isError, write

    const waitForWithdraw = useWaitForTransaction({
        hash: withdrawn.data?.hash,
        onSuccess(dt) {
            setShowModalWd(false)
            handleSessionUpdate()
            toast("Запрос на вывод средств принят. Ожидайте зачисления")
        }
    })

    const handleActivity = async (e) => {
        e.preventDefault()
        try {
            const response = await activitybutton({
				key: process.env.AUTH_KEY,
				uid: data?.user?.uid,
                text: textConfirm
			})

            if(response.error){
                setError(response.error)
                console.log("Confirmation error: ", response.error)
            }else{
				getThPersonalData(data?.user?.uid)
                handleSessionUpdate()
			}
        } catch (error) {
            console.log("Error during confirmation: ", error)
        }
    }

    const handlePurpose = async (e) => {
        e.preventDefault()
        try {
            const response = await setPurpose({
				key: process.env.AUTH_KEY,
				uid: data?.user?.uid,
                purpose
			})

            if(response.error){
                console.log("Purpose error: ", response.error)
            }else{
                setnPurpose("")
                getThPersonalData(data?.user?.uid)
                handleSessionUpdate()
			}
        } catch (error) {
            console.log("Error during purpose: ", error)
        }
    }

    const feeData = useFeeData({
        watch: true,
        onSuccess(dt) {
            setFee(parseFloat(dt.formatted.gasPrice))
        },
    })

    const getTime = (ts) => {
        let timeEnable = ts * 1000 - Date.now()
        let daysEnable = Math.floor((timeEnable / (1000 * 60 * 60 * 24)))
        let hoursEnable = Math.floor((timeEnable / 1000 / 60 / 60) % 24)
        let minutesEnable = Math.floor((timeEnable / 1000 / 60) % 60)
        if(minutesEnable <= 0){
            setNextEnableButton(0 + ':' + 0 + ':' + 0)
        }else{
            setNextEnableButton(daysEnable + ':' + hoursEnable + ':' + minutesEnable)
        }

        let time = ts * 1000 - Date.now()
        let days = Math.floor((time / (1000 * 60 * 60 * 24)))
        let hours = Math.floor((time / 1000 / 60 / 60) % 24)
        let minutes = Math.floor((time / 1000 / 60) % 60)
        if(days == 0 & hours == 0 & minutes == 0){
            getThPersonalData()
        }
        setTimer({d: days, h: hours, m: minutes})
    }

    useEffect(() => {
        const init = async () => {
            const { Tooltip, initTE } = await import("tw-elements")
            initTE({ Tooltip, initTE })
        }
        init()
    }, [])

    useEffect(() => {
        setUsdtWidth(document.getElementById('usdt1') && (document.getElementById('usdt1').clientWidth * 4 / 7))
        if(personalData == null){
            getThPersonalData(data?.user?.uid)
        }else{
            if(personalData?.monts_timestamp != 0){
                const interval = setInterval(() => getTime(personalData.monts_timestamp), 1000)
                return () => clearInterval(interval)
            }
        }
    }, [data, personalData])

    return(
        <>
            {status != "loading" ? (
            <>
                <div className='w-full flex flex-row justify-start items-stretch mb-4'>
                    <div className="p-8 w-full rounded-xl bg-white flex flex-row flex-wrap justify-between">
                        <div className="flex flex-row flex-wrap">
                            <div className='flex items-start md:items-start flex-col px-4 py-4 w-1/2 md:w-auto'>
                                <span className="text-2xl text-black font-bold pr-4 md:pr-0">{personalData?.structure || 0}</span>
                                <span className='text-[#687183] text-xs flex items-center justify-center'>
                                    Структура
                                    <Image
                                    src={Info}
                                    height={20}
                                    className='ml-1'
                                    data-te-toggle="tooltip"
                                    data-te-placement="top"
                                    data-te-ripple-init
                                    data-te-ripple-color="light"
                                    title="Кол-во человек в моей структуре"
                                    />
                                </span>
                            </div>
                            <div className='flex items-start md:items-start flex-col px-4 py-4 w-1/2 md:w-auto'>
                                <span className="text-2xl text-black font-bold pr-4 md:pr-0">{personalData?.amount || 0}</span>
                                <span className='text-[#687183] text-xs flex items-center justify-center'>
                                    Личный объем
                                    <Image
                                    src={Info}
                                    height={20}
                                    className='ml-1'
                                    data-te-toggle="tooltip"
                                    data-te-placement="top"
                                    data-te-ripple-init
                                    data-te-ripple-color="light"
                                    title="Сумма моих покупок"
                                    />
                                </span>
                            </div>
                            <div className='flex items-start md:items-start flex-col px-4 py-4 w-1/2 md:w-auto'>
                                <span className="text-2xl text-black font-bold pr-4 md:pr-0">{personalData?.group_volume + personalData?.amount || 0}</span>
                                <span className='text-[#687183] text-xs flex items-center justify-center'>
                                    Групповой объем
                                    <Image
                                    src={Info}
                                    height={20}
                                    className='ml-1'
                                    data-te-toggle="tooltip"
                                    data-te-placement="top"
                                    data-te-ripple-init
                                    data-te-ripple-color="light"
                                    title="Сумма моих покупок + сумма покупок моей структуры"
                                    />
                                </span>
                            </div>
                            <div className='flex items-start md:items-start flex-col px-4 py-4 w-1/2 md:w-auto'>
                                <span className="text-2xl text-black font-bold pr-4 md:pr-0">{personalData?.one_branch_active || 0}</span>
                                <span className='text-[#687183] text-xs flex items-center justify-center'>
                                    Основная ветка
                                    <Image
                                    src={Info}
                                    height={20}
                                    className='ml-1'
                                    data-te-toggle="tooltip"
                                    data-te-placement="top"
                                    data-te-ripple-init
                                    data-te-ripple-color="light"
                                    title="Ветка с наибольшим кол-вом человек"
                                    />
                                </span>
                            </div>
                            <div className='flex items-start md:items-start flex-col px-4 py-4 w-1/2 md:w-auto'>
                                <span className="text-2xl text-black font-bold pr-4 md:pr-0">{personalData?.other_branch_active || 0}</span>
                                <span className='text-[#687183] text-xs flex items-center justify-center'>
                                    Боковые ветки
                                    <Image
                                    src={Info}
                                    height={20}
                                    className='ml-1'
                                    data-te-toggle="tooltip"
                                    data-te-placement="top"
                                    data-te-ripple-init
                                    data-te-ripple-color="light"
                                    title="Кол-во человек в остальных ветках"
                                    />
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-row flex-wrap">
                            <div className='flex flex-col justify-center items-center'>
                                <Link href="/personal/structure" className="px-4 py-2 text-xs tracking-wide text-white transition-colors duration-200 transform [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] rounded-md focus:outline-none">
                                    Моя структура
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full flex flex-row flex-wrap justify-start items-stretch mb-4'>
                    <div className='!md:w-full md:w-4/6 flex flex-row flex-wrap justify-start items-start'>
                        <div id='usdt2' style={{height: usdtWidth}} className="items-end md:pr-2 mb-4 md:mb-0 w-full lg:w-1/2 flex justify-between rounded-lg">
                            <div className="bg-cover bg-center bg-no-repeat bg-[url('../public/cards/card2.svg')] w-full h-full flex-col rounded-lg flex justify-between items-end">
                                <div className="p-4 w-full flex flex-row items-center justify-between">
                                    <div>
                                        <span className='text-white text-lg'>USDT</span>
                                    </div>
                                    <div className='flex flex-none justify-end items-center'>
                                        <Image
                                            priority
                                            src={IconWaweBlack}
                                            alt="Rocket"
                                            height={20}
                                        />
                                        <Image
                                            priority
                                            src={IconChip}
                                            alt="Rocket"
                                            height={40}
                                        />
                                    </div>
                                </div>
                                <div className="p-4 w-full flex flex-row items-end align-bottom justify-start">
                                    <div className='flex flex-col justify-start items-start'>
                                        <span className='text-[#687183] text-md whitespace-nowrap pb-3 flex justify-center items-center'>
                                            Всего получено
                                            <Image
                                            src={Info}
                                            height={20}
                                            className='ml-1'
                                            data-te-toggle="tooltip"
                                            data-te-placement="top"
                                            data-te-ripple-init
                                            data-te-ripple-color="light"
                                            title="Сумма выведенного дохода"
                                            />
                                            </span>
                                        <span className="font-bold text-black">{personalData?.withdrawn.toFixed(2) || 0} USDT</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id='usdt1' style={{height: usdtWidth}} className="items-end lg:pl-2 mb-4 md:mb-0 w-full lg:w-1/2 flex justify-between rounded-lg flex-col">
                            <div className="bg-cover bg-center bg-no-repeat bg-[url('../public/cards/card1.svg')] w-full h-full flex justify-between rounded-lg flex-col items-end">
                                <div className="p-4 w-full flex flex-row items-center justify-between">
                                    <div>
                                        <span className='text-white text-lg'>USDT</span>
                                    </div>
                                    <div className='flex flex-none justify-end items-center'>
                                        <Image
                                            priority
                                            src={IconWaweWhite}
                                            alt="Rocket"
                                            height={20}
                                        />
                                        <Image
                                            priority
                                            src={IconChip}
                                            alt="Rocket"
                                            height={40}
                                        />
                                    </div>
                                </div>
                                <div className="p-4 w-full flex flex-row items-end align-bottom justify-between">
                                    <div className='flex flex-col justify-start items-start'>
                                        <span className='text-[#687183] text-md whitespace-nowrap pb-3 flex justify-center items-center'>
                                            Доступно к получению
                                            <Image
                                            src={Info}
                                            height={20}
                                            className='ml-1'
                                            data-te-toggle="tooltip"
                                            data-te-placement="top"
                                            data-te-ripple-init
                                            data-te-ripple-color="light"
                                            title="Сумма доступная к выводу"
                                            />
                                        </span>
                                        <span className="font-bold text-white">{!waitWithdraw ? (personalData?.accrued.toFixed(2) || 0) : 0} USDT</span>
                                    </div>
                                    <div>
                                        <button
                                        disabled={personalData?.accrued <= 0 || waitWithdraw}
                                        onClick={() => {
                                            if(isConnected){
                                                setShowModalWd(true)
                                            }
                                        }} className="text-white">
                                            Получить
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='w-full md:w-2/6 md:pl-4 flex flex-row flex-wrap justify-start items-start'>
                        <div className="px-2 pb-8 pt-2 w-full h-full rounded-xl bg-white flex flex-row flex-wrap">
                            <div className='flex flex-col px-4 py-2 w-full justify-around'>
                                <div className='w-full justify-center items-center text-center'>
                                    <span className='text-black'>Активность тарифа</span>
                                </div>
                                <div className='w-full justify-center items-center text-center'>
                                    <span className='text-gray-500 text-md'>До окончания активности осталось:</span>
                                </div>
                                <div className="flex flex-row px-4 text-center w-full items-start justify-around">
                                    <div className="flex flex-col items-center p-1">
                                        <span className="countdown text-4xl">
                                        <span style={{"--value":timer.d}}></span>
                                        </span>
                                        дней
                                    </div>
                                    <span className="text-3xl">:</span>
                                    <div className="flex flex-col items-center p-1">
                                        <span className="countdown text-4xl">
                                        <span style={{"--value":timer.h}}></span>
                                        </span>
                                        часов
                                    </div>
                                    <span className="text-3xl">:</span>
                                    <div className="flex flex-col items-center p-1">
                                        <span className="countdown text-4xl">
                                        <span style={{"--value":timer.m}}></span>
                                        </span>
                                        минут
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full md:w-full mt-2 flex flex-row flex-wrap justify-stretch items-start'>
                    <div className='w-full mb-2 justify-start items-start'>
                        <span className='text-black'>Доступные периоды для активации</span>
                    </div>
                    {/*
                    <div className="items-start w-full md:w-auto md:flex-1 mb-2 md:mr-2 flex justify-start h-[236px] overflow-hidden shrink-0 text-left text-[18px] text-b39 bg-white rounded-lg">
                        <div className="shadow-lg p-8 h-full w-full flex flex-col justify-between bg-[length:70%] bg-right bg-no-repeat backdrop-hue-rotate-45 bg-[url('../public/packages/packet1.png')]">
                            <div className='flex flex-col'>
                                <span className="font-bold text-black">27 USDT</span>
                                <span className="text-black text-xs">Доступ на 1 месяц</span>
                                <span className="text-black text-xs">1 игровая жизнь</span>
                            </div>
                            <div>
                            {isConnected ? 
                                <button 
                                    onClick={() => {
                                        if(isConnected){
                                            setPpackage(1)
                                            setShowModal(true)
                                        }else{
                                            connect({connector})
                                        }
                                    }} className="px-4 py-2 text-xs tracking-wide text-white transition-colors duration-200 transform [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] rounded-md focus:outline-none">
                                    Купить
                                </button>
                            :
                                <>
                                {personalData?.address ?
                                <>
                                    {connectors.map((connector) => (
                                        <button
                                        key={connector.id}
                                        onClick={() => connect({connector})}
                                        className="px-4 py-2 text-xs tracking-wide text-white transition-colors duration-200 transform [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] rounded-md focus:outline-none">
                                            {isLoading ?
                                            <>
                                                <span
                                                    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-emerald-950 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                                    role="status"
                                                >
                                                    <span
                                                        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                                                </span>
                                            </>
                                            :
                                            <>
                                                <p className="ml-4 text-sm text-center text-white">
                                                Подключить кошелек
                                                </p>
                                            </>
                                            }
                                        </button>
                                    ))}
                                </>
                                :
                                    <Link href="/addwallet" className='px-4 py-2 text-xs tracking-wide text-white transition-colors duration-200 transform [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] rounded-md focus:outline-none'>Привязать кошелек</Link>
                                }
                                </>
                            }
                            </div>
                        </div>
                    </div>
                    <div className="items-start w-full md:w-auto md:flex-1 mb-2 md:mr-2 flex justify-start h-[236px] overflow-hidden shrink-0 text-left text-[18px] text-b39 bg-white rounded-lg">
                        <div className="shadow-lg p-8 h-full w-full flex flex-col justify-between bg-[length:70%] bg-right bg-no-repeat backdrop-hue-rotate-45 bg-[url('../public/packages/packet2.png')]">
                            <div className='flex flex-col'>
                                <span className="font-bold text-black">81 USDT</span>
                                <span className="text-black text-xs">Доступ на 3 месяца</span>
                                <span className="text-black text-xs">3 игровые жизни</span>
                            </div>
                            <div>
                            {isConnected ? 
                                <button 
                                    onClick={() => {
                                        if(isConnected){
                                            setPpackage(3)
                                            setShowModal(true)
                                        }else{
                                            connect({connector})
                                        }
                                    }} className="px-4 py-2 text-xs tracking-wide text-white transition-colors duration-200 transform [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] rounded-md focus:outline-none">
                                    Купить
                                </button>
                            :
                                <>
                                {personalData?.address ?
                                <>
                                    {connectors.map((connector) => (
                                        <button
                                        key={connector.id}
                                        onClick={() => connect({connector})}
                                        className="px-4 py-2 text-xs tracking-wide text-white transition-colors duration-200 transform [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] rounded-md focus:outline-none">
                                            {isLoading ?
                                            <>
                                                <span
                                                    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-emerald-950 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                                    role="status"
                                                >
                                                    <span
                                                        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                                                </span>
                                            </>
                                            :
                                            <>
                                                <p className="ml-4 text-sm text-center text-white">
                                                Подключить кошелек
                                                </p>
                                            </>
                                            }
                                        </button>
                                    ))}
                                </>
                                :
                                    <Link href="/addwallet" className='px-4 py-2 text-xs tracking-wide text-white transition-colors duration-200 transform [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] rounded-md focus:outline-none'>Привязать кошелек</Link>
                                }
                                </>
                            }
                            </div>
                        </div>
                    </div>
                    <div className="items-start w-full md:w-auto md:flex-1 mb-2 md:mr-2 flex justify-start h-[236px] overflow-hidden shrink-0 text-left text-[18px] text-b39 bg-white rounded-lg">
                        <div className="shadow-lg p-8 h-full w-full flex flex-col justify-between bg-[length:70%] bg-right bg-no-repeat backdrop-hue-rotate-45 bg-[url('../public/packages/packet3.png')]">
                            <div className='flex flex-col'>
                                <span className="font-bold text-black">162 USDT</span>
                                <span className="text-black text-xs">Доступ на 6 месяцев</span>
                                <span className="text-black text-xs">6 игровых жизней</span>
                            </div>
                            <div>
                            {isConnected ? 
                                <button 
                                    onClick={() => {
                                        if(isConnected){
                                            setPpackage(6)
                                            setShowModal(true)
                                        }else{
                                            connect({connector})
                                        }
                                    }} className="px-4 py-2 text-xs tracking-wide text-white transition-colors duration-200 transform [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] rounded-md focus:outline-none">
                                    Купить
                                </button>
                            :
                                <>
                                {personalData?.address ?
                                <>
                                    {connectors.map((connector) => (
                                        <button
                                        key={connector.id}
                                        onClick={() => connect({connector})}
                                        className="px-4 py-2 text-xs tracking-wide text-white transition-colors duration-200 transform [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] rounded-md focus:outline-none">
                                            {isLoading ?
                                            <>
                                                <span
                                                    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-emerald-950 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                                    role="status"
                                                >
                                                    <span
                                                        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                                                </span>
                                            </>
                                            :
                                            <>
                                                <p className="ml-4 text-sm text-center text-white">
                                                Подключить кошелек
                                                </p>
                                            </>
                                            }
                                        </button>
                                    ))}
                                </>
                                :
                                    <Link href="/addwallet" className='px-4 py-2 text-xs tracking-wide text-white transition-colors duration-200 transform [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] rounded-md focus:outline-none'>Привязать кошелек</Link>
                                }
                                </>
                            }
                            </div>
                        </div>
                    </div>
                    <div className="items-start w-full md:w-auto md:flex-1 mb-2 flex justify-start h-[236px] overflow-hidden shrink-0 text-left text-[18px] text-b39 bg-white rounded-lg">
                        <div className="shadow-lg p-8 h-full w-full flex flex-col justify-between bg-[length:70%] bg-right bg-no-repeat backdrop-hue-rotate-45 bg-[url('../public/packages/packet4.png')]">
                            <div className='flex flex-col'>
                                <span className="font-bold text-black">324 USDT</span>
                                <span className="text-black text-xs">Доступ на 12 месяцев</span>
                                <span className="text-black text-xs">12 игровых жизней</span>
                            </div>
                            <div>
                            {isConnected ? 
                                <button 
                                    onClick={() => {
                                        if(isConnected){
                                            setPpackage(12)
                                            setShowModal(true)
                                        }else{
                                            connect({connector})
                                        }
                                    }} className="px-4 py-2 text-xs tracking-wide text-white transition-colors duration-200 transform [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] rounded-md focus:outline-none">
                                    Купить
                                </button>
                            :
                                <>
                                {personalData?.address ?
                                <>
                                    {connectors.map((connector) => (
                                        <button
                                        key={connector.id}
                                        onClick={() => connect({connector})}
                                        className="px-4 py-2 text-xs tracking-wide text-white transition-colors duration-200 transform [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] rounded-md focus:outline-none">
                                            {isLoading ?
                                            <>
                                                <span
                                                    className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-emerald-950 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                                    role="status"
                                                >
                                                    <span
                                                        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                                                </span>
                                            </>
                                            :
                                            <>
                                                <p className="ml-4 text-sm text-center text-white">
                                                        Подключить кошелек
                                                </p>
                                            </>
                                            }
                                        </button>
                                    ))}
                                </>
                                :
                                    <Link href="/addwallet" className='px-4 py-2 text-xs tracking-wide text-white transition-colors duration-200 transform [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] rounded-md focus:outline-none'>Привязать кошелек</Link>
                                }
                                </>
                            }
                            </div>
                        </div>
                    </div>
                    */}
                    <Tarifs data={data} personalData={personalData} update={update} />
                </div>
                </>
                )
                :
                (<>
                    <Loading />
                </>)
            }
            {/*showModal &&
            <>
                <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[99999] outline-none focus:outline-none"
                >
                    <div className="relative w-3/4 mx-auto">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            <div className="flex items-center justify-center p-5">
                                <h3 className="text-2xl text-black">
                                Оплата заказа
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
                                                args: [contractData.contract, ethers.parseEther((ppackage * 27).toString())],
                                                from: address,
                                            })
                                            toast("Разрешите использование USDT в кошельке (Подтвердите транзакцию)")
                                        }}
                                        className="px-6 py-2 tracking-wide min-h-6 text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
                                            {waitPackage ?
                                                <span
                                                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-emerald-950 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                                role="status"
                                                >
                                                    <span
                                                        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                                                </span>
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
                                                <span
                                                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-emerald-950 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                                role="status"
                                                >
                                                    <span
                                                        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                                                </span>
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
            */}
            {showModalWd &&
            <>
                <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[99999] outline-none focus:outline-none"
                >
                    <div className="absolute top-0 left-0 right-0 bottom-0" onClick={() => setShowModalWd(false)}></div>
                    <div className="relative w-full md:w-3/4 max-h-full mx-auto">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            <div className="flex items-center justify-center p-5">
                                <h3 className="text-2xl text-black">
                                Вывод бонусов
                                </h3>
                            </div>
                            <div className='w-full h-full flex justify-start items-start flex-col md:flex-row'>
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
                                            {BNBBalance?.data?.formatted >= 0.00284 ?
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
                                            <Image
                                                priority
                                                src={IconCheck}
                                                alt="Rocket"
                                                height={20}
                                            />
                                        </div>
                                        <span className="w-full text-black opacity-[0.3] text-xs pt-2 pr-6">
                                        Баланс USDT (BEP20) на подключенном кошельке
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='flex w-full mb-6 flex-row justify-center items-center'>
                                <button
                                onClick={() => setShowModalWd(false)}
                                className="px-6 py-2 mr-4 text-white tracking-wide transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
                                    Закрыть
                                </button>
                                {chains.map((x) => (
                                    <>
                                    {!switchNetwork || x.id === chain?.id ?
                                        <>
                                        {address == personalData?.address &&
                                        <button
                                        disabled={waitWithdraw}
                                        onClick={() => {
                                            setWaitWithdraw(true)
                                            withdrawn.write({
                                                args: [data?.user?.mes_key, data?.user?.sign],
                                                from: address,
                                            })
                                            toast("Подтвердите вывод стредств в кошельке")
                                        }}
                                        className="px-6 py-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
                                            {waitWithdraw ?
                                                <span
                                                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-emerald-950 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                                role="status"
                                                >
                                                    <span
                                                        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                                                </span>
                                            :
                                                <>Вывести</>
                                            }
                                        </button>
                                        }
                                        </>
                                        :
                                        <button
                                        disabled={!switchNetwork || x.id === chain?.id}
                                        key={x.id}
                                        onClick={() => switchNetwork?.(x.id)}
                                        className="px-6 py-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
                                            {isLoading && pendingChainId === x.id ?
                                                <span
                                                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] text-emerald-950 motion-reduce:animate-[spin_1.5s_linear_infinite]"
                                                role="status"
                                                >
                                                    <span
                                                        className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                                                </span>
                                            :
                                                <>Сменить сеть</>
                                            }
                                        </button>
                                    }
                                    </>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="fixed inset-0 z-[99998] left-0 top-0 bottom-0 right-0 backdrop-blur-lg bg-gray-800/40"></div>
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
                className="[--toastify-color-progress-light:#8532EE]"
            />
        </>
    );
}