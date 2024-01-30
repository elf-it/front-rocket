"use client"
import Calendar from "@/components/Calendar"
import { getPersonalData, activitybutton, setPurpose, sendMessage } from '@/lib/fetch'
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import Loading from "@/components/Loading"
import Link from "next/link"
import { FaTimes } from "react-icons/fa"
import { ToastContainer, toast } from 'react-toastify'
import Image from "next/image"
import Prize from "@/public/3D_Metal_Prize.svg"
import 'react-toastify/dist/ReactToastify.css'

export default function CompStatuses(){

    const {data, status, update} = useSession()

    const [personalData, setPersonalData] = useState(null)
    const [timer, setTimer] = useState({h: 0, m: 0, s: 0})
    const [textConfirm, setTextConfirm] = useState("i m ok")
    const [error, setError] = useState("")
    const [nextEnableButton, setNextEnableButton] = useState("")
    const [percentDays, setPercentDays] = useState({})
    const [percentDays2, setPercentDays2] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [showModalEdit, setShowModalEdit] = useState(false)
    const [showModalSuccess, setShowModalSuccess] = useState(false)
    const [showModalActive, setShowModalActive] = useState(false)
    const [showModalPurpose, setShowModalPurpose] = useState(false)

    const [selectedImage, setSelectedImage] = useState(null)
    const [selectedImageObj, setSelectedImageObj] = useState(null)

    const [purpose, setPurposer] = useState()

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
                setPurposer(response.purpose)
			}
        } catch (error) {
            console.log("Error: ", error)
        }
    }

    const handlePurpose = async () => {
        try {
            const purposeResponse = await setPurpose({
                key: process.env.AUTH_KEY,
                uid: data?.user?.uid,
                purpose: purpose
            })

            if(purposeResponse.error){
                console.log("Purpose error: ", purposeResponse.error)
            }else{
                getThPersonalData(data?.user?.uid)
                setShowModalEdit(false)
                toast("Цель изменена")
            }
        } catch (error) {
            console.log("Error during purpose: ", error)
        }
    }

    const levelsArr = [
        "",
        "#6BF754",
        "#ffe178",
        "#ffb178",
        "#ff7878",
        "#e963ff",
        "#9d61ff",
        "#62b4ff",
        "#ff248d",
        "#7d27ec"
    ]

    const levelsArrBg = [
        "",
        "bg-[#6BF754]",
        "bg-[#ffe178]",
        "bg-[#ffb178]",
        "bg-[#ff7878]",
        "bg-[#e963ff]",
        "bg-[#9d61ff]",
        "bg-[#62b4ff]",
        "bg-[#ff248d]",
        "bg-[#7d27ec]"
    ]

    const levelsArrBgOp = [
        "",
        "bg-[#6BF75455]",
        "bg-[#ffe17855]",
        "bg-[#ffb17855]",
        "bg-[#ff787855]",
        "bg-[#e963ff55]",
        "bg-[#9d61ff55]",
        "bg-[#62b4ff55]",
        "bg-[#ff248d55]",
        "bg-[#7d27ec55]"
    ]

    const levelsArrBorder = [
        "",
        "border-[#6BF754]",
        "border-[#ffe178]",
        "border-[#ffb178]",
        "border-[#ff7878]",
        "border-[#e963ff]",
        "border-[#9d61ff]",
        "border-[#62b4ff]",
        "border-[#ff248d]",
        "border-[#7d27ec]"
    ]

    function handleChange(e) {
        console.log(e.target.files)
        setSelectedImage(URL.createObjectURL(e.target.files[0]))
        setSelectedImageObj(e.target.files[0])
    }

    const handleSend = async () => {
        const sm = await sendMessage({
            photo: selectedImageObj,
            caption: data?.user?.email
        })

        if(sm.error){
            console.log("Confirmation error: ", sm.error)
        }
    }

    const handleActivity = async () => {
        //e.preventDefault()
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
                const sm = await sendMessage({
                    photo: selectedImageObj,
                    caption: data?.user?.email
                })
        
                if(sm.error){
                    console.log("Confirmation error: ", sm.error)
                }else{
                    getThPersonalData(data?.user?.uid)
                    handleSessionUpdate()
                    setShowModalSuccess(true)
                }
			}
        } catch (error) {
            console.log("Error during confirmation: ", error)
        }
    }

    const getTime = (ts) => {
        let timeEnable = ts * 1000 - Date.now()
        let hoursEnable = Math.floor((timeEnable / (1000 * 60 * 60)))
        let minutesEnable = Math.floor((timeEnable / 1000 / 60) % 60)
        let secondsEnable = Math.floor((timeEnable / 1000) % 60)
        if(secondsEnable <= 0){
            setNextEnableButton(0 + ':' + 0 + ':' + 0)
        }else{
            setNextEnableButton(hoursEnable + ':' + minutesEnable + ':' + secondsEnable)
        }

        let time = ts * 1000 - Date.now()
        let hours = Math.floor((time / (1000 * 60 * 60)))
        let minutes = Math.floor((time / 1000 / 60) % 60)
        let seconds = Math.floor((time / 1000) % 60)
        if(hours == 0 & minutes == 0 & seconds == 0){
            getThPersonalData()
        }
        setTimer({h: hours, m: minutes, s: seconds})
    }

    useEffect(() => {
        if(personalData == null){
            getThPersonalData(data?.user?.uid)
        }else{
            setPercentDays({left: `${ personalData?.days * 100 / personalData?.next_status }%`})
            setPercentDays2({width: `calc(${ personalData?.days * 100 / personalData?.next_status }% + 5px)`,
                fallbacks: [
                    { width: `-moz-calc(${ personalData?.days * 100 / personalData?.next_status }% + 5px)` },
                    { width: `-webkit-calc(${ personalData?.days * 100 / personalData?.next_status }% + 5px)` },
                    { width: `-o-calc(${ personalData?.days * 100 / personalData?.next_status }% + 5px)` }
            ]
            })
            if(personalData?.next_timestamp != 0){
                const interval = setInterval(() => getTime(personalData.next_timestamp), 1000)
                return () => clearInterval(interval)
            }
        }
    }, [data, personalData])

    return(
        <>
        {status != "loading" ? (
            <div className="w-full min-h-screen flex flex-col md:flex-row items-start justify-center">
                <div className="flex flex-wrap w-full md:w-2/3">
                    <div className="relative bg-white w-full overflow-hidden p-[20px] md:p-[30px] lg:p-[40px] rounded-[18px]">
                        <button className="absolute top-[14px] right-[14px] z-20" onClick={() => setShowModalEdit(true)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M19.667 4.96467C19.7541 5.09686 19.7929 5.25506 19.7769 5.41254C19.7608 5.57003 19.6909 5.71716 19.579 5.82909L11.1521 14.2551C11.0659 14.3412 10.9583 14.4029 10.8404 14.4338L7.33049 15.3505C7.21446 15.3808 7.09254 15.3802 6.97683 15.3487C6.86112 15.3173 6.75563 15.2562 6.67085 15.1714C6.58606 15.0866 6.52493 14.9811 6.49351 14.8654C6.46209 14.7497 6.46148 14.6278 6.49174 14.5118L7.4084 11.0028C7.43516 10.8974 7.48564 10.7996 7.55599 10.7168L16.0141 2.26417C16.143 2.13543 16.3177 2.06311 16.4999 2.06311C16.6821 2.06311 16.8568 2.13543 16.9857 2.26417L19.579 4.85651C19.6119 4.88951 19.6414 4.92575 19.667 4.96467ZM18.1206 5.34234L16.4999 3.72259L8.69174 11.5308L8.11882 13.7243L10.3124 13.1514L18.1206 5.34234Z" fill="#7D27EC"/>
                                <path d="M18.0043 15.73C18.2549 13.5886 18.3349 11.4307 18.2436 9.27666C18.2416 9.22592 18.2501 9.1753 18.2686 9.12799C18.287 9.08067 18.315 9.03767 18.3508 9.00166L19.2528 8.09966C19.2775 8.07488 19.3088 8.05773 19.3429 8.0503C19.3771 8.04286 19.4127 8.04544 19.4454 8.05774C19.4781 8.07003 19.5066 8.09152 19.5274 8.11961C19.5482 8.1477 19.5604 8.1812 19.5627 8.21608C19.7324 10.7747 19.668 13.3435 19.3702 15.8904C19.1538 17.7439 17.6652 19.1968 15.8199 19.4031C12.6165 19.7578 9.38369 19.7578 6.18026 19.4031C4.33593 19.1968 2.84634 17.7439 2.63001 15.8904C2.24996 12.6412 2.24996 9.35878 2.63001 6.10958C2.84634 4.25608 4.33501 2.80316 6.18026 2.59691C8.6116 2.32731 11.0613 2.26199 13.5035 2.40166C13.5385 2.40417 13.572 2.41665 13.6 2.43761C13.6281 2.45857 13.6496 2.48714 13.662 2.51993C13.6743 2.55273 13.677 2.58837 13.6697 2.62265C13.6624 2.65693 13.6455 2.68839 13.6208 2.71333L12.7106 3.62266C12.6749 3.65818 12.6324 3.68603 12.5856 3.70447C12.5387 3.72292 12.4886 3.73158 12.4383 3.72991C10.4004 3.66064 8.36005 3.73876 6.33334 3.96366C5.74112 4.02921 5.18829 4.29249 4.76415 4.71098C4.34001 5.12946 4.06933 5.67871 3.99584 6.27C3.6283 9.41262 3.6283 12.5874 3.99584 15.73C4.06933 16.3213 4.34001 16.8705 4.76415 17.289C5.18829 17.7075 5.74112 17.9708 6.33334 18.0363C9.40876 18.3801 12.5914 18.3801 15.6678 18.0363C16.26 17.9708 16.8128 17.7075 17.2369 17.289C17.6611 16.8705 17.9308 16.3213 18.0043 15.73Z" fill="#7D27EC"/>
                            </svg>
                        </button>
                        <picture>
                        <img src="/darts.png" alt="" className="rotate-[230deg] md:rotate-[unset] absolute bottom-[-100px] md:bottom-[-90px] left-[unset] md:left-[-110px] lg:left-[-130px] right-[-165px] md:right-[unset] z-10 max-h-[350px] md:max-h-[260px] lg:max-h-[369px] " />
                        </picture>
                        <div className="absolute left-[unset] md:left-0 right-0 md:right-[auto] rotate-180 md:rotate-[unset] bottom-0 h-full">
                            <svg xmlns="http://www.w3.org/2000/svg" width="340" height="216" viewBox="0 0 340 216" fill="none" className="h-full">
                                <g filter="url(#filter0_f_2039_2164)">
                                    <ellipse cx="-3.5" cy="153" rx="123.5" ry="105" fill="#AA62FA"/>
                                </g>
                                <defs>
                                    <filter id="filter0_f_2039_2164" x="-347" y="-172" width="687" height="650" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                                        <feGaussianBlur stdDeviation="110" result="effect1_foregroundBlur_2039_2164"/>
                                    </filter>
                                </defs>
                            </svg>
                        </div>
                        <div className="relative z-10 md:pl-[100px] lg:pl-[200px]">
                            <div className="text-gray-500 text-xs font-normal">Моя цель</div>
                            <div className="text-violet-600 text-lg max-w-[210px] md:max-w-none md:text-[18px] lg:text-[22px] font-bold leading-[1.3] mt-[12px]">{personalData?.purpose || ""}</div>
                            <button className="inline-flex items-center mt-[80px] md:mt-[22px] lg:mt-[42px]"  onClick={() => setShowModal(true)}>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5ZM9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18Z" fill="#A9A9A9"/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M6.25 6.88034C6.25 5.32313 7.68116 4.25 9.19446 4.25H9.29712C9.61913 4.25 9.94005 4.30684 10.2407 4.41925C11.0141 4.70841 11.5523 5.31654 11.7061 6.04346C11.8616 6.77858 11.6033 7.54974 10.9616 8.08289L10.3049 8.62852C10.0092 8.87424 9.87192 9.18403 9.87192 9.47627V10C9.87192 10.4142 9.53613 10.75 9.12192 10.75C8.70771 10.75 8.37192 10.4142 8.37192 10V9.47627C8.37192 8.69475 8.7424 7.97659 9.34631 7.47481L10.003 6.92918C10.2306 6.74006 10.2751 6.52655 10.2385 6.35384C10.2003 6.17292 10.0518 5.95005 9.71535 5.82425C9.58646 5.77606 9.44377 5.75 9.29712 5.75H9.19446C8.28382 5.75 7.75 6.36058 7.75 6.88034V6.98347C7.75 7.39768 7.41421 7.73347 7 7.73347C6.58579 7.73347 6.25 7.39768 6.25 6.98347V6.88034Z" fill="#A9A9A9"/>
                                    <path d="M8 12C8 11.4477 8.44772 11 9 11C9.55228 11 10 11.4477 10 12C10 12.5523 9.55228 13 9 13C8.44772 13 8 12.5523 8 12Z" fill="#A9A9A9"/>
                                    </svg>
                                </span>
                                <span className="text-gray-500 text-xs font-normal ml-[5px] cursor-pointer">
                                    Как ставить цель правильно
                                </span>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-wrap mt-[20px] w-full bg-white rounded-[18px]">
                        <div className="p-[20px] relative z-30 bg-white pb-[80px] flex flex-wrap w-full md:w-full lg:w-[60%] bg-gradient-to-t from-violet-600 to-purple-400 rounded-[18px] overflow-hidden">
                            <picture>
                            <img src="/cup.png" alt="" className="absolute bottom-[-85px] lg:bottom-[-68px] right-[-100px] max-h-[280px] md:max-h-[286px] lg:max-h-[256px]" />
                            </picture>
                            <div className="text-white font-semibold leading-[1.3] w-full text-sm">
                                Не забывай каждый день<br />
                                отчитываться по цели
                            </div>
                            {/*personalData?.status == 1 ?
                            <>
                            <div className="text-white text-xs font-normal mt-[16px] w-full">
                                Времени осталось:
                            </div>
                            <div className="mt-[10px] text-[30px] w-full text-white pr-[100px]">
                                <div className="flex flex-row text-center w-full items-start justify-around">
                                    <div className="flex flex-col items-center p-1 text-lg">
                                        <span className="countdown text-3xl">
                                        <span style={{"--value":timer.h}}></span>
                                        </span>
                                        часов
                                    </div>
                                    <span className="text-2xl">:</span>
                                    <div className="flex flex-col items-center p-1 text-lg">
                                        <span className="countdown text-3xl">
                                        <span style={{"--value":timer.m}}></span>
                                        </span>
                                        минут
                                    </div>
                                    <span className="text-2xl">:</span>
                                    <div className="flex flex-col items-center p-1 text-lg">
                                        <span className="countdown text-3xl">
                                        <span style={{"--value":timer.s}}></span>
                                        </span>
                                        секунд
                                    </div>
                                </div>
                            </div>
                            </>
                            :
                            <div className="text-white text-xs h-24 font-normal mt-[16px] w-full">
                            </div>
        */}
                            <div className="absolute bottom-[20px] z-20">
                            {error == "" && personalData?.blocked_button == 0 ?
                                <button disabled={error == "" ? false : true} onClick={() => setShowModalPurpose(true)} className="transition-opacity hover:opacity-90 h-[45px] bg-white rounded-md shadow px-[20px] inline-flex justify-center items-center text-center text-purple-500 text-xs font-semibold">
                                    Сдать отчет за день
                                </button>
                            :
                                <button className="transition-opacity hover:opacity-90 h-[45px] bg-white rounded-md shadow px-[20px] inline-flex justify-center items-center text-center text-purple-500 text-xs font-semibold" onClick={() => setShowModalActive(true)}>Сдать отчет за день</button>
                            }
                            </div>
                        </div>

                        <div className="w-full md:w-auto justify-center md:justify-start p-[20px] md:p-[20px] md:pb-[90px] rounded-r-[18px] rounded-b-[18px] lg:p-[20px] md:pl-[20px] lg:pl-[30px] flex flex-wrap lg:w-[40%] bg-white relative overflow-hidden">
                            {personalData?.status == 1 ?
                            <>
                            <div className="text-black text-xs text-center font-normal mt-[16px] w-full">
                                Времени осталось:
                            </div>
                            <div className="mt-[10px] text-[30px] w-full text-black">
                                <div className="flex flex-row text-center w-full items-start justify-around">
                                    <div className="flex flex-col items-center p-1 text-sm">
                                        <span className="countdown text-2xl">
                                        <span style={{"--value":timer.h}}></span>
                                        </span>
                                        часов
                                    </div>
                                    <span className="text-2xl">:</span>
                                    <div className="flex flex-col items-center p-1 text-sm">
                                        <span className="countdown text-2xl">
                                        <span style={{"--value":timer.m}}></span>
                                        </span>
                                        минут
                                    </div>
                                    <span className="text-2xl">:</span>
                                    <div className="flex flex-col items-center p-1 text-sm">
                                        <span className="countdown text-2xl">
                                        <span style={{"--value":timer.s}}></span>
                                        </span>
                                        секунд
                                    </div>
                                </div>
                            </div>
                            </>
                            :
                            <>
                            <div className="w-full text-center text-zinc-900 font-semibold leading-[1.3] text-xs">
                            {personalData?.status == 0 ? "Необходимо активировать кабинет, чтобы сдавать отчет и прокачивать своего персонажа." : "Ты уже в игре. Добавить жизни можно в разделе тарифы."}
                            </div>
                            {/*<img src="/crown.png" alt="" className="hidden md:block absolute bottom-[-10px] right-[-40px] md:max-h-[156px] lg:max-h-[186px] z-10" />
                            <svg className="hidden md:block absolute bottom-0 right-0 h-full" xmlns="http://www.w3.org/2000/svg" width="408" height="216" viewBox="0 0 408 216" fill="none">
                                <g filter="url(#filter0_f_2366_404)">
                                    <ellipse cx="307.5" cy="204.053" rx="110.5" ry="93.9474" fill="#AA62FA"/>
                                </g>
                                <defs>
                                    <filter id="filter0_f_2366_404" x="0.157898" y="-86.7368" width="614.684" height="581.579" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                        <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                        <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                                        <feGaussianBlur stdDeviation="98.4211" result="effect1_foregroundBlur_2366_404"/>
                                    </filter>
                                </defs>
                            </svg>*/}
                            <Link href="/personal/mygame/rates" className="hover:opacity-90 bottom-[20px] h-[45px] inline-flex items-center w-full justify-center text-violet-600 font-semibold">
                                Выбрать тариф
                            </Link>
                            </>
                            }
                        </div>
                    </div>

                    <div className="relative bg-white rounded-[18px] p-[20px] md:p-[30px] mt-[20px] w-full overflow-hidden">
                        <Link href="/personal/mygame/statuses" className="absolute z-40 top-[20px] right-[20px] md:top-[17px] md:right-[17px]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5ZM9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18Z" fill="#B5B5B5"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M6.25 6.88034C6.25 5.32313 7.68116 4.25 9.19446 4.25H9.29712C9.61913 4.25 9.94005 4.30684 10.2407 4.41925C11.0141 4.70841 11.5523 5.31654 11.7061 6.04346C11.8616 6.77858 11.6033 7.54974 10.9616 8.08289L10.3049 8.62852C10.0092 8.87424 9.87192 9.18403 9.87192 9.47627V10C9.87192 10.4142 9.53613 10.75 9.12192 10.75C8.70771 10.75 8.37192 10.4142 8.37192 10V9.47627C8.37192 8.69475 8.7424 7.97659 9.34631 7.47481L10.003 6.92918C10.2306 6.74006 10.2751 6.52655 10.2385 6.35384C10.2003 6.17292 10.0518 5.95005 9.71535 5.82425C9.58646 5.77606 9.44377 5.75 9.29712 5.75H9.19446C8.28382 5.75 7.75 6.36058 7.75 6.88034V6.98347C7.75 7.39768 7.41421 7.73347 7 7.73347C6.58579 7.73347 6.25 7.39768 6.25 6.98347V6.88034Z" fill="#B5B5B5"/>
                                <path d="M8 12C8 11.4477 8.44772 11 9 11C9.55228 11 10 11.4477 10 12C10 12.5523 9.55228 13 9 13C8.44772 13 8 12.5523 8 12Z" fill="#B5B5B5"/>
                            </svg>
                        </Link>
                        <picture>
                        <img src="/energyHelper.png" alt="" className="max-h-[166px] absolute bottom-0 left-[unset] md:left-0 right-[-30px] md:right-[unset] z-20" />
                        </picture>
                        <svg className="absolute block bottom-0 left-[unset] md:left-0 right-[-60px] md:right-[unset]  rotate-[270deg] md:rotate-[unset] h-full" xmlns="http://www.w3.org/2000/svg" width="340" height="216" viewBox="0 0 340 216" fill="none">
                            <g filter="url(#filter0_f_2039_2210)">
                                <ellipse cx="83.5" cy="208.5" rx="97.5" ry="75.5" fill={`${levelsArr[personalData?.level]}`}/>
                            </g>
                            <defs>
                                <filter id="filter0_f_2039_2210" x="-173" y="-26" width="513" height="469" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                                    <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
                                    <feGaussianBlur stdDeviation="79.5" result="effect1_foregroundBlur_2039_2210"/>
                                </filter>
                            </defs>
                        </svg>
                        <div className="md:pl-[182px] max-w-[calc(100%-110px)] md:max-w-none">
                            <div className="flex items-center">
                                <span className="text-gray-500 text-xs font-normal">Мой статус</span>
                                <span className="ml-[10px]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="21" viewBox="0 0 18 21" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M7.86661 1.10876C8.22334 0.010857 9.77657 0.010874 10.1333 1.10876L11.5361 5.42602H16.0755C17.2299 5.42602 17.7099 6.90323 16.7759 7.58176L13.1035 10.25L14.5062 14.5672C14.8629 15.6651 13.6064 16.5781 12.6724 15.8996L8.99996 13.2313L5.32748 15.8996C4.39355 16.5781 3.13697 15.6651 3.49369 14.5672L4.89645 10.25L1.22398 7.58176C0.290045 6.90322 0.770032 5.42602 1.92442 5.42602H6.46385L7.86661 1.10876ZM8.99996 2.8793L7.91203 6.2276C7.7525 6.71859 7.29495 7.05102 6.77869 7.05102H3.25808L6.10631 9.12038C6.52398 9.42383 6.69874 9.96171 6.53921 10.4527L5.45128 13.801L8.29951 11.7316C8.71718 11.4282 9.28274 11.4282 9.7004 11.7316L12.5486 13.801L11.4607 10.4527C11.3012 9.96171 11.4759 9.42383 11.8936 9.12038L14.7418 7.05102H11.2212C10.705 7.05102 10.2474 6.71859 10.0879 6.2276L8.99996 2.8793Z" fill={`${levelsArr[personalData?.level]}`}/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.72319 19.4782C5.2747 19.4634 4.92314 19.0878 4.93795 18.6393L4.97371 17.5566C4.98853 17.1081 5.3641 16.7565 5.81259 16.7713C6.26108 16.7861 6.61264 17.1617 6.59783 17.6102L6.56207 18.693C6.54726 19.1414 6.17168 19.493 5.72319 19.4782Z" fill={`${levelsArr[personalData?.level]}`}/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M12.2195 19.6927C11.771 19.6779 11.4195 19.3023 11.4343 18.8538L11.4701 17.7711C11.4849 17.3226 11.8604 16.971 12.3089 16.9858C12.7574 17.0006 13.109 17.3762 13.0942 17.8247L13.0584 18.9075C13.0436 19.3559 12.668 19.7075 12.2195 19.6927Z" fill={`${levelsArr[personalData?.level]}`}/>
                                    <path fillRule="evenodd" clipRule="evenodd" d="M8.93559 20.6682C8.48711 20.6534 8.13554 20.2779 8.15036 19.8294L8.22188 17.6639C8.23669 17.2154 8.61227 16.8638 9.06075 16.8786C9.50924 16.8935 9.8608 17.269 9.84599 17.7175L9.77447 19.883C9.75966 20.3315 9.38408 20.6831 8.93559 20.6682Z" fill={`${levelsArr[personalData?.level]}`}/>
                                    </svg>
                                </span>
                            </div>
                            <div className="text-zinc-900 text-[22px] font-semibold mt-[12px]">{personalData?.level_name || ""}</div>
                            <div className="text-gray-500 text-xs font-normal mt-[10px]">
                                Прокачай своего персонажа при помощи своей дисциплины.
                            </div>
                            <div className={`relative h-1  ${levelsArrBgOp[personalData?.level]} rounded-md mt-[38px]`}>
                                <div className={`w-3.5 h-3.5 bg-white rounded-full border-2 ${levelsArrBorder[personalData?.level]} absolute top-[50%] translate-y-[-50%] z-30`} style={percentDays}>
                                    <span className="absolute top-[-20px] left-0 w-full text-center text-zinc-900 text-xs font-bold">{personalData?.days - personalData?.prev_status}</span>
                                </div>
                                <div className={`absolute top-0 left-0 h-full ${levelsArrBg[personalData?.level]} rounded-md`} style={percentDays2}></div>
                            </div>
                            <div className="mt-[20px] text-gray-500 text-xs font-normal">До следующего статуса осталось  {personalData?.next_status - personalData?.days}  дней</div>
                        </div>
                    </div>
                </div>
                <div className="flex w-full md:w-1/3 my-6 md:my-0 md:pl-6">
                    <Calendar data={personalData} />
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
                    <div className="fixed inset-0 z-[99980] left-0 top-0 bottom-0 right-0 backdrop-blur-lg bg-gray-800/40"></div>
                </>
                }
                {showModalEdit &&
                <>
                    <div
                    className="justify-center items-start md:items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[99999] outline-none focus:outline-none"
                    >
                        <div className="absolute top-0 left-0 right-0 bottom-0" onClick={() => setShowModalEdit(false)}></div>
                        <div className="relative w-full md:w-2/4 m-auto">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <div className="flex items-start md:items-center flex-col justify-center py-5 px-10">
                                    <label
                                        htmlFor="purpose"
                                        className="block text-sm font-semibold text-black"
                                    >
                                        {"Твоя цель"}
                                    </label>
                                    <textarea
                                        type="text"
                                        rows="5"
                                        value={purpose}
                                        placeholder='Напиши свою цель'
                                        onChange={event => {
                                            setPurposer(event.target.value)
                                        }}
                                        className="block w-full px-4 py-2 mt-2 text-[#17103c] text-xs bg-white border border-[#e8e8e8] rounded-md focus:outline-none"
                                    ></textarea>
                                </div>
                                <div className='flex w-full mb-6 flex-row justify-center items-center'>
                                    <button
                                    disabled={purpose == ""}
                                    onClick={handlePurpose}
                                    className="px-4 py-2 mr-4 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
                                    Подтвердить
                                    </button>

                                    <button
                                    disabled={purpose == ""}
                                    onClick={() => setShowModalEdit(false)}
                                    className="px-6 py-2 text-white tracking-wide transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
                                        Закрыть
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fixed inset-0 z-[99980] left-0 top-0 bottom-0 right-0 backdrop-blur-lg bg-gray-800/40"></div>
                </>
                }
                {showModalActive &&
                <>
                    <div
                    className="justify-center items-start md:items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[99999] outline-none focus:outline-none"
                    >
                        <div className="absolute top-0 left-0 right-0 bottom-0" onClick={() => setShowModalActive(false)}></div>
                        <div className="relative z-[999998] w-full md:w-2/4 m-auto">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                <div className="absolute z-[999999] top-5 right-5 w-5 h-5 flex justify-center items-center" onClick={() => setShowModal(false)}>
                                    <FaTimes className="cursor-pointer text-black" height={20} width={20} />
                                </div>
                                <div className="flex items-center flex-col justify-center py-5 px-10">
                                    {personalData?.status == 1 ?
                                    <span>Сегодня ты уже сдал отчет</span>
                                    :
                                    <Link href="/personal/mygame/rates">Выбери тариф для начала игры. <span className=" text-blue-700 cursor-pointer">Перейти в тарифы</span></Link>
                                    }
                                </div>
                                <div className='flex w-full mb-6 flex-row justify-center items-center'>
                                    <button
                                    disabled={purpose == ""}
                                    onClick={() => setShowModalActive(false)}
                                    className="px-6 py-2 text-white tracking-wide transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
                                        Закрыть
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fixed inset-0 z-[99980] left-0 top-0 bottom-0 right-0 backdrop-blur-lg bg-gray-800/40"></div>
                </>
                }
                {showModalSuccess &&
                <>
                    <div
                    className="justify-center items-start md:items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[99999] outline-none focus:outline-none"
                    >
                        <div className="absolute top-0 left-0 right-0 bottom-0" onClick={() => setShowModalSuccess(false)}></div>
                        <div className="relative w-full h-[290px] md:w-1/3 m-auto">
                            <Image
                                priority
                                src={Prize}
                                alt="Rocket"
                                height={200}
                                className="relative top-[-110px] rounded-[402.63px] w-[201.52px] h-[201.52px] object-cover m-auto z-[555]"
                            />
                            <div className="border-0 h-[290px] rounded-lg shadow-lg relative flex flex-col w-full justify-center items-center bg-white outline-none focus:outline-none top-[-200px]">
                                <div className="flex items-start md:items-center flex-col justify-center py-5 px-10">
                                    <p className="py-4 font-bold text-[18px]">Вы успешно подтвердили цель</p>
                                </div>
                                <div className='flex w-full mb-6 flex-row justify-center items-center'>
                                    <button
                                    onClick={() => setShowModalSuccess(false)}
                                    className="px-6 py-2 text-white tracking-wide transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
                                        Отлично
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="fixed inset-0 z-[99980] left-0 top-0 bottom-0 right-0 backdrop-blur-lg bg-gray-800/40"></div>
                </>
                }
                {showModalPurpose &&
                <>
                    <div
                    className="justify-center items-start md:items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-[99999] outline-none focus:outline-none"
                    >
                        <div className="absolute top-0 left-0 right-0 bottom-0" onClick={() => setShowModalPurpose(false)}></div>
                        <div className="relative w-full md:w-1/3 m-auto">
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full justify-center items-center bg-white outline-none focus:outline-none">
                                <div className="flex items-start md:items-center flex-col justify-center py-5 px-10">
                                    {selectedImage && (
                                        <Image
                                            alt="not found"
                                            className="h-[100px] w-auto mb-4"
                                            src={selectedImage}
                                        />
                                    )}
                                    <div className="flex items-center justify-center w-full">
                                        <label for="dropzone-file" className="flex flex-col items-center justify-center w-full border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <svg className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                                </svg>
                                                <p className="mb-2 text-sm text-gray-500 text-center dark:text-gray-400"><span className="font-semibold">Нажмите что бы загрузить фото</span> или перетащите его в это поле</p>
                                            </div>
                                            <input id="dropzone-file" type="file" onChange={handleChange} accept="image/png, image/gif, image/jpeg" className="hidden" />
                                        </label>
                                    </div>
                                </div>
                                <div className='flex w-full mb-6 flex-row justify-center items-center'>
                                {selectedImage &&
                                    <button
                                    onClick={() => {
                                            setShowModalPurpose(false)
                                            handleActivity()
                                        }
                                    }
                                    className="px-6 py-2 text-white tracking-wide transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
                                        Отправить
                                    </button>
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
            </div>)
        :
            (<Loading />)
        }
        </>
    )
}