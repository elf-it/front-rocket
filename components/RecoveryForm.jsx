"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { sendCode, changePassword } from "@/lib/fetch"
import AuthNav from "./AuthNav"
import Image from "next/image"
import bigLogo from "../public/logos/bigLogo.svg"

export default function RecoveryForm() {

	const [userData, setUserData] = useState({email: "", password: "", confirmPassword: "", code: "", uid: ""})
	const [error, setError] =  useState("")
    const [success, setSuccess] = useState("")

    const [disbledChange, setDisabledChange] = useState(true)

	const router = useRouter()

	const handleSubmit = async () => {
		if(!userData.email){
            setError("Введите email")
            return
        }

        if(!userData.code){
            setError("Введите код активации")
            return
        }

        if(!userData.password){
            setError("Введите пароль")
            return
        }

        if(userData.password != userData.confirmPassword){
            setError("Пароли не совпадают")
            return
        }

        try {
            const response = await changePassword({
				key: process.env.AUTH_KEY,
				uid: userData.uid,
				code: userData.code,
				password: userData.password
			})

            if(response.error){
                setError(response.error)
                console.log("change failed")
            }else{
				setUserData({email: "", password: "", confirmPassword: "", code: "", uid: ""})
				setError("")
                setSuccess("")
                setDisabledChange(false)
                router.replace("signin")
			}
        } catch (error) {
            console.log("Error during change code: ", error)
        }
	}

	const handleCode = async () => {
		if(!userData.email){
            setError("Введите email")
            return
        }

        try {
            const response = await sendCode({
				key: process.env.AUTH_KEY,
				email: userData.email
			})

            if(response.error){
                setError(response.error)
                console.log("Send code failed")
            }else{
				setUserData(
                    Object.assign({}, userData, { uid: response.uid })
                )
				setError("")
                setSuccess("Введите код отправленный на email")
                setDisabledChange(false)
			}
        } catch (error) {
            console.log("Error during code code: ", error)
        }
	}

	useEffect(() => {
		
	}, [])

    return (
		<>
			<div className="relative flex w-full flex-row items-center justify-center min-h-screen overflow-hidden">
				<div className="flex w-full md:w-1/2 items-start justify-center flex-wrap min-h-screen bg-white">
					<AuthNav />
					<div className="mx-10 p-6 w-full lg:max-w-xl">
						<h1 className="text-3xl font-bold text-left text-black">Восстановление пароля</h1>
						<span className="hidden text-xs text-gray-500 mt-2">Please enter your contact details to connect.</span>
						{error && (
							<div className="text-red-500 w-fit text-sm py-1 mt-2">{error}</div>
						)}
                        {success && (
							<div className="text-green-500 w-fit text-sm py-1 mt-2">{success}</div>
						)}
						<form className="mt-6" onSubmit={(e) => {e.preventDefault()}}>
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
                                        setDisabledChange(true)
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
                            <div className="mt-6">
								<label
									htmlFor="password"
									className="block text-sm font-semibold text-black"
								>
									Повторите пароль
								</label>
								<input
									type="password"
									value={userData.confirmPassword}
									placeholder="введите пароль"
									onChange={event => {
										setUserData(
											Object.assign({}, userData, { confirmPassword: event.target.value })
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
									Активационный код
								</label>
								<input
									type="password"
									value={userData.code}
									placeholder="введите код"
									onChange={event => {
										setUserData(
											Object.assign({}, userData, { code: event.target.value })
										)
										setError("")
									}}
									className="block w-full px-4 py-2 mt-2 text-[#17103c] text-xs h-[50px] bg-white border border-[#e8e8e8] rounded-md focus:outline-none"
								/>
							</div>
							<div className="mt-4">
								<button
								disabled={!disbledChange}
                                onClick={handleCode}
								className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
								{!disbledChange ?
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
									Отправить активационный код
								</>
								}	
								</button>
							</div>
                            <div className="mt-4">
								<button
								disabled={disbledChange}
                                onClick={handleSubmit}
								className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
								Сменить пароль
								</button>
							</div>
						</form>
						<p className="mt-4 text-sm text-center text-gray-700">
							<Link
								href="/signin"
								className="font-medium text-[#7154fb] hover:underline"
							>
								Войти
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