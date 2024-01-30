"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useWeb3Modal } from '@web3modal/react'
import { useAccount, useConnect } from 'wagmi'
import { useRouter } from "next/navigation"
import { signIn } from "next-auth/react"
import { getCookie } from 'cookies-next'
import AuthNav from "./AuthNav"
import Image from "next/image"
import bigLogo from "../public/logos/bigLogo.svg"
import { getAddress, getLanguage } from "@/lib/fetch"
import { ConnectKitButton } from 'connectkit'

export default function SigninForm() {

	//const { open, isConnecting, isOpen } = useWeb3Modal()
	const { connect, connectors, error: errorConnect, isLoading, pendingConnector } = useConnect()
    const { address, isConnected } = useAccount()
	
	const [isLogin, setIsLogin] = useState(false)

	const [userData, setUserData] = useState({email: "", password: ""})
	const [error, setError] =  useState("")

	const [lang, setLang] = useState(null)

	const [language, setLanguage] = useState(null)

	const router = useRouter()

	const getnAddressEmail = async (email) => {
        try {
            const response = await getAddress({
        key: process.env.AUTH_KEY,
        email
      })

            if(response.error){
				return ""
            }else{
              return response.address
      }
        } catch (error) {
            console.log("Error: ", error)
			return ""
        }
    }

	const handleSubmit = async (e) => {
		e.preventDefault()
		setIsLogin(true)

		if(!userData.email || !userData.password){
            setError("Заполните обязательные поля")
			setIsLogin(false)
            return
        }

		try {
			const res = await signIn("credentials", {
				email: userData.email,
				password: userData.password,
				address: "0",
				redirect: false
			})

			if(res.error){
				setError(res.error)
				setIsLogin(false)
				return
			}

			const address = await getnAddressEmail(userData.email)
			setUserData({email: "", password: ""})
			setError("")
			e.target.reset()
			if(address != ""){
				router.replace("/personal/mygame")
			}else{
				router.replace("addwallet")
			}

		} catch (error) {
			setIsLogin(false)
			console.log("Error during login: ", error)
		}
	}

	const getLang = async (langy) => {
		const l = await getLanguage({
			catId: "signup",
			lang: langy
		})

		setLanguage(l?.result)
	}

	const handleAddress = async () => {
		try {
			const res = await signIn("credentials", {
				email: "",
				password: "",
				address,
				redirect: false
			})

			if(res.error){
				setError("Ошибка авторизации")
			}else{
				setUserData({email: "", password: ""})
				setError("")
				router.replace("/personal/mygame")
			}
		} catch (error) {
			console.log("Error during registration: ", error)
		}
	}

	useEffect(() => {
		if(isConnected){
			handleAddress()
		}
		if(lang != getCookie("lang")){
			setLang(getCookie("lang") || "ru")
			getLang(getCookie("lang"))
		}
	})

    return (
		<>
			<div className="relative flex w-full flex-row items-center justify-center min-h-screen overflow-hidden">
				<div className="flex w-full md:w-1/2 items-start justify-center flex-wrap min-h-screen bg-white">
					<AuthNav />
					<div className="mx-10 p-6 w-full lg:max-w-xl">
						<h1 className="text-3xl font-bold text-left text-black">Авторизация</h1>
						<span className="hidden text-xs text-gray-500 mt-2">Please enter your contact details to connect.</span>
						{error && (
							<div className="text-red-500 w-fit text-sm py-1 mt-2">{error}</div>
						)}
						<form className="mt-6" onSubmit={handleSubmit}>
							<div className="mb-10">
								<label
									htmlFor="email"
									className="block text-sm font-semibold text-black"
								>
									Email
								</label>
								<input
									type="email"
									value={userData.email}
									placeholder="введите email адрес"
									onChange={event => {
										setUserData(
											Object.assign({}, userData, { email: event.target.value })
										)
										setError("")
									}}
									className="block w-full px-4 py-2 mt-2 text-[#17103c] text-xs h-[50px] bg-white border border-[#e8e8e8] rounded-md focus:outline-none"
								/>
							</div>
							<div className="mt-6">
								<label
									htmlFor="password"
									className="block text-sm font-semibold text-black"
								>
									Пароль
								</label>
								<input
									type="password"
									value={userData.password}
									placeholder="введите пароль"
									onChange={event => {
										setUserData(
											Object.assign({}, userData, { password: event.target.value })
										)
										setError("")
									}}
									className="block w-full px-4 py-2 mt-2 text-[#17103c] text-xs h-[50px] bg-white border border-[#e8e8e8] rounded-md focus:outline-none"
								/>
							</div>
							<div className="mt-4 w-full flex items-end justify-end">
								<Link
									href="/recovery"
									className="text-xs text-[#7154fb] hover:underline"
								>
									Забыли пароль?
								</Link>
							</div>
							<div className="mt-4">
								<button
								disabled={isLoading || isLogin}
								className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
								{isLoading || isLogin ?
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
									Войти
								</>
								}	
								</button>
							</div>
						</form>

						<div className="flex gap-x-2 mt-4">
						<ConnectKitButton.Custom>
                            {({ isConnected, isConnecting, show, hide, address, ensName, chain }) => {
                                return (
                                <button onClick={show} className="flex items-center justify-center w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-offset-1 focus:ring-violet-600">
                                    {isConnected ? address : "Войти с помощью кошелька"}
                                </button>
                                );
                            }}
                            </ConnectKitButton.Custom>
						</div>

						<p className="hidden mt-4 text-sm text-center text-gray-700">
							Don't have an account?{" "}
							<Link
								href="/signup"
								className="font-medium text-[#7154fb] hover:underline"
							>
								Sign up here
							</Link>
						</p>
					</div>
				</div>
				<div className="hidden md:w-1/2 min-h-screen bg-black bg-cover bg-left bg-no-repeat bg-[url('../public/auth_bg.svg')] md:flex justify-center items-center">
					<Image
						priority
						src={bigLogo}
						alt="Rocket"
						className="w-3/5"
					/>
				</div>
			</div>
		</>
    );
}