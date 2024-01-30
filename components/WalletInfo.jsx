"use client"
import { useSession } from "next-auth/react"
import { useEffect, useState } from 'react'
import { getWalletData, getPersonalData, withdraw } from '@/lib/fetch'
import { useWeb3Modal } from '@web3modal/react'
import { useContractWrite, useAccount, useConnect, useBalance, useWaitForTransaction, useFeeData, useNetwork, useSwitchNetwork } from 'wagmi'
import sellerABI from '../abi/sellerABI.json'
import { ethers } from "ethers"

import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import Image from 'next/image'
import IconCheck from "../public/check.svg"
import IconNo from "../public/no.svg"
import contractData from "../contractData.json"
import Loading from "./Loading"

export default function WalletInfo() {
    
    const {data, status, update} = useSession()

    const { connect, connectors, error: errorConnect, isLoading: isLoadingC, pendingConnector } = useConnect()
    const { address, connector: activeConnector, isConnected, isDisconnected } = useAccount()
    const { chain } = useNetwork()
    const { chains, error: errorSwitch, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork()
    const { open } = useWeb3Modal()

    const [personalData, setPersonalData] = useState(null)

    const [usdtBalance, setUsdtBalance] = useState(0)
    const [waitWithdraw, setWaitWithdraw] = useState(false)
    const [showModalWd, setShowModalWd] = useState(false)
    const [usdtWidth, setUsdtWidth] = useState(0)
    const BNBBalance = useBalance({address})

    const [bar, setBar] = useState(false)
    const [openSort, setOpenSort] = useState(false)

    const [walletData, setWalletData] = useState(null)

    const [summ, setSumm] = useState(0)
    const [bonuses, setBonuses] = useState(0)
    const [pay, setPay] = useState(0)
    const [nPay, setNPay] = useState(0)
    const [fee, setFee] = useState(0)

    const handleSessionUpdate = async () => {
        await update()
    }

    const getThWalletData = async (uid) => {
        try {
            const response = await getWalletData({
				key: process.env.AUTH_KEY,
				uid
			})

            if(response.error){
                setWalletData(null)
            }else{
                setWalletData(response)
			}
        } catch (error) {
            console.log("Error: ", error)
        }
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

    const allSumm = () => {
        let s = 0
        let b = 0
        let payable = 0
        let nonPayable = 0
        for(let i = 0; i < walletData?.transactions.length; i++){
            if(walletData?.transactions[i].type == 0){
                s += parseFloat(walletData?.transactions[i].summ.toString().slice(0, 3))
            }else{
                b += parseFloat(walletData?.transactions[i].summ.toString().slice(0, 3))
            }
            
            if(walletData?.transactions[i].status == 1){
                payable++
            }else{
                nonPayable++
            }
        }
        setPay(payable)
        setNPay(nonPayable)
        setSumm(s)
        setBonuses(b)
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

    const feeData = useFeeData({
        watch: true,
        onSuccess(dt) {
            setFee(parseFloat(dt.formatted.gasPrice))
        },
    })

    useEffect(() => {
        if(walletData == null){
            getThWalletData(data?.user?.uid)
        }else{
            allSumm()
        }
        if(personalData == null){
            getThPersonalData(data?.user?.uid)
        }

    }, [data, walletData, personalData])

    return(
        <>
            {status != "loading" ? (
                <>
                <div className={`bg-white rounded-xl w-full px-[20px] lg:px-[40px] ${bar ? "flex" : "hidden"}`}>
                    <div className="flex  content-center items-start md:items-center py-[16px] md:py-[0] h-auto md:h-[120px] flex-wrap mx-[-10px] xl:mx-[-30px] ">
                        <div className="py-[5px] md:py-0 w-1/2 md:w-1/4 xl:w-auto  justify-start items-center flex flex-wrap px-[10px] lg:px-[10px] xl:px-[30px]">
                            <div className="text-gray-500 text-xs font-normal">Всего счетов</div>
                            <div className="text-zinc-900 text-sm md:text-xl font-bold ml-[0] md:ml-[0] lg:ml-[10px] w-full lg:w-auto">
                            {walletData?.count || 0}
                            </div>
                        </div>
                        <div className="py-[5px] md:py-0 w-1/2 md:w-1/4 xl:w-auto  justify-start items-center flex flex-wrap px-[10px] lg:px-[10px] xl:px-[30px]">
                            <div className="text-gray-500 text-xs font-normal">Оплаченных счетов</div>
                            <div className="text-zinc-900 text-sm md:text-xl font-bold ml-[0] md:ml-[0] lg:ml-[10px] w-full lg:w-auto">
                            {pay}
                            </div>
                        </div>
                        <div className="py-[5px] md:py-0 w-1/2 md:w-1/4 xl:w-auto  justify-start items-center flex flex-wrap px-[10px] lg:px-[10px] xl:px-[30px]">
                            <div className="text-gray-500 text-xs font-normal">Не оплаченных счетов</div>
                            <div className="text-zinc-900 text-sm md:text-xl font-bold ml-[0] md:ml-[0] lg:ml-[10px] w-full lg:w-auto">
                            {nPay}
                            </div>
                        </div>
                        <div className="py-[5px] md:py-0 w-1/2 md:w-1/4 xl:w-auto  justify-start items-center flex flex-wrap px-[10px] lg:px-[10px] xl:px-[30px]">
                            <div className="text-gray-500 text-xs font-normal">Общая сумма по счетам, USDT</div>
                            <div className="text-zinc-900 text-sm md:text-xl font-bold ml-[0] md:ml-[0] lg:ml-[10px] w-full lg:w-auto">
                            {summ.toFixed(2)}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={`bg-white rounded-xl w-full px-[20px] lg:px-[40px] mt-[20px] ${bar ? "hidden" : "flex"}`}>
                    <div className="flex flex-wrap content-center items-center justify-between py-[16px] md:py-[0] h-auto md:h-[120px] ">
                        <div className="flex w-full content-center items-start md:items-center flex-wrap mx-[-10px] xl:mx-[-30px] md:w-10/12">
                            <div className="py-[5px] md:py-0 w-1/2  md:w-auto  justify-start items-center flex flex-wrap px-[10px] lg:px-[10px] xl:px-[30px]">
                                <div className="text-gray-500 text-xs font-normal">Доступно к получению</div>
                                <div className="text-zinc-900 text-sm md:text-xl font-bold ml-[0] md:ml-[0] lg:ml-[10px] w-full lg:w-auto">
                                    {!waitWithdraw ? (personalData?.accrued.toFixed(2) || 0) : 0} USDT
                                </div>
                            </div>
                            <div className="py-[5px] md:py-0 w-1/2  md:w-auto  justify-start items-center flex flex-wrap px-[10px] lg:px-[10px] xl:px-[30px]">
                                <div className="text-gray-500 text-xs font-normal">Всего получено</div>
                                <div className="text-zinc-900 text-sm md:text-xl font-bold ml-[0] md:ml-[0] lg:ml-[10px] w-full lg:w-auto">
                                    {personalData?.withdrawn.toFixed(2) || 0} USDT
                                </div>
                            </div>
                            <div className="py-[5px] md:py-0 w-1/2  md:w-auto  justify-start items-center flex flex-wrap px-[10px] lg:px-[10px] xl:px-[30px]">
                                <div className="text-gray-500 text-xs font-normal">Всего бонусов</div>
                                <div className="text-zinc-900 text-sm md:text-xl font-bold ml-[0] md:ml-[0] lg:ml-[10px] w-full lg:w-auto">
                                    {bonuses.toFixed(2)} USDT
                                </div>
                            </div>
                        </div>
                        <div className="flex w-full md:w-auto">
                            <button
                            disabled={personalData?.accrued <= 0 || waitWithdraw}
                            onClick={() => {
                                if(isConnected){
                                    setShowModalWd(true)
                                }
                            }} className="hover:opacity-90 transition-opacity justify-center items-center mt-[6px] md:mt-[0] px-[38px] inline-flex h-[38px] w-full md:w-auto md:h-[46px] bg-gradient-to-t from-violet-600 to-purple-400 rounded-md shadow text-center text-white text-xs font-semibold">
                                Получить
                            </button>
                        </div>
                    </div>

                </div>
                <div className="w-full p-[20px] md:p-[32px] bg-white rounded-xl mt-[20px]">
                    <div className="justify-between flex items-center">
                        <div className="flex items-center">
                            <button onClick={() => setBar(false)}
                            className={`${bar ? "border border-[#1c1c1c] opacity-50 inline-flex h-[32px] md:h-[38px] items-center px-[16px] md:px-[20px] bg-white text-[#1C1C1C] rounded-[6px] font-semibold text-xs hover:text-white hover:bg-[#1C1C1C] hover:opacity-100" : "hover:text-white hover:bg-[#1C1C1C] inline-flex h-[32px] md:h-[38px] items-center px-[16px] md:px-[20px] bg-[#1C1C1C] text-white rounded-[6px] font-semibold text-xs"}`}>Бонусы</button>
                            <button onClick={() => setBar(true)}
                            className={`${!bar ? "border border-[#1c1c1c] opacity-50 inline-flex h-[32px] md:h-[38px] items-center px-[16px] md:px-[20px] bg-white text-[#1C1C1C] rounded-[6px] font-semibold text-xs ml-[10px] hover:text-white hover:bg-[#1C1C1C] hover:opacity-100" : "hover:text-white hover:bg-[#1C1C1C] inline-flex h-[32px] md:h-[38px] items-center px-[16px] md:px-[20px] ml-[10px] bg-[#1C1C1C] text-white rounded-[6px] font-semibold text-xs"}`}>Список
                                счетов</button>
                        </div>

                        <div>
                            <div className="justify-start items-start flex mx-[-4px]">
                                <div className="flex px-[4px]">
                                    {/*onClick={() => setOpenSort(true)}*/}
                                    <button
                                    className="w-[32px] h-[32px] md:w-[46px] md:h-[46px] relative bg-white flex items-center justify-center rounded-lg shadow border border-neutral-100">
                                        <svg className="w-[14px] md:w-[21px] h-[14px] md:h-[21px] " xmlns="http://www.w3.org/2000/svg"
                                            width="21" height="21" viewBox="0 0 22 21" fill="none">
                                            <path fill-rule="evenodd" clip-rule="evenodd"
                                                d="M3.95334 3.28125C3.5632 3.28137 3.23647 3.49458 3.23647 3.49458C2.90975 3.70779 2.75254 4.06486 2.75254 4.06486C2.59532 4.42192 2.65867 4.80688 2.65867 4.80688C2.72203 5.19184 2.98537 5.47969 2.98537 5.47969L8.37334 11.4089L8.37407 11.4093C8.37501 11.4091 8.37506 11.4042 8.37506 11.4042L8.37503 17.809C8.37871 18.1759 8.56576 18.4838 8.56576 18.4838C8.7528 18.7917 9.07082 18.9609 9.07082 18.9609C9.38884 19.1302 9.74871 19.1134 9.74871 19.1134C10.1086 19.0966 10.4094 18.8984 10.4094 18.8984L13.0371 17.1494C13.3113 16.9716 13.4697 16.6768 13.4697 16.6768C13.6281 16.3821 13.625 16.0475 13.625 16.0475L13.625 11.4107L19.0162 5.47806C19.278 5.19184 19.3414 4.80688 19.3414 4.80688C19.4047 4.42191 19.2475 4.06485 19.2475 4.06485C19.0903 3.70779 18.7636 3.49458 18.7636 3.49458C18.4369 3.28137 18.0467 3.28125 18.0467 3.28125H3.95334ZM9.34469 10.5262L3.95375 4.59375L18.0463 4.59375L18.0448 4.59538L12.6615 10.5196C12.3076 10.8984 12.3125 11.4105 12.3125 11.4105L12.3126 16.0552L12.3112 16.056L12.3098 16.0568L9.68753 17.8023L9.6875 11.4169C9.69249 10.8984 9.34469 10.5262 9.34469 10.5262Z"
                                                fill="#060B39"/>
                                        </svg>
                                    </button>
                                </div>
                                <div className="flex px-[4px]">
                                    <a href="#"
                                    className="w-[32px] h-[32px] md:w-[46px] md:h-[46px] relative bg-white flex items-center justify-center rounded-lg shadow border border-neutral-100">
                                        <svg className="w-[15px] md:w-[21px] h-[14px] md:h-[21px]" xmlns="http://www.w3.org/2000/svg"
                                            width="22" height="21" viewBox="0 0 22 21" fill="none">
                                            <path d="M8.01907 8.55974L8.01873 8.5594C7.89566 8.43633 7.72874 8.36719 7.55469 8.36719C7.38064 8.36719 7.21372 8.43633 7.09065 8.5594C6.96758 8.68247 6.89844 8.84939 6.89844 9.02344C6.89844 9.19748 6.96758 9.3644 7.09065 9.48748L10.536 12.9328C10.659 13.0559 10.826 13.125 11 13.125C11.174 13.125 11.341 13.0559 11.464 12.9328L14.9091 9.48772L14.9094 9.48748C15.0324 9.36441 15.1016 9.19749 15.1016 9.02344C15.1016 9.01293 15.1013 9.00241 15.1008 8.99191C15.093 8.82896 15.0247 8.67476 14.9094 8.5594C14.7863 8.43633 14.6194 8.36719 14.4453 8.36719C14.2713 8.36719 14.1043 8.43633 13.9813 8.5594L13.981 8.55964L11 11.5407L8.01907 8.55974Z"
                                                fill="#060B39"/>
                                            <path d="M10.3438 3.28125L10.3438 12.4687C10.3438 12.8312 10.6376 13.125 11 13.125C11.3624 13.125 11.6563 12.8312 11.6563 12.4688L11.6563 3.28125C11.6563 2.91881 11.3624 2.625 11 2.625C10.6376 2.625 10.3438 2.91881 10.3438 3.28125Z"
                                                fill="#1C1C1C"/>
                                            <path d="M4.4375 17.0625V12.4688C4.4375 12.1063 4.14369 11.8125 3.78125 11.8125C3.41881 11.8125 3.125 12.1063 3.125 12.4688V17.0625C3.125 17.6062 3.50942 17.9906 3.50942 17.9906C3.89384 18.375 4.4375 18.375 4.4375 18.375H17.5625C18.1062 18.375 18.4906 17.9906 18.4906 17.9906C18.875 17.6062 18.875 17.0625 18.875 17.0625V12.4688C18.875 12.1063 18.5812 11.8125 18.2188 11.8125C17.8563 11.8125 17.5625 12.1063 17.5625 12.4688V17.0625H4.4375Z"
                                                fill="#1C1C1C"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={`mt-[30px] md:mt-[50px] ${!bar ? "hidden" : "block"}`}>
                        <div className="text-zinc-900 text-base md:text-xl font-bold">Список счетов</div>
                        <div className="mt-[16px] md:mt-[24px] overflow-auto">
                            <table className="table-auto w-full min-w-[1060px]">
                                <thead>
                                <tr className="border border-[#C2C9D1] border-opacity-75">
                                    <th className="text-center text-xs text-black font-semibold leading-none pt-[22px] pb-[10px] w-[21%]">
                                        Ун.№ транзакции
                                    </th>
                                    <th className="text-center text-xs text-black font-semibold leading-none pt-[22px] pb-[10px] w-[16%]">
                                        Описание
                                    </th>
                                    <th className="text-center text-xs text-black font-semibold leading-none pt-[22px] pb-[10px] w-[16%]">
                                        Дата
                                    </th>
                                    <th className="text-center text-xs text-black font-semibold leading-none pt-[22px] pb-[10px] w-[12%]">
                                        Статус
                                    </th>
                                    <th className="text-center text-xs text-black font-semibold leading-none pt-[22px] pb-[10px] w-[18%]">
                                        Сумма, USDT
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {walletData?.transactions.map((item, i) => (
                                    <>
                                    {item.type == 0 &&
                                        <tr key={i} className="hover:bg-neutral-100 border border-[#C2C9D1] border-opacity-75">
                                            <td className="px-[10px] leading-none text-xs font-normal text-black">{item.transaction_uid.substring(0, 4)}....{item.transaction_uid.substring(item.transaction_uid.length - 4)}</td>
                                            <td className="px-[10px] leading-none text-xs font-normal text-black text-center">Оплата пакета</td>
                                            <td className="px-[10px] leading-none text-xs font-normal text-black text-center">{new Date(Number(item.timestamp) * 1000).toDateString()}</td>
                                            <td className="px-[10px] leading-none text-xs font-normal text-black text-center pt-[12px] pb-[12px]">
                                            {item.status == 1 ?
                                            (
                                                <div>
                                                    <div className="inline-flex justify-center items-center border border-green-500 border-opacity-75 rounded px-[6px] py-[5px] ">
                                                        <div className="bg-green-500 w-[7px] h-[7px] rounded-full"></div>
                                                        <div className="ml-[6px] text-green-500 font-semibold text-xs leading-none">Paid</div>
                                                    </div>
                                                </div>
                                            )
                                            :
                                            (
                                                <div>
                                                    <div className="inline-flex justify-center items-center border border-red-500 border-opacity-75 rounded px-[6px] py-[5px] ">
                                                        <div className="bg-red-500 w-[7px] h-[7px] rounded-full"></div>
                                                        <div className="ml-[6px] text-red-500 font-semibold text-xs leading-none">Overdue</div>
                                                    </div>
                                                </div>
                                            )
                                            }</td>
                                            <td className="px-[10px] leading-none text-xs font-normal text-black text-center">{"$ " + item.summ.toFixed(2)}</td>
                                        </tr>
                                    }
                                    </>
                                ))}

                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className={`mt-[30px] md:mt-[50px] ${!bar ? "block" : "hidden"}`}>
                        <div className="text-zinc-900 text-base md:text-xl font-bold">Бонусы</div>
                        <div className="mt-[16px] md:mt-[24px] overflow-auto">
                            <table className="table-auto w-full min-w-[1060px]">
                                <thead>
                                <tr className="border border-[#C2C9D1] border-opacity-75">
                                    <th className="text-center text-xs text-black font-semibold leading-none pt-[22px] pb-[10px] w-[21%]">
                                        Ун.№ транзакции
                                    </th>
                                    <th className="text-center text-xs text-black font-semibold leading-none pt-[22px] pb-[10px] w-[16%]">
                                        Описание
                                    </th>
                                    <th className="text-center text-xs text-black font-semibold leading-none pt-[22px] pb-[10px] w-[16%]">
                                        Дата
                                    </th>
                                    <th className="text-center text-xs text-black font-semibold leading-none pt-[22px] pb-[10px] w-[12%]">
                                        Статус
                                    </th>
                                    <th className="text-center text-xs text-black font-semibold leading-none pt-[22px] pb-[10px] w-[18%]">
                                        Сумма, USDT
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                {walletData?.transactions.map((item, i) => (
                                    <>
                                    {item.type == 1 &&
                                        <tr key={i} className="hover:bg-neutral-100 border border-[#C2C9D1] border-opacity-75">
                                            <td className="px-[10px] leading-none text-xs font-normal text-black">{item.transaction_uid.substring(0, 4)}....{item.transaction_uid.substring(item.transaction_uid.length - 4)}</td>
                                            <td className="px-[10px] leading-none text-xs font-normal text-black text-center">{(item.type == 0 ? "Оплата пакета" : "Начисление бонуса")}</td>
                                            <td className="px-[10px] leading-none text-xs font-normal text-black text-center">{new Date(Number(item.timestamp) * 1000).toDateString()}</td>
                                            <td className="px-[10px] leading-none text-xs font-normal text-black text-center pt-[12px] pb-[12px]">
                                            {item.status == 1 ?
                                            (
                                                <div>
                                                    <div className="inline-flex justify-center items-center border border-green-500 border-opacity-75 rounded px-[6px] py-[5px] ">
                                                        <div className="bg-green-500 w-[7px] h-[7px] rounded-full"></div>
                                                        <div className="ml-[6px] text-green-500 font-semibold text-xs leading-none">Paid</div>
                                                    </div>
                                                </div>
                                            )
                                            :
                                            (
                                                <div>
                                                    <div className="inline-flex justify-center items-center border border-red-500 border-opacity-75 rounded px-[6px] py-[5px] ">
                                                        <div className="bg-red-500 w-[7px] h-[7px] rounded-full"></div>
                                                        <div className="ml-[6px] text-red-500 font-semibold text-xs leading-none">Overdue</div>
                                                    </div>
                                                </div>
                                            )
                                            }</td>
                                            <td className="px-[10px] leading-none text-xs font-normal text-black text-center">{"$ " + item.summ.toFixed(2)}</td>
                                        </tr>
                                    }
                                    </>
                                ))}

                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="hidden mt-[23px]">
                        <div className="flex justify-center md:justify-start">
                            <div className="px-[2.5px] flex">
                                <a href="#"
                                className="cursor-not-allowed opacity-20 bg-white rounded-md border border-zinc-100 h-[26px] w-[26px] md:h-[32px] md:w-[32px] inline-flex justify-center items-center text-zinc-800 text-xs font-semibold">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M11.7267 12L12.6667 11.06L9.61332 8L12.6667 4.94L11.7267 4L7.72666 8L11.7267 12Z"
                                            fill="#333333"/>
                                        <path d="M7.33332 12L8.27332 11.06L5.21998 8L8.27331 4.94L7.33331 4L3.33332 8L7.33332 12Z"
                                            fill="#333333"/>
                                    </svg>
                                </a>
                            </div>
                            <div className="px-[2.5px] flex">
                                <a href="#"
                                className="cursor-not-allowed opacity-20 bg-white rounded-md border border-zinc-100 h-[26px] w-[26px] md:h-[32px] md:w-[32px] inline-flex justify-center items-center text-zinc-800 text-xs font-semibold">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M10.06 12L11 11.06L7.94667 8L11 4.94L10.06 4L6.06 8L10.06 12Z" fill="black"/>
                                    </svg>
                                </a>
                            </div>
                            <div className="px-[2.5px] flex">
                                <a href="#"
                                className="shadow-[0_15px_17px_-8px_rgba(64,4,236,0.3)] relative rounded-md border border-zinc-100 h-[26px] w-[26px] md:h-[32px] md:w-[32px] inline-flex justify-center items-center  text-[10px] md:text-xs font-semibold bg-gradient-to-t from-violet-600 to-purple-400 text-white">
                                    1
                                </a>
                            </div>
                            <div className="px-[2.5px] flex">
                                <a href="#"
                                className="hover:bg-gradient-to-t hover:from-violet-600 hover:to-purple-400 hover:text-white bg-white rounded-md border border-zinc-100 h-[26px] w-[26px] md:h-[32px] md:w-[32px] inline-flex justify-center items-center text-zinc-800 text-[10px] md:text-xs font-semibold">
                                    2
                                </a>
                            </div>
                            <div className="px-[2.5px] flex">
                                <a href="#"
                                className="hover:bg-gradient-to-t hover:from-violet-600 hover:to-purple-400 hover:text-white bg-white rounded-md border border-zinc-100 h-[26px] w-[26px] md:h-[32px] md:w-[32px] inline-flex justify-center items-center text-zinc-800 text-[10px] md:text-xs font-semibold">
                                    3
                                </a>
                            </div>
                            <div className="px-[10px] pt-[5px]">
                                ...
                            </div>
                            <div className="px-[2.5px] flex">
                                <a href="#"
                                className="hover:bg-gradient-to-t hover:from-violet-600 hover:to-purple-400 hover:text-white bg-white rounded-md border border-zinc-100 h-[26px] w-[26px] md:h-[32px] md:w-[32px] inline-flex justify-center items-center text-zinc-800 text-[10px] md:text-xs font-semibold">
                                    10
                                </a>
                            </div>
                            <div className="px-[2.5px] flex">
                                <a href="#"
                                className="hover:bg-gradient-to-t hover:from-violet-600 hover:to-purple-400 [&>svg>path]:hover:fill-white rounded-md border border-zinc-100 h-[26px] w-[26px] md:h-[32px] md:w-[32px] inline-flex justify-center items-center text-zinc-800 text-[10px] md:text-xs font-semibold">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M6.94002 4L6.00002 4.94L9.05335 8L6.00002 11.06L6.94002 12L10.94 8L6.94002 4Z"
                                            fill="black"/>
                                    </svg>
                                </a>
                            </div>
                            <div className="px-[2.5px] flex">
                                <a href="#"
                                className="hover:bg-gradient-to-t hover:from-violet-600 hover:to-purple-400 [&>svg>path]:hover:fill-white bg-white rounded-md border border-zinc-100 h-[26px] w-[26px] md:h-[32px] md:w-[32px] inline-flex justify-center items-center text-zinc-800 text-xs font-semibold">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"
                                        fill="currentColor">
                                        <path className=""
                                            d="M4.27333 4L3.33333 4.94L6.38667 8L3.33333 11.06L4.27333 12L8.27333 8L4.27333 4Z"/>
                                        <path d="M8.66667 4L7.72667 4.94L10.78 8L7.72667 11.06L8.66667 12L12.6667 8L8.66667 4Z"/>
                                    </svg>
                                </a>
                            </div>

                        </div>
                    </div>
                </div>

                <div className={`fixed top-0 left-0 w-full h-full bg-zinc-900 bg-opacity-50 transition-all duration-300 backdrop-blur-[10px] ${!openSort && "hidden"}`}></div>

                <div className={`rounded-bl-[15px] rounded-tl-[15px] fixed right-0 top-0 transition-all duration-300 w-[75%] md:w-[460px] h-full bg-white z-50  px-[20px] md:px-[30px] overflow-auto pb-[20px] ${!openSort && "hidden"}`}>
                    <button onClick={() => setOpenSort(false)} className="absolute top-[30px] right-[30px]">
                        <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <path d="M7.96789 6.37695L12.421 1.92383C12.6324 1.71286 12.7512 1.42657 12.7515 1.12795C12.7518 0.829324 12.6334 0.542827 12.4224 0.331483C12.2115 0.120138 11.9252 0.00125829 11.6265 0.000994563C11.3279 0.00073084 11.0414 0.119105 10.8301 0.330077L6.37695 4.7832L1.92383 0.330077C1.71248 0.118732 1.42584 0 1.12695 0C0.828066 0 0.541421 0.118732 0.330077 0.330077C0.118732 0.541421 0 0.828066 0 1.12695C0 1.42584 0.118732 1.71248 0.330077 1.92383L4.7832 6.37695L0.330077 10.8301C0.118732 11.0414 0 11.3281 0 11.627C0 11.9258 0.118732 12.2125 0.330077 12.4238C0.541421 12.6352 0.828066 12.7539 1.12695 12.7539C1.42584 12.7539 1.71248 12.6352 1.92383 12.4238L6.37695 7.9707L10.8301 12.4238C11.0414 12.6352 11.3281 12.7539 11.627 12.7539C11.9258 12.7539 12.2125 12.6352 12.4238 12.4238C12.6352 12.2125 12.7539 11.9258 12.7539 11.627C12.7539 11.3281 12.6352 11.0414 12.4238 10.8301L7.96789 6.37695Z" fill="#C7D4DD"/>
                        </svg>
                    </button>
                    <div className="text-zinc-900  text-base md:text-xl font-bold mt-[30px] md:mt-[50px]">
                        Настройка фильтра
                    </div>
                    <div className="mt-[20px] md:mt-[42px]">
                        <div>
                            <label>
                                <span className="text-slate-900 text-sm font-semibold">Направление</span>
                                <input type="text" placeholder="<vasiliyfox@dars.mail.com>" className="mt-[8px]  text-sm placeholder:text-indigo-950 placeholder:opacity-50   block w-full h-[40px] md:h-[50px] bg-white rounded-md px-[22px] border border-gray-200" />
                            </label>
                        </div>
                        <div className="mt-[23px]">
                            <label>
                                <span className="text-slate-900 text-sm font-semibold">Статус операции</span>
                                <input type="text" placeholder="Введите текст" className="mt-[8px]  text-sm placeholder:text-indigo-950 placeholder:opacity-50   block w-full h-[40px] md:h-[50px] bg-white rounded-md px-[22px] border border-gray-200 bg-[url('/inp-arrow.svg')] bg-no-repeat bg-[calc(100%-20px)]" />
                            </label>
                        </div>
                        <div className="mt-[23px]">
                            <label>
                                <span className="text-slate-900 text-sm font-semibold">Тип операции</span>
                                <input type="text" placeholder="Введите текст" className="mt-[8px]  text-sm placeholder:text-indigo-950 placeholder:opacity-50   block w-full h-[40px] md:h-[50px] bg-white rounded-md px-[22px] border border-gray-200 bg-[url('/inp-arrow.svg')] bg-no-repeat bg-[calc(100%-20px)]" />
                            </label>
                        </div>
                        <div className="mt-[23px]">
                            <label>
                                <span className="text-slate-900 text-sm font-semibold">Тип операции</span>
                                <input id="minmax-range" type="range" min="0" max="10" value="5" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" />
                            </label>
                        </div>
                        <div className="mt-[23px]">
                            <label>
                                <span className="text-slate-900 text-sm font-semibold">Дата открытия</span>
                                <input type="date" placeholder="Введите текст" className="appearance-none mt-[8px]  text-sm placeholder:text-indigo-950 placeholder:opacity-50   block w-full h-[40px] md:h-[50px] bg-white rounded-md px-[22px] border border-gray-200 bg-[url('/calendar.svg')] bg-no-repeat bg-[calc(100%-20px)]" />
                            </label>
                        </div>
                        <div className="mt-[23px]">
                            <label>
                                <span className="text-slate-900 text-sm font-semibold">Дата открытия</span>
                                <input type="date" placeholder="Введите текст" className="appearance-none mt-[8px]  text-sm placeholder:text-indigo-950 placeholder:opacity-50   block w-full h-[40px] md:h-[50px] bg-white rounded-md px-[22px] border border-gray-200 bg-[url('/calendar.svg')] bg-no-repeat bg-[calc(100%-20px)]" />
                            </label>
                        </div>
                    </div>
                    <div className="flex flex-wrap justify-between mt-[35px]">
                        <a href="#" className="w-[calc(50%-5px)] inline-flex items-center justify-center h-[46px] bg-gradient-to-t from-violet-600 to-purple-400 rounded-md shadow text-center text-white text-xs font-semibold tracking-tight">
                            Применить
                        </a>
                        <button onClick={() => setOpenSort(false)} className=" w-[calc(50%-5px)] inline-flex items-center justify-center h-[46px] rounded-md shadow border border-purple-500 text-purple-500 text-xs font-semibold tracking-tight">
                            Отменить
                        </button>
                    </div>
                </div>
                </>
                )
                :
                (<>
                    <Loading />
                </>)
            }
            {showModalWd &&
            <>
                <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[99999] outline-none focus:outline-none"
                >
                    <div className="relative w-3/4 mx-auto">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                            <div className="flex items-center justify-center p-5">
                                <h3 className="text-2xl text-black">
                                Вывод бонусов
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
                className="[--toastify-color-progress-light:#8532EE] z-[99999999]"
            />
        </>
    );
}