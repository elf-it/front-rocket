"use client"
import { useEffect, useState } from "react"
import { useWeb3Modal } from '@web3modal/react'
import { useAccount, useConnect, useNetwork, useSwitchNetwork, useDisconnect, useSignMessage } from 'wagmi'
import { ConnectKitButton } from 'connectkit'
import { useRouter } from "next/navigation"
import { setAddress } from "@/lib/fetch"
import Image from "next/image"
import bigLogo from "../public/logos/bigLogo.svg"
import { useSession } from "next-auth/react"
import Link from "next/link"
import contractData from "../contractData.json"

export default function AddAddress() {
    const [connected, setConnected] = useState(false)
    const [conn, setConn] = useState(null)
    const [addr, setAddr] = useState("")
	const [error, setError] =  useState("")
    const { open, isConnecting, isOpen } = useWeb3Modal()
    const { connect, connectors, error: errorConnect, isLoading: isLoadingC, pendingConnector, reset } = useConnect({
        onSuccess(data) {
            signMessage()
        }
    })
    const { address, isConnected } = useAccount()
    const { disconnect } = useDisconnect()

    const { chain } = useNetwork()
    const { chains, error: errorSwitch, isLoading, pendingChainId, switchNetwork } = useSwitchNetwork()

    const {data, update} = useSession()

    const router = useRouter()

    const { signMessage } = useSignMessage({
        message: 'Подтвердите подключение к Rocket Science данным адресом',
        onError(error) {
            console.log(error)
            disconnect()
        },
        onSuccess(data) {
            console.log(data)
        },
    })

    const nSetAddress = async (props) => {
        const response = await setAddress(props)

        if(response.error){
            setError(response.error)
            disconnect()
            console.log("User registration failed")
        }else{
            await update()
            router.replace("addedwallet")
        }
    }

    useEffect(() => {
        setConnected(isConnected)
        if(isConnected){
            setAddr(address)
        }else{
            setAddr("")
        }
    }, [isConnected, address])

    return (
        <div className="relative flex w-full flex-row items-center justify-center min-h-screen overflow-hidden bg-white">
			<div className="flex w-full md:w-1/2 flex-col pt-20 items-center justify-center min-h-screen bg-white">
                <div className="mx-10 p-6 w-2/4 lg:max-w-xl flex flex-row flex-nowrap justify-around items-center">
                    <div className="flex flex-col justify-center items-center">
                        <span className="[background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] rounded-full h-14 w-14 flex justify-center items-center text-bold text-white">1</span>
                        <span className="text-[#974af4] pt-2">Привязка</span>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <span className="border-2 border-[#974af4] rounded-full h-14 w-14 flex justify-center items-center text-bold text-[#974af4]">2</span>
                        <span className="text-[#974af4] opacity-[0.3] pt-2">Готово!</span>
                    </div>
                </div>
                <div className="mx-10 p-6 w-full lg:max-w-xl">
                    <h1 className="text-3xl font-bold text-center text-black">Привязать кошелек</h1>
                    <span className="hidden text-xs text-gray-500 mt-2">Please enter your contact details to connect.</span>
					{error && (
						<div className="text-red-500 w-fit text-sm py-1 mt-2">{error}</div>
					)}
                
                    <div className="text-red-500 w-fit text-sm py-1 mt-2">{errorSwitch && errorSwitch.message}</div>
                    {addr != "" &&
                    <div className="mt-6">
                        <label
                            htmlFor="address"
                            className="block text-sm font-semibold text-black"
                        >
                            Адрес, который будет связан с аккаунтом
                        </label>
                        {/*<input
                            type="text"
                            disabled
                            placeholder="подключите кошелек"
                            value={addr}
                            className="block w-full px-4 py-2 mt-2 text-[#17103c] text-xs h-[50px] bg-white border border-[#e8e8e8] rounded-md focus:outline-none"
                        />*/}
                    </div>
                    }
                    <div className="flex mt-4 gap-x-2">
                        {/*connectors.map((connector) => (
                            <button
                            key={connector.id}
                            onClick={() => {
                                disconnect()
                                reset()
                                connect({connector})
                            }}
                            className="flex items-center justify-center w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-offset-1 focus:ring-violet-600">
                                {isLoading || isConnecting ?
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
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 387.6 237.6"
                                        className="w-5 h-5 fill-current"
                                    >
                                        <path id="WalletConnect_00000073703063438220642730000002917717552236472496_" fill="#3B99FC" d="M79.4,46.4  c63.2-61.9,165.7-61.9,228.9,0l7.6,7.4c3.2,3.1,3.2,8.1,0,11.2l-26,25.5c-1.6,1.5-4.1,1.5-5.7,0l-10.5-10.3  c-44.1-43.2-115.6-43.2-159.7,0l-11.2,11c-1.6,1.5-4.1,1.5-5.7,0L71,65.8c-3.2-3.1-3.2-8.1,0-11.2L79.4,46.4z M362.1,99.1l23.2,22.7  c3.2,3.1,3.2,8.1,0,11.2L280.8,235.3c-3.2,3.1-8.3,3.1-11.4,0c0,0,0,0,0,0l-74.1-72.6c-0.8-0.8-2.1-0.8-2.9,0c0,0,0,0,0,0  l-74.1,72.6c-3.2,3.1-8.3,3.1-11.4,0c0,0,0,0,0,0L2.4,133c-3.2-3.1-3.2-8.1,0-11.2l23.2-22.7c3.2-3.1,8.3-3.1,11.4,0l74.1,72.6  c0.8,0.8,2.1,0.8,2.9,0c0,0,0,0,0,0l74.1-72.6c3.2-3.1,8.3-3.1,11.4,0c0,0,0,0,0,0l74.1,72.6c0.8,0.8,2.1,0.8,2.9,0l74.1-72.6  C353.8,96,358.9,96,362.1,99.1z"/>
                                    </svg>
                                    <p className="ml-4 text-sm text-center text-gray-700">
                                            {connector.name}
                                    </p>
                                </>
                                }
                            </button>
                            ))*/}
                            <ConnectKitButton.Custom>
                            {({ isConnected, isConnecting, show, hide, address, ensName, chain }) => {
                                return (
                                <>
                                {!isConnected ?
                                <button onClick={show} className="flex items-center justify-center w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-offset-1 focus:ring-violet-600">
                                     Подключить кошелек
                                </button>
                                :
                                <input
									type="text"
									value={address}
                                    onClick={show}
									placeholder=""
									className="flex items-center justify-center w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-offset-1 focus:ring-violet-600"
								/>
                                }
                                </>
                                );
                            }}
                            </ConnectKitButton.Custom>
                    </div>
                    <p className="mt-4 text-sm text-center text-gray-700">
						У меня нет кошелька{" "}
						<Link
							href={contractData.backend + "/pages/new-wallet-in-metamask"}
                            target="_blank"
							className="font-medium text-[#7154fb] hover:underline"
						>
							Инструкция
						</Link>
					</p>
                    {chains.map((x) => (
                        <>
                        {!switchNetwork || x.id === chain?.id ?
                            <div className="flex mt-4 gap-x-2">
                                <button
                                    key={x.id}
                                    onClick={() => nSetAddress({address, email: data?.user?.email})}
                                    className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]"
                                >
                                    Привязать кошелек
                                </button>
                            </div>
                            :
                            <div className="flex mt-4 gap-x-2">
                                <button
                                    disabled={!switchNetwork || x.id === chain?.id}
                                    key={x.id}
                                    onClick={() => switchNetwork?.(x.id)}
                                    className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]"
                                >
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
                            </div>
                        }
                        </>
                    ))}
                </div>
			</div>
		</div>
    )
}