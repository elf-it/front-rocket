"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCookie, setCookie } from 'cookies-next'
import { signIn } from "next-auth/react"
import { redirect } from "next/navigation"
import { registration, getLanguage, setPurpose, isLogin, isEmail } from "@/lib/fetch"
import AuthNav from "./AuthNav"
import Image from "next/image"
import bigLogo from "../public/logos/bigLogo.svg"
import What from "../public/what.svg"
import Ok from "../public/ok.svg"
import Loading from "./Loading"
import { FaTimes } from "react-icons/fa"

export default function SignupForm() {

	//const referrer = getCookie("referrer")
	//const refEmail = getCookie("ref_email")
	const EMAIL_REGEXP = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu

	const cyrillicPattern = /[\u0400-\u04FF]/g

	const [isReg, setIsReg] = useState(false)
	const [steps, setSteps] = useState(0)
	const [showModal, setShowModal] = useState(false)

	const [errorLogin, setErrorLogin] = useState("")
	const [errorEmail, setErrorEmail] = useState("")

	//if(!referrer || referrer == "") redirect("/")

	const isEmailValid = (value) => {
		return EMAIL_REGEXP.test(value)
	}

	const isValid = (value) => {
		return !cyrillicPattern.test(value)
	}

	const setText = (s) => {
		if(s == 0){
			return (<h1 className="text-3xl font-bold text-center text-black my-6">Привет, давай знакомиться!<br />Как тебя зовут?</h1>)
		}else if(s == 1){
			return (
				<>
				<h1 className="text-3xl font-bold text-center text-black my-6">{userData?.name}, теперь нужно придумать логин</h1>
				<span className="text-[14px] text-center text-black/50 block">Это будет твое имя на платформе. Не сдерживай себя, можешь выбрать любой логин (кроме повторяющегося 😉).</span>
				</>
			)
		}else if(s == 2){
			return (
			<>
			<h1 className="text-3xl font-bold text-center text-black my-6">Следующий шаг — укажи адрес<br />своей электронной почты</h1>
			<span className="text-[14px] text-center text-black/50 block">Это необходимо, чтобы в случае чего, ты смог легко вернуть доступ к аккаунту.</span>
			</>
			)
		}else if(s == 3){
			return (
			<>
			<h1 className="text-3xl font-bold text-center text-black my-6">Придумай пароль</h1>
			<span className="text-[14px] text-center text-black/50 block">Только не 123, иначе зловредные злоумышленники заберут все твои достижения себе. Если не получается, воспользуйся генератором паролей.</span>
			</>
			)
		}else if(s == 4){
			return (
				<>
				<h1 className="text-3xl font-bold text-center text-black my-6">А теперь самое главное —<br />тебе нужно поставить цель!</h1>
				<span className="text-[14px] text-center text-black/50 block">Хорошенько подумай, что сейчас самое важное для тебя.</span>
				</>
				)
		}
	}

	const [lang, setLang] = useState(null)

	const [language, setLanguage] = useState(null)

	const router = useRouter()

    const [userData, setUserData] = useState({name: "", login: "", email: "", password: "", confirmPassword: "", referrer: "", ref_email: "", purpose: ""})
	
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
		setIsReg(true)
        if(!userData.login || !userData.email || !userData.password || !userData.confirmPassword){
			setIsReg(false)
            setError(language?.requiredFieldsError || "")
            return
        }
        if(userData.password != userData.confirmPassword){
			setIsReg(false)
            setError(language?.passwordMismatchError || "")
            return
        }

        try {
            const response = await registration({
				key: process.env.AUTH_KEY,
				login: userData.login,
				email: userData.email,
				password: userData.password,
				referrer: userData.referrer,
				refEmail: userData.ref_email,
				language
			})

            if(response.error){
				setIsReg(false)
                setError(response.error)
                console.log(language?.registrationError || "")
            }else{
				const purposeResponse = await setPurpose({
					key: process.env.AUTH_KEY,
					uid: response?.uid,
					purpose: userData.purpose
				})
	
				if(purposeResponse.error){
					console.log("Purpose error: ", purposeResponse.error)
				}else{
					const res = await signIn("credentials", {
						email: userData.email,
						password: userData.password,
						address: "0",
						redirect: false
					})

					if(res.error){
						setIsReg(false)
						setError(language?.requiredFieldsError || "")
						return
					}

					setUserData({name: "", login: "", email: "", password: "", confirmPassword: "", purpose: ""})
					setError("")
					setStep(0)
					e.target.reset()
					setCookie("step", 0)
					setCookie("name", "")
					setCookie("login",  "")
					setCookie("email",  "")
					setCookie("referrer",  "")
					router.replace("/personal/mygame")
				}
			}
        } catch (error) {
			setIsReg(false)
            console.log("Error during registration signup: ", error)
        }
    }

	const setStep = (step) => {
		setCookie("step", step)
		setCookie("name", userData?.name || "")
		setCookie("login", userData?.login || "")
		setCookie("email", userData?.email || "")
		setSteps(step)
	}

	const getLang = async (langy) => {
		const l = await getLanguage({
			catId: "signup",
			lang: langy
		})
	}

	const isLoginn = async (login) => {
		const l = await isLogin({
			key: process.env.AUTH_KEY,
			login
		})

		if(l.error){
			console.log("error")
		}else{
			if(l.status == 1){
				setErrorLogin("Логин уже занят")
				setError("Логин уже занят")
			}else{
				if(isValid(login)){
					setStep(2)
				}else{
					setErrorLogin("Логин должен быть на латинице")
					setError("Логин должен быть на латинице")
				}
			}
		}
	}

	const isEmailn = async (email) => {
		const l = await isEmail({
			key: process.env.AUTH_KEY,
			email
		})

		if(l.error){
			console.log("error")
		}else{
			if(l.status == 1){
				setErrorEmail("Email уже занят")
				setError("Email уже занят")
			}else{
				if(isValid(email)){
					setStep(3)
				}else{
					setErrorLogin("Email должен быть на латинице")
					setError("Email должен быть на латинице")
				}
				
			}
		}
	}

	useEffect(() => {
		setSteps(getCookie("step") || 0)
		setUserData(
			Object.assign({}, userData, { name: getCookie("name") || "", login: getCookie("login") || "", email: getCookie("email") || "", ref_email: getCookie("ref_email") || "", referrer: getCookie("referrer") || "" })
		)
	}, [])

	useEffect(() => {
		if(lang != getCookie("lang")){
			setLang(getCookie("lang") || "ru")
			getLang(getCookie("lang") || "ru")
		}
	})

    return (
		<>
		{isReg ?
			<Loading />
		:
        <div className="relative flex w-full flex-row items-center justify-center min-h-screen overflow-hidden">
			<div className="flex w-full items-start justify-center flex-wrap min-h-screen bg-white">
				<AuthNav />
				<div className="md:mx-10 p-6 w-full lg:max-w-xl">
					<div className="w-full px-4 mb-20 flex items-start justify-center">
						<div className="flex flex-col items-center justify-center">
							{steps >= 1 ?
								<Image
									src={Ok}
									alt="ok"
									className="flex rounded-full w-10 h-10"
								/>
							:
								<div className="flex rounded-full p-4 w-10 h-10 border border-black/10 justify-center items-center">1</div>
							}
							<div className="flex text-black/30">Шаг 1</div>
						</div>
						<div className="flex flex-col items-center justify-center">
							<div className="flex py-4 justify-center items-center w-full"><div className="w-full h-px border border-b-black/10"></div></div>
							<div className="flex py-6 px-2 md:px-6 md:w-full"></div>
						</div>
						<div className="flex flex-col items-center justify-center">
							{steps >= 2 ?
								<Image
									src={Ok}
									alt="ok"
									className="flex rounded-full w-10 h-10"
								/>
							:
								<div className="flex rounded-full p-4 w-10 h-10 border border-black/10 justify-center items-center">2</div>
							}
							<div className="flex text-black/30">Шаг 2</div>
						</div>
						<div className="flex flex-col items-center justify-center">
							<div className="flex py-4 justify-center items-center w-full"><div className="w-full h-px border border-b-black/10"></div></div>
							<div className="flex py-6 px-2 md:px-6 md:w-full"></div>
						</div>
						<div className="flex flex-col items-center justify-center">
							{steps >= 3 ?
								<Image
									src={Ok}
									alt="ok"
									className="flex rounded-full w-10 h-10"
								/>
							:
								<div className="flex rounded-full p-4 w-10 h-10 border border-black/10 justify-center items-center">3</div>
							}
							<div className="flex text-black/30">Шаг 3</div>
						</div>
						<div className="flex flex-col items-center justify-center">
							<div className="flex py-4 justify-center items-center w-full"><div className="w-full h-px border border-b-black/10"></div></div>
							<div className="flex py-6 px-2 md:px-6 md:w-full"></div>
						</div>
						<div className="flex flex-col items-center justify-center">
							{steps >= 4 ?
								<Image
									src={Ok}
									alt="ok"
									className="flex rounded-full w-10 h-10"
								/>
							:
								<div className="flex rounded-full p-4 w-10 h-10 border border-black/10 justify-center items-center">4</div>
							}
							<div className="flex text-black/30">Шаг 4</div>
						</div>
						<div className="flex flex-col items-center justify-center">
							<div className="flex py-4 justify-center items-center w-full"><div className="w-full h-px border border-b-black/10"></div></div>
							<div className="flex py-6 px-2 md:px-6 md:w-full"></div>
						</div>
						<div className="flex flex-col items-center justify-center">
							{steps >= 5 ?
								<Image
									src={Ok}
									alt="ok"
									className="flex rounded-full w-10 h-10"
								/>
							:
								<div className="flex rounded-full p-4 w-10 h-10 border border-black/10 justify-center items-center">5</div>
							}
							<div className="flex text-black/30">Шаг 5</div>
						</div>
					</div>
					<div className="w-full flex text-center justify-center items-center text-black/50">
						Тебя приглашает {userData.ref_email}
					</div>
					{setText(steps)}
					{steps == 4 && <div className="flex items-center justify-center cursor-pointer" onClick={() => setShowModal(true)}><Image src={What} height={20} className="[&>svg>path]:fill-black/30" /><span className="text-sm text-black/30 py-4 px-2">Как ставить цель правильно</span></div>}
					{error && (
						<div className="text-red-500 w-fit text-sm py-1 mt-2">{error}</div>
					)}
					<form className="mt-6" onSubmit={handleSubmit}>
						{steps == 0 &&
						<>
							<div className="mt-4">
								<label
									htmlFor="Name"
									className="block text-sm font-semibold text-black"
								>
									{"Имя"}
								</label>
								<input
									type="text"
									value={userData.name}
									placeholder={"Введи имя"}
									onChange={event => {
										setUserData(
											Object.assign({}, userData, { name: event.target.value })
										)
										setError("")
									}}
									className="block w-full px-4 py-2 mt-2 text-[#17103c] text-xs h-[50px] bg-white border border-[#e8e8e8] rounded-md focus:outline-none"
								/>
							</div>
							<div className="mt-4">
								<button
								onClick={() => {
									if(userData.name != ""){
										setStep(1)
									}else{
										setError("Введите имя")
									}
								}}
								disabled={userData.name == ""}
								className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
								{language?.next || "Далее"}
								</button>
							</div>
						</>
						}
						{steps == 1 &&
						<>
							<div className="mt-4">
								<label
									htmlFor="login"
									className="block text-sm font-semibold text-black"
								>
									{language?.usernameLabel || "Логин"}
								</label>
								<input
									type="text"
									value={userData.login}
									placeholder={language?.loginPlaceholder || "Придумай логин"}
									onChange={event => {
										setUserData(
											Object.assign({}, userData, { login: event.target.value })
										)
										setError("")
									}}
									className="block w-full px-4 py-2 mt-2 text-[#17103c] text-xs h-[50px] bg-white border border-[#e8e8e8] rounded-md focus:outline-none"
								/>
							</div>
							<div className="mt-4 flex flex-row flex-nowrap">
								<button
									onClick={() => setStep(0)}
									className="flex flex-1 px-4 py-2  mr-4 tracking-wide text-black/50 transition-colors duration-200 transform rounded-md bg-[#EEEEEE] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
									{language?.next || "Назад"}
								</button>
								<button
								onClick={() => {
									if(userData.login != "" && userData.login.length >= 3){
										isLoginn(userData.login)
									}else{
										setError("Минимальная длина логина 3 символа")
									}
								}}
								disabled={userData.login == ""}
								className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
								{language?.next || "Далее"}
								</button>
							</div>
						</>
						}
						{steps == 2 &&
						<>
							<div className="mt-4">
								<label
									htmlFor="email"
									className="block text-sm font-semibold text-black"
								>
									{language?.emailLabel || "Email"}
								</label>
								<input
									type="email"
									placeholder={language?.emailPlaceholder || "Введи email"}
									value={userData.email}
									onChange={event => {
										setUserData(
											Object.assign({}, userData, { email: event.target.value })
										)
										setError("")
									}}
									className="block w-full px-4 py-2 mt-2 text-[#17103c] text-xs h-[50px] bg-white border border-[#e8e8e8] rounded-md focus:outline-none"
								/>
							</div>
							<div className="mt-4 flex flex-row flex-nowrap">
								<button
									onClick={() => setStep(1)}
									className="flex flex-1 px-4 py-2  mr-4 tracking-wide text-black/50 transition-colors duration-200 transform rounded-md bg-[#EEEEEE] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
									{language?.next || "Назад"}
								</button>
								<button
								onClick={() => {
									if(userData.email != "" && isEmailValid(userData.email)){
										isEmailn(userData.email)
									}else{
										setError("Введите корректный emai")
									}
								}}
								disabled={userData.email == ""}
								className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
								{language?.next || "Далее"}
								</button>
							</div>
						</>
						}
						{steps == 3 &&
						<>
							<div className="mt-4">
								<label
									htmlFor="password"
									className="block text-sm font-semibold text-black"
								>
									{language?.passwordLabel || "Пароль"}
								</label>
								<input
									type="password"
									placeholder={language?.passwordPlaceholder || "введи пароль"}
									value={userData.password}
									onChange={event => {
										setUserData(
											Object.assign({}, userData, { password: event.target.value })
										)
										setError("")
									}}
									className="block w-full px-4 py-2 mt-2 text-[#17103c] text-xs h-[50px] bg-white border border-[#e8e8e8] rounded-md focus:outline-none"
								/>
							</div>
							<div className="mt-4">
								<label
									htmlFor="confirmPassword"
									className="block text-sm font-semibold text-black"
								>
									{language?.repeatPasswordLabel || "Повтори пароль"}
								</label>
								<input
									type="password"
									placeholder={language?.repeatPasswordPlaceholder || "подтверди пароль"}
									value={userData.confirmPassword}
									onChange={event => {
										setUserData(
											Object.assign({}, userData, { confirmPassword: event.target.value })
										)
										setError("")
									}}
									className="block w-full px-4 py-2 mt-2 text-[#17103c] text-xs h-[50px] bg-white border border-[#e8e8e8] rounded-md focus:outline-none"
								/>
							</div>
							<div className="mt-4 flex flex-row flex-nowrap">
								<button
									onClick={() => setStep(2)}
									className="flex flex-1 px-4 py-2  mr-4 tracking-wide text-black/50 transition-colors duration-200 transform rounded-md bg-[#EEEEEE] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
									{language?.next || "Назад"}
								</button>
								<button
								onClick={() => {
									if(userData.confirmPassword == userData.password && userData.confirmPassword.length >= 8 && userData.password.length >= 8){
										setStep(4)
									}else{
										setError("Пароли не совпадают или меньше 8 символов")
									}
								}}
								disabled={userData.email == ""}
								className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
								{language?.next || "Далее"}
								</button>
							</div>
						</>
						}
						{steps == 4 &&
						<>
							<div className="mt-4">
								<label
									htmlFor="purpose"
									className="block text-sm font-semibold text-black"
								>
									{"Твоя цель"}
								</label>
								<textarea
									type="text"
									rows="5"
									value={userData.purpose}
									placeholder='Напиши свою цель'
									onChange={event => {
										setUserData(
											Object.assign({}, userData, { purpose: event.target.value })
										)
										setError("")
									}}
									className="block w-full px-4 py-2 mt-2 text-[#17103c] text-xs bg-white border border-[#e8e8e8] rounded-md focus:outline-none"
								></textarea>
							</div>
							<div className="mt-4 flex flex-row flex-nowrap">
								<button
									onClick={() => setStep(3)}
									className="flex flex-1 px-4 py-2  mr-4 tracking-wide text-black/50 transition-colors duration-200 transform rounded-md bg-[#EEEEEE] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
									{language?.next || "Назад"}
								</button>
								<button
								disabled={isReg || userData.purpose == ""}
								className="w-full px-4 flex py-2 tracking-wide justify-center items-center text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
								{isReg ?
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
										{language?.signUpBtn || "Зарегистрироваться"}
									</>
									}
								</button>
							</div>
						</>
						}
					</form>

					<p className="mt-4 text-sm text-center text-gray-700">
					{language?.doYouHaveAccount || ""}{" "}
						<Link
							href="/signin"
							className="font-medium text-[#7154fb] hover:underline"
						>
							{language?.loginInHere || ""}
						</Link>
					</p>
				</div>
			</div>
			{showModal &&
            <>
                <div
				className="justify-center items-start md:items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[99999] outline-none focus:outline-none"
				>
					<div className="absolute top-0 left-0 right-0 bottom-0" onClick={() => setShowModal(false)}></div>
					<div className="relative w-full max-h-full md:w-3/4 mx-auto">
						<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
							<div className="flex items-start md:items-center flex-col justify-center py-5 px-10">
								<div className="absolute top-5 right-5 w-5 h-5 flex justify-center items-center" onClick={() => setShowModal(false)}>
									<FaTimes className="cursor-pointer text-black" height={20} width={20} />
								</div>
								<h3 className="text-2xl text-black py-6">
								Как ставить цель правильно
								</h3>
								<div className="flex items-start flex-col justify-start">
									<p className="py-4">
									Правильно поставленная цель на 50% увеличивает шансы на ее достижение.
									</p>
									<p className="py-4">
									Цель должна соответствовать следующим критериям:
									</p>
									<p className="py-4">
									1. Конкретная. Уберите двусмысленность. Чтобы было понятно, чего нужно добиться в конечном итоге.
									</p>
									<p className="py-4">
									2. Измеримая. Добавьте числовой показатель, который конкретизирует вашу конечную цель. Например, вместо «Я хочу похудеть» — «Я хочу сбросить 3 кг за 2 недели».
									</p>
									<p className="py-4">
									3. Достижимая. Не питайте иллюзий, ставьте реальные цели и временные промежутки. Но не упрощайте до минимума, ведь мы хотим расти, а для этого надо преодолевать трудности и повышать свой уровень.
									</p>
									<p className="py-4">
									4. Значимая. Цель должна зажигать вас и быть желанной.
									</p>
									<p className="py-4">
									5. Ограничение по времени. Установите дедлайн — это поможет держать фокус и понимать, не выбиваетесь ли вы из графика. 
									</p>
									<p className="py-4">
									Примеры:<br />
									1. Похудеть на 5 кг к 20 декабря, чтобы чувствовать в себе уверенность и легкость.<br />
									2. Прочитать 2 книги за 30 дней, чтобы пополнить словарный запас.<br />
									</p>
								</div>
							</div>
							<div className='flex w-full mb-6 flex-row justify-center items-center'>
								<button
								onClick={() => setShowModal(false)}
								className="px-6 py-2 mr-4 text-white tracking-wide transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
									Закрыть
								</button>
							</div>
						</div>
					</div>
				</div>
                <div className="fixed inset-0 z-[1400] left-0 top-0 bottom-0 right-0 backdrop-blur-lg bg-gray-800/40"></div>
            </>
            }
			{/*<div className="hidden md:hidden min-h-screen bg-black bg-cover bg-left bg-no-repeat bg-[url('../public/auth_bg.svg')] md:flex justify-center items-center">
				<Image
					priority
					src={bigLogo}
					alt="Rocket"
					className="w-3/5"
				/>
			</div>*/}
		</div>
	}
	</>
    )
}