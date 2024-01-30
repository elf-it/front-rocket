"use client"
import Calendar from "@/components/Calendar"
import { getPersonalData, activitybutton } from '@/lib/fetch'
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import Loading from "@/components/Loading"
import Link from "next/link"

export default function StatusesInfo(){

    const {data, status, update} = useSession()

    const [personalData, setPersonalData] = useState(null)
    const [timer, setTimer] = useState({h: 0, m: 0, s: 0})
    const [textConfirm, setTextConfirm] = useState("i m ok")
    const [error, setError] = useState("")
    const [nextEnableButton, setNextEnableButton] = useState("")
    const [percentDays, setPercentDays] = useState({})
    const [percentDays2, setPercentDays2] = useState({})
    const [showModal, setShowModal] = useState(false)

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

    const allStatuses = [
        {t1: "1-9 дней дисциплины", t2: "Новичок", t3: "1 уровень", t4: "20%", fill: "#6BF754", bg: "bg-[#6BF754]", border: "border-[#6BF754]"},
        {t1: "10-29 дней дисциплины", t2: "Любитель", t3: "2 уровень", t4: "20.5%", fill: "#ffe178", bg: "bg-[#ffe178]", border: "border-[#ffe178]"},
        {t1: "30-59 дней дисциплины", t2: "Красавчик", t3: "3 уровень", t4: "21%", fill: "#ffb178", bg: "bg-[#ffb178]", border: "border-[#ffb178]"},
        {t1: "60-89 дней дисциплины", t2: "Мастер", t3: "4 уровень", t4: "21.5%", fill: "#ff7878", bg: "bg-[#ff7878]", border: "border-[#ff7878]"},
        {t1: "90-119 дней дисциплины", t2: "Профи", t3: "5 уровень", t4: "22%", fill: "#e963ff", bg: "bg-[#e963ff]", border: "border-[#e963ff]"},
        {t1: "120-149 дней дисциплины", t2: "Лидер", t3: "6 уровень", t4: "22.5%", fill: "#9d61ff", bg: "bg-[#9d61ff]", border: "border-[#9d61ff]"},
        {t1: "150-179 дней дисциплины", t2: "Топ Лидер", t3: "7 уровень", t4: "23%", fill: "#62b4ff", bg: "bg-[#62b4ff]", border: "border-[#62b4ff]"},
        {t1: "180-364 дней дисциплины", t2: "Герой", t3: "8 уровень", t4: "23.5%", fill: "#ff248d", bg: "bg-[#ff248d]", border: "border-[#ff248d]"},
        {t1: "от 365 дней дисциплины", t2: "Супер Герой", t3: "9 уровень", t4: "24%", fill: "#7d27ec", bg: "bg-[#7d27ec]", border: "border-[#7d27ec]"},
    ]

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
        {personalData != null ? (
            <div className="w-full flex flex-row flex-wrap items-start justify-start">
                <div className="relative bg-white w-full p-6 rounded-[18px]">
                    <div className="p-6">
                        <p>
                        Статусы выдаются в зависимости от уровня твоей дисциплины. Чем больше ты находишься в дисциплине, тем выше твой статус и бонусное вознаграждение за личные приглашения. Ознакомься с таблицей статусов ниже и вперед к своей цели.
                        </p>
                    </div>
                </div>
                <div className="flex flex-wrap w-full md:w-2/3">
                    <div className="relative bg-white rounded-[18px] p-[20px] md:p-[30px] mt-[20px] w-full overflow-hidden mb-6">
                        <a href="#" className="absolute z-40 top-[20px] right-[20px] md:top-[17px] md:right-[17px]">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M9 16.5C13.1421 16.5 16.5 13.1421 16.5 9C16.5 4.85786 13.1421 1.5 9 1.5C4.85786 1.5 1.5 4.85786 1.5 9C1.5 13.1421 4.85786 16.5 9 16.5ZM9 18C13.9706 18 18 13.9706 18 9C18 4.02944 13.9706 0 9 0C4.02944 0 0 4.02944 0 9C0 13.9706 4.02944 18 9 18Z" fill="#B5B5B5"/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M6.25 6.88034C6.25 5.32313 7.68116 4.25 9.19446 4.25H9.29712C9.61913 4.25 9.94005 4.30684 10.2407 4.41925C11.0141 4.70841 11.5523 5.31654 11.7061 6.04346C11.8616 6.77858 11.6033 7.54974 10.9616 8.08289L10.3049 8.62852C10.0092 8.87424 9.87192 9.18403 9.87192 9.47627V10C9.87192 10.4142 9.53613 10.75 9.12192 10.75C8.70771 10.75 8.37192 10.4142 8.37192 10V9.47627C8.37192 8.69475 8.7424 7.97659 9.34631 7.47481L10.003 6.92918C10.2306 6.74006 10.2751 6.52655 10.2385 6.35384C10.2003 6.17292 10.0518 5.95005 9.71535 5.82425C9.58646 5.77606 9.44377 5.75 9.29712 5.75H9.19446C8.28382 5.75 7.75 6.36058 7.75 6.88034V6.98347C7.75 7.39768 7.41421 7.73347 7 7.73347C6.58579 7.73347 6.25 7.39768 6.25 6.98347V6.88034Z" fill="#B5B5B5"/>
                                <path d="M8 12C8 11.4477 8.44772 11 9 11C9.55228 11 10 11.4477 10 12C10 12.5523 9.55228 13 9 13C8.44772 13 8 12.5523 8 12Z" fill="#B5B5B5"/>
                            </svg>
                        </a>
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
                    {allStatuses.map((item, i) => (
                    <div className="relative w-full h-[86px] text-left text-xs text-color font-lato mt-4 flex flex-wrap items-center justify-between" key={i}>
                        <div className={`absolute top-[0px] left-[0px] rounded-xl ${item.bg} w-full h-[86px]`} />
                        <div className="absolute top-[0px] left-[4px] rounded-xl bg-white w-full h-[86px]" />
                        <div className="relative z-[5] w-1/4 justify-center items-center flex flex-col">
                            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 18 21" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M7.86661 1.10876C8.22334 0.010857 9.77657 0.010874 10.1333 1.10876L11.5361 5.42602H16.0755C17.2299 5.42602 17.7099 6.90323 16.7759 7.58176L13.1035 10.25L14.5062 14.5672C14.8629 15.6651 13.6064 16.5781 12.6724 15.8996L8.99996 13.2313L5.32748 15.8996C4.39355 16.5781 3.13697 15.6651 3.49369 14.5672L4.89645 10.25L1.22398 7.58176C0.290045 6.90322 0.770032 5.42602 1.92442 5.42602H6.46385L7.86661 1.10876ZM8.99996 2.8793L7.91203 6.2276C7.7525 6.71859 7.29495 7.05102 6.77869 7.05102H3.25808L6.10631 9.12038C6.52398 9.42383 6.69874 9.96171 6.53921 10.4527L5.45128 13.801L8.29951 11.7316C8.71718 11.4282 9.28274 11.4282 9.7004 11.7316L12.5486 13.801L11.4607 10.4527C11.3012 9.96171 11.4759 9.42383 11.8936 9.12038L14.7418 7.05102H11.2212C10.705 7.05102 10.2474 6.71859 10.0879 6.2276L8.99996 2.8793Z" fill={`${item.fill}`}/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M5.72319 19.4782C5.2747 19.4634 4.92314 19.0878 4.93795 18.6393L4.97371 17.5566C4.98853 17.1081 5.3641 16.7565 5.81259 16.7713C6.26108 16.7861 6.61264 17.1617 6.59783 17.6102L6.56207 18.693C6.54726 19.1414 6.17168 19.493 5.72319 19.4782Z" fill={`${item.fill}`}/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M12.2195 19.6927C11.771 19.6779 11.4195 19.3023 11.4343 18.8538L11.4701 17.7711C11.4849 17.3226 11.8604 16.971 12.3089 16.9858C12.7574 17.0006 13.109 17.3762 13.0942 17.8247L13.0584 18.9075C13.0436 19.3559 12.668 19.7075 12.2195 19.6927Z" fill={`${item.fill}`}/>
                                <path fillRule="evenodd" clipRule="evenodd" d="M8.93559 20.6682C8.48711 20.6534 8.13554 20.2779 8.15036 19.8294L8.22188 17.6639C8.23669 17.2154 8.61227 16.8638 9.06075 16.8786C9.50924 16.8935 9.8608 17.269 9.84599 17.7175L9.77447 19.883C9.75966 20.3315 9.38408 20.6831 8.93559 20.6682Z" fill={`${item.fill}`}/>
                            </svg>
                            <div className="flex items-center font-medium md:text-lg">{item.t3}</div>
                        </div>
                        <div className="relative z-[5] w-1/4 justify-center items-start flex flex-col">
                            <div className="text-xs md:text-xl font-semibold text-gray flex items-center">{item.t2}</div>
                            <div className="">{item.t1}</div>
                        </div>
                        <div className="relative z-[5] w-1/4 justify-center items-start flex flex-col">
                            {personalData?.referal_link != "x" &&
                            <>
                            <div className="text-xl font-semibold text-gray flex items-center">{item.t4}</div>
                            <Link href="/personal/structure" className="hidden md:flex items-center text-left">Размер персонального бонуса</Link>
                            </>
                            }
                        </div>
                        <div className="absolute top-[20px] left-[25%] z-[7] bg-black/30 w-px h-[46px]" />
                    </div>
                    ))}
                </div>
                <div className="flex w-full md:w-1/3 my-6 md:my-0 md:pl-6 pt-6">
                    <Calendar data={personalData} />
                </div>
            </div>)
        :
            (<Loading />)
        }
        </>
    )
}