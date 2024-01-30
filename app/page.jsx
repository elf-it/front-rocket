"use client"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { setCookie, getCookie } from 'cookies-next'
import Video from "@/components/Video"
import VideoThumb from '@/public/dars.webp'
import { useEffect, useState } from "react"
import { getreferrer } from "@/lib/fetch"

import Image from "next/image"
import Rocket from "../public/main/Rocket.svg"
import Science from "../public/main/Science.svg"
import Logo from "../public/main/logo.svg"
import Round from "../public/main/round.svg"
import RightRocket from "../public/main/rightRocket.svg"
import bigLogoBlack from "../public/logos/bigLogo.svg"
import telegram from "../public/telegram.png"
import NewGameButton from "../public/newGameButton.svg"
import { FaTimes } from "react-icons/fa"

export default function Home() {

	const [ref, setRef] = useState("")
	const [refEmail, setRefEmail] = useState("")
	const [showModal, setShowModal] = useState(false)

	const searchParams = useSearchParams()

	useEffect(() => {
		const getReferrern = async () => {
			const referrer = searchParams.get('referrer') ? searchParams.get('referrer') : ""
			const cookieRef = getCookie('referrer')
			const cookieEmail = getCookie('ref_email')
			if(!cookieRef){
				if(ref == "" & refEmail == ""){
					const response = await getreferrer({
						key: process.env.AUTH_KEY,
						referrer
					})
	
					if(response.error){
						console.log(response.error)
					}else{
						setRef(referrer)
						setRefEmail(response.email)
						setCookie("referrer", referrer)
						setCookie("ref_email", response.login)
					}
				}
			}else{
				setRef(cookieRef)
				setRefEmail(cookieEmail)
			}
		}
		getReferrern()
	}, [])

	return (
		<main className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#030014]">
			<Image
				priority
				src={Round}
				alt="Rocket"
				className="h-[700px] w-[700px] absolute left-[50%] md:left-[80%] top-[40%] md:top-[50%]"
			/>
			<div>
				<Image
					priority
					src={RightRocket}
					alt="Rocket"
					className="h-[700px] w-[700px] absolute left-[50%] md:left-[80%] top-[50%] md:top-[60%]"
				/>
			</div>
			<div className="bg-auto min-h-screen w-full flex flex-col bg-[center_150%] md:bg-[center_400px] bg-no-repeat bg-[url('../public/main/main_bg1.svg')] md:px-[15%] px-6 justify-center items-center">
				<div className="flex justify-start pr-10">
					<Image
						priority
						src={Rocket}
						alt="Rocket"
						className="h-[70px] w-auto pr-4 md:h-[70px]"
					/>
					<div className="hidden w-full items-center md:pl-0 md:justify-start md:flex">
						<Video
							thumb={VideoThumb}
							thumbWidth={768}
							thumbHeight={432}
							thumbAlt="Modal video thumbnail"
							video="/RocketScience.mp4"
							videoWidth={1920}
							videoHeight={1080}
						/>
					</div>
				</div>
				<div className="items-start md:justify-start md:pl-10 flex">
					<Image
						priority
						src={Logo}
						alt="Rocket"
						className="h-[100px] w-auto md:h-[300px]"
					/>
					<div className="h-[100px] w-auto pr-4 md:h-[200px] relative top-[-10px]">
						<Image
							priority
							src={Science}
							alt="Rocket"
							className="h-[35px] w-auto md:h-[70px]"
						/>
						<span className="mt-5 flex text-white">международная игровая платформа по достижению целей</span>
						<div className="mt-5 hidden text-white md:flex">
							{ref != "" ?
								<Link href="/signup" className="px-4 py-2 rounded-lg [background:linear-gradient(180deg,_rgba(60,_8,_126,_0),_rgba(60,_8,_126,_0.32)),_rgba(113,_47,_255,_0.12)] shadow-[0px_0px_12.14px_rgba(191,_151,_255,_0.24)_inset] [backdrop-filter:blur(32px)] flex justify-center items-center overflow-hidden text-left text-[14px] text-ghostwhite font-raleway">
									<Image
										priority
										src={NewGameButton}
										alt="Rocket"
										className="h-[35px] w-auto pr-2"
									/>
									начать игру
								</Link>
							:
								<button onClick={() => setShowModal(true)} className="px-4 py-2 rounded-lg [background:linear-gradient(180deg,_rgba(60,_8,_126,_0),_rgba(60,_8,_126,_0.32)),_rgba(113,_47,_255,_0.12)] shadow-[0px_0px_12.14px_rgba(191,_151,_255,_0.24)_inset] [backdrop-filter:blur(32px)] flex justify-center items-center overflow-hidden text-left text-[14px] text-ghostwhite font-raleway">
									<Image
										priority
										src={NewGameButton}
										alt="Rocket"
										className="h-[35px] w-auto pr-2"
									/>
									начать игру
								</button>
							}
						</div>
					</div>
				</div>
				<div className="md:hidden w-full items-center justify-center mt-20 flex">
					<Video
						thumb={VideoThumb}
						thumbWidth={768}
						thumbHeight={432}
						thumbAlt="Modal video thumbnail"
						video="/RocketScience.mp4"
						videoWidth={1920}
						videoHeight={1080}
					/>
				</div>
				<div className=" mt-36 flex text-white md:hidden">
					{ref != "" ?
						<Link href="/signup" className="px-4 py-2 rounded-lg [background:linear-gradient(180deg,_rgba(60,_8,_126,_0),_rgba(60,_8,_126,_0.32)),_rgba(113,_47,_255,_0.12)] shadow-[0px_0px_12.14px_rgba(191,_151,_255,_0.24)_inset] [backdrop-filter:blur(32px)] flex justify-center items-center overflow-hidden text-left text-[14px] text-ghostwhite font-raleway">
							<Image
								priority
								src={NewGameButton}
								alt="Rocket"
								className="h-[35px] w-auto pr-2"
							/>
							начать игру
						</Link>
					:
						<button onClick={() => setShowModal(true)} className="px-4 py-2 rounded-lg [background:linear-gradient(180deg,_rgba(60,_8,_126,_0),_rgba(60,_8,_126,_0.32)),_rgba(113,_47,_255,_0.12)] shadow-[0px_0px_12.14px_rgba(191,_151,_255,_0.24)_inset] [backdrop-filter:blur(32px)] flex justify-center items-center overflow-hidden text-left text-[14px] text-ghostwhite font-raleway">
							<Image
								priority
								src={NewGameButton}
								alt="Rocket"
								className="h-[35px] w-auto pr-2"
							/>
							начать игру
						</button>
					}
				</div>
				{/*
				<div className="w-full md:text-2xl mt-80 md:mt-80 text-white">
					<div className="relative rounded-[32px] mb-4 text-white w-fit shadow-[0px_-7px_11px_rgba(164,_143,_255,_0.12)_inset] box-border overflow-hidden flex justify-start py-[5px] px-[15px] text-left text-xs font-inter border-[1px] border-solid border-[#4d2f8c]">
						О НАС
					</div>
					<span className="text-[#974af4] text-4xl">RocketScience - </span>международная игровая платформа по достижению целей через дисциплину
				</div>
				<div className="flex w-full flex-row justify-around flex-wrap">
					<div className="w-full md:w-1/2 mt-20 flex flex-col md:pr-6">
						<p className="text-5xl w-full opacity-[0.5] text-[#d9d9d9] mt-4">Идея</p>
						<p className="text-lg w-full text-white">Главная идея платформы, показать, что любые цели можно <b>достичь при помощи маленьких дисциплинированных шагов</b>. И для этого не надо быть суперменом. Важно делать правильные и системные действия.</p>
					</div>
					<div className="w-full md:w-1/2 mt-20 flex flex-col">
						<p className="text-5xl w-full opacity-[0.5] text-[#d9d9d9] mt-4">Миссия</p>
						<p className="text-lg w-full text-white">Миссия нашей компании заключается в том, чтобы <b>помочь людям в достижении успеха</b> в жизни через систематический и предсказуемый подход, основанный на дисциплине и упорстве.</p>
					</div>
				</div>
				<div className="w-full mt-20">
					<div className="relative rounded-[32px] mb-4 w-fit text-white shadow-[0px_-7px_11px_rgba(164,_143,_255,_0.12)_inset] box-border overflow-hidden flex justify-start py-[5px] px-[15px] text-left text-xs font-inter border-[1px] border-solid border-[#4d2f8c]">
						ПРОДУКТ
					</div>
					<p className="text-3xl w-full text-white">Наша платформа позволяет объединить людей со всего мира, которые имеют общую цель — <span className="text-[#974af4]">достижение успеха.</span></p>
				</div>
				<div className="hidden w-full flex-row mt-20">
					<div className='w-full mt-2 md:w-1/3 flex flex-row flex-wrap justify-around items-start'>
						<div className="items-start flex-1 mb-2 w-full md:mb-0 md:mx-2 flex justify-start overflow-hidden shrink-0 text-left text-[18px] text-b39 bg-white rounded-lg">
							<div className="shadow-lg p-4 h-full w-full flex flex-col justify-between items-start">
								<div className='mt-4'>
									<span>Проект Х — Твои мысли формируют реальность</span>
								</div>
								<div className='mt-4 text-xs'>
									<span>Каждый день с ПН-ПТ в 9.00 мск наши эксперты выходят в прямой эфир и помогают вам получить ответы на популярные вопросы.  Здесь ты получишь поддержку, мотвацию, прокачаешь мышление для достижения цели.</span>
								</div>
								<div className='mt-4'>
									<button
										className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
											Подключиться к эфиру
									</button>
									<Link
									href="/personal/sprints/1"
									className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-black transition-colors duration-200 transform rounded-md bg-purple-300 border-2 border-[#9040F2] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
										Подробнее
									</Link>
								</div>
							</div>
						</div>
					</div>
					<div className='w-full mt-2 md:w-1/3 flex flex-row flex-wrap justify-around items-start'>
						<div className="items-start flex-1 mb-2 w-full md:mb-0 md:mx-2 flex justify-start overflow-hidden shrink-0 text-left text-[18px] text-b39 bg-white rounded-lg">
							<div className="shadow-lg p-4 h-full w-full flex flex-col justify-between items-start">
								<div className='mt-4'>
									<span>Проект Х — Твои мысли формируют реальность</span>
								</div>
								<div className='mt-4 text-xs'>
									<span>Каждый день с ПН-ПТ в 9.00 мск наши эксперты выходят в прямой эфир и помогают вам получить ответы на популярные вопросы.  Здесь ты получишь поддержку, мотвацию, прокачаешь мышление для достижения цели.</span>
								</div>
								<div className='mt-4'>
									<button
										className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
											Подключиться к эфиру
									</button>
									<Link
									href="/personal/sprints/1"
									className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-black transition-colors duration-200 transform rounded-md bg-purple-300 border-2 border-[#9040F2] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
										Подробнее
									</Link>
								</div>
							</div>
						</div>
					</div>
					<div className='w-full mt-2 md:w-1/3 flex flex-row flex-wrap justify-around items-start'>
						<div className="items-start flex-1 mb-2 w-full md:mb-0 md:mx-2 flex justify-start overflow-hidden shrink-0 text-left text-[18px] text-b39 bg-white rounded-lg">
							<div className="shadow-lg p-4 h-full w-full flex flex-col justify-between items-start">
								<div className='mt-4'>
									<span>Проект Х — Твои мысли формируют реальность</span>
								</div>
								<div className='mt-4 text-xs'>
									<span>Каждый день с ПН-ПТ в 9.00 мск наши эксперты выходят в прямой эфир и помогают вам получить ответы на популярные вопросы.  Здесь ты получишь поддержку, мотвацию, прокачаешь мышление для достижения цели.</span>
								</div>
								<div className='mt-4'>
									<button
										className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
											Подключиться к эфиру
									</button>
									<Link
									href="/personal/sprints/1"
									className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-black transition-colors duration-200 transform rounded-md bg-purple-300 border-2 border-[#9040F2] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
										Подробнее
									</Link>
								</div>
							</div>
						</div>
					</div>
				</div>
				*/}
			</div>
			<div className="md:h-[123px] md:absolute bottom-0 left-0 right-0 bg-[#0a061d]">
				<div className="flex-col md:flex-row md:flex-nowrap w-full h-full flex pt-10 md:pt-0">
					<div className="flex w-full md:w-1/2 justify-center items-center md:justify-start md:items-center">
						<Image
                            priority
                            src={bigLogoBlack}
                            alt="Rocket"
                            className="h-[30px] md:h-[40.25px] w-auto"
                        />
					</div>
					<div className="flex flex-col md:flex-row md:flex-nowrap w-full md:w-1/2">
						<div className="flex flex-col w-full md:w-1/2 justify-center items-center md:items-start pt-10 md:pt-0">
							<p className="text-[12px] tracking-[0.01em] leading-[24px] font-raleway text-[#f4f0ff] text-left opacity-[0.4]">Служба поддержки</p>
							<p className="text-[12px] tracking-[0.01em] leading-[24px] font-medium font-raleway text-[#f4f0ff] text-left">support@rocketone.space</p>
						</div>
						<div className="flex flex-col w-full md:w-1/2 justify-center items-center md:items-start pt-10 md:pt-0">
						<p className="text-[12px] tracking-[0.01em] leading-[24px] font-raleway text-[#f4f0ff] text-left opacity-[0.4]">Наш телеграм канал:</p>
						<p className="text-[12px] tracking-[0.01em] leading-[24px] font-medium font-raleway text-[#f4f0ff] text-left">
							<Image
								priority
								src={telegram}
								alt="Rocket"
								className="inline overflow-hidden shrink-0 pr-2"
							/>
							@RocketScience
						</p>
						</div>
					</div>
				</div>
			</div>
			{/*
			<div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-24">
				<div className="flex justify-center">
					
					
					<video width={1920} height={1080} loop controls className="rounded-3xl">
					<source src={"/DARS.mp4"} type="video/mp4" />
					Your browser does not support the video tag.
					</video>
				</div>
			</div>
			
			<div className="hidden fixed z-[60] top-5 left-1/2 right-1/2 justify-center items-center">
				<>
				{ref != "" &&
					<Link href="/signup" className="px-4 py-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">Регистрация</Link>
				}
				</>
			</div>
			*/}
			{showModal &&
			<>
				<div
				className="justify-center items-start md:items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[99999] outline-none focus:outline-none"
				>
					<div className="absolute top-0 left-0 right-0 bottom-0" onClick={() => setShowModal(false)}></div>
					<div className="relative w-full md:w-2/4 mx-auto">
						<div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
							<div className="flex items-start md:items-center flex-col justify-center py-5 px-10">
								<div className="absolute top-5 right-5 w-5 h-5 flex justify-center items-center" onClick={() => setShowModal(false)}>
									<FaTimes className="cursor-pointer text-black" height={20} width={20} />
								</div>
								<h3 className="text-2xl text-black py-6">
								Вам нужна помощь!
								</h3>
								<div className="flex items-start flex-col justify-start">
									<p className="py-4">
									Сейчас регистрация для вас не доступна. Обратитесь к тому человеку, который вас пригласил.
									</p>
								</div>
							</div>
							<div className='flex w-full mb-6 flex-row justify-center items-start'>
								<button
								onClick={() => setShowModal(false)}
								className="px-6 py-2 mr-4 text-white tracking-wide transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
									Закрыть
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className="fixed inset-0 z-[99980] left-0 top-0 bottom-0 right-0 backdrop-blur-lg bg-gray-800/40"></div>
			</>
			}
		</main>
	)
}
