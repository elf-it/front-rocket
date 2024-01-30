"use client"
import Image from 'next/image'
import Sprint from '../public/sprints/projectx.jpg'
import SprintJ from '../public/sprints/joker-mlm.png'
import Sprint1 from '../public/sprints/sp-base-1.jpg'
import Sprint2 from '../public/sprints/sp-base-2.jpg'
import Sprint3 from '../public/sprints/sp-base-3.jpg'
import Sprint4 from '../public/sprints/sp-base-4.jpg'
import Sprint5 from '../public/sprints/sp-base-5.jpg'
import Sprint6 from '../public/sprints/sp-base-6.jpg'
import Sprint7 from '../public/sprints/sp-base-7.jpg'
import Sprint8 from '../public/sprints/sp-base-8.jpg'
import Sprint9 from '../public/sprints/sp-base-9.jpg'
import Kusch1 from '../public/sprints/Kuschenko-1.jpg'
import Kusch2 from '../public/sprints/Kuschenko-2.jpg'
import Kusch3 from '../public/sprints/Kuschenko-3.jpg'
import Kusch4 from '../public/sprints/Kuschenko-4.jpg'
import Kusch5 from '../public/sprints/Kuschenko-5.jpg'
import Bel from '../public/sprints/bel.png'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getPersonalData } from '@/lib/fetch'
import { useSession } from "next-auth/react"
import Loading from "@/components/Loading"

export default function SprintsInfo() {

    const {data, status} = useSession()
    const [personalData, setPersonalData] = useState(null)

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

    useEffect(() => {
        if(personalData == null){
            getThPersonalData(data?.user?.uid)
        }
    }, [data, personalData])

    return(
        <>
        {personalData != null ?
            <div className='flex w-full h-full items-stretch flex-wrap'>
                {personalData?.referal_link != "x" &&
                <div className='w-full mt-2 xl:w-1/3 flex flex-row flex-wrap justify-around items-stretch'>
                    <div className="items-stretch flex-1 mb-2 w-full md:mb-0 md:mx-2 flex justify-start overflow-hidden shrink-0 text-left text-[18px] text-b39 bg-white rounded-lg">
                        <div className="shadow-lg p-4 h-full w-full flex flex-col justify-start items-start">
                            <div>
                                <Image
                                    priority
                                    src={Sprint}
                                    alt="Rocket"
                                    className='w-full rounded-lg'
                                />
                            </div>
                            <div className='mt-4'>
                                <span>Проект Х — Твои мысли формируют реальность</span>
                            </div>
                            <div className='mt-4 text-xs flex-1'>
                                <span>Каждый день с ПН-ПТ в 9.00 мск наши эксперты выходят в прямой эфир и помогают вам получить ответы на популярные вопросы.  Здесь ты получишь поддержку, мотивацию, прокачаешь мышление для достижения цели.</span>
                            </div>
                            <div className='mt-4 text-xs'>
                            
                            </div>
                            <div className='mt-4 flex flex-wrap'>
                                {personalData?.status == 1 ?
                                <Link
                                    href="https://us02web.zoom.us/j/81451656732?pwd=S3VWMzVQajdmajA5c3ZTc2VVV0M5QT09"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Подключиться к эфиру
                                </Link>
                                :
                                <Link
                                    href="/personal/mygame/rates"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Активировать спринт
                                </Link>
                                }
                                <Link
                                href="/personal/sprints/1"
                                className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-black transition-colors duration-200 transform rounded-md bg-purple-300/50 border border-[#9040F2] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
                                    Подробнее
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                }
                <div className='w-full mt-2 xl:w-1/3 flex flex-row flex-wrap justify-around items-stretch'>
                    <div className="items-stretch flex-1 mb-2 w-full md:mb-0 md:mx-2 flex justify-start overflow-hidden shrink-0 text-left text-[18px] text-b39 bg-white rounded-lg">
                        <div className="shadow-lg p-4 h-full w-full flex flex-col justify-start items-start">
                            <div>
                                <Image
                                    priority
                                    src={SprintJ}
                                    alt="Rocket"
                                    className='w-full rounded-lg'
                                />
                            </div>
                            <div className='mt-4'>
                                <span>МЛМ СПРИНТ «JOKER»</span>
                            </div>
                            <div className='mt-4 text-xs flex-1'>
                                <span>
                                    В Спринте МЛМ ты узнаешь:<br />
                                - как строится сетевой бизнес на примере нашей платформы;<br />
                                - как легко можно заработать с Rocket Science, уже через полгода получая пассивный доход до 3000$ в месяц;<br />
                                - что такое закон 1-9-90, и как его применять на практике;<br />
                                </span>
                            </div>
                            <div className='mt-4 text-xs'>
                            
                            </div>
                            <div className='mt-4 flex flex-wrap'>
                                {personalData?.status == 1 && personalData?.referal_link != "x" ?
                                <Link
                                    href="/personal/sprints/2"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Пройти спринт
                                </Link>
                                :
                                <Link
                                    href="/personal/mygame/rates"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Активировать спринт
                                </Link>
                                }
                                <Link
                                href="/personal/sprints/2"
                                className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-black transition-colors duration-200 transform rounded-md bg-purple-300/50 border border-[#9040F2] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
                                    Подробнее
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                {personalData?.referal_link != "x" &&
                <>
                <div className='w-full mt-2 xl:w-1/3 flex flex-row flex-wrap justify-around items-stretch'>
                    <div className="items-stretch flex-1 mb-2 w-full md:mb-0 md:mx-2 flex justify-start overflow-hidden shrink-0 text-left text-[18px] text-b39 bg-white rounded-lg">
                        <div className="shadow-lg p-4 h-full w-full flex flex-col justify-start items-start">
                            <div>
                                <Image
                                    priority
                                    src={Bel}
                                    alt="Rocket"
                                    className='w-full rounded-lg'
                                />
                            </div>
                            <div className='mt-4'>
                                <span>СПРИНТ НАСТАСЬЯ БЕЛОЧКИНА: ТЕХНИКА “ПРОГРАММИРОВАНИЕ”</span>
                            </div>
                            <div className='mt-4 text-xs flex-1'>
                                <span>
                                Техника «Программирование» или крутой спринт от нашего топового спикера Настасьи Белочкиной — ведущего российского эксперта по продажам и скриптам.
                                </span>
                            </div>
                            <div className='mt-4 text-xs'>
                            
                            </div>
                            <div className='mt-4 flex flex-wrap'>
                                {personalData?.status == 1 && personalData?.referal_link != "x" ?
                                <Link
                                    href="/personal/sprints/3"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Пройти спринт
                                </Link>
                                :
                                <Link
                                    href="/personal/mygame/rates"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Активировать спринт
                                </Link>
                                }
                                <Link
                                href="/personal/sprints/3"
                                className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-black transition-colors duration-200 transform rounded-md bg-purple-300/50 border border-[#9040F2] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
                                    Подробнее
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-2 xl:w-1/3 flex flex-row flex-wrap justify-around items-stretch'>
                    <div className="items-stretch flex-1 mb-2 w-full md:mb-0 md:mx-2 flex justify-start overflow-hidden shrink-0 text-left text-[18px] text-b39 bg-white rounded-lg">
                        <div className="shadow-lg p-4 h-full w-full flex flex-col justify-start items-start">
                            <div>
                                <Image
                                    priority
                                    src={Kusch1}
                                    alt="Rocket"
                                    className='w-full rounded-lg'
                                />
                            </div>
                            <div className='mt-4'>
                                <span>Спринт Владимира Кущенко. Упражнения для звонкости голоса</span>
                            </div>
                            <div className='mt-4 text-xs flex-1'>
                                <span>
                                Спринт «Упражнения для звонкости голоса» — отличный тренажер для развития голоса и дикции. Упражнения короткие, поэтому смотри и сразу применяй на практике!
                                </span>
                            </div>
                            <div className='mt-4 text-xs'>
                            
                            </div>
                            <div className='mt-4 flex flex-wrap'>
                                {personalData?.status == 1 && personalData?.referal_link != "x" ?
                                <Link
                                    href="/personal/sprints/4"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Пройти спринт
                                </Link>
                                :
                                <Link
                                    href="/personal/mygame/rates"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Активировать спринт
                                </Link>
                                }
                                <Link
                                href="/personal/sprints/4"
                                className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-black transition-colors duration-200 transform rounded-md bg-purple-300/50 border border-[#9040F2] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
                                    Подробнее
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-2 xl:w-1/3 flex flex-row flex-wrap justify-around items-stretch'>
                    <div className="items-stretch flex-1 mb-2 w-full md:mb-0 md:mx-2 flex justify-start overflow-hidden shrink-0 text-left text-[18px] text-b39 bg-white rounded-lg">
                        <div className="shadow-lg p-4 h-full w-full flex flex-col justify-start items-start">
                            <div>
                                <Image
                                    priority
                                    src={Kusch2}
                                    alt="Rocket"
                                    className='w-full rounded-lg'
                                />
                            </div>
                            <div className='mt-4'>
                                <span>Спринт Владимира Кущенко. Как дышать, чтобы хватало воздуха</span>
                            </div>
                            <div className='mt-4 text-xs flex-1'>
                                <span>
                                Чтобы голос был красивым и поставленным, необходимо тренировать дыхание и контролировать воздух. Предлагаем присоединиться к спринту «Как дышать, чтобы хватало воздуха» и учиться этому искусству вместе!
                                </span>
                            </div>
                            <div className='mt-4 text-xs'>
                            
                            </div>
                            <div className='mt-4 flex flex-wrap'>
                                {personalData?.status == 1 && personalData?.referal_link != "x" ?
                                <Link
                                    href="/personal/sprints/5"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Пройти спринт
                                </Link>
                                :
                                <Link
                                    href="/personal/mygame/rates"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Активировать спринт
                                </Link>
                                }
                                <Link
                                href="/personal/sprints/5"
                                className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-black transition-colors duration-200 transform rounded-md bg-purple-300/50 border border-[#9040F2] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
                                    Подробнее
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-2 xl:w-1/3 flex flex-row flex-wrap justify-around items-stretch'>
                    <div className="items-stretch flex-1 mb-2 w-full md:mb-0 md:mx-2 flex justify-start overflow-hidden shrink-0 text-left text-[18px] text-b39 bg-white rounded-lg">
                        <div className="shadow-lg p-4 h-full w-full flex flex-col justify-start items-start">
                            <div>
                                <Image
                                    priority
                                    src={Kusch3}
                                    alt="Rocket"
                                    className='w-full rounded-lg'
                                />
                            </div>
                            <div className='mt-4'>
                                <span>Спринт Владимира Кущенко. Делаем голос звонким</span>
                            </div>
                            <div className='mt-4 text-xs flex-1'>
                                <span>
                                Спринт «Делаем голос звонким» — отличный тренажер для развития голоса и дикции. Упражнения небольшие, смотри и повторяй.
                                </span>
                            </div>
                            <div className='mt-4 text-xs'>
                            
                            </div>
                            <div className='mt-4 flex flex-wrap'>
                                {personalData?.status == 1 && personalData?.referal_link != "x" ?
                                <Link
                                    href="/personal/sprints/6"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Пройти спринт
                                </Link>
                                :
                                <Link
                                    href="/personal/mygame/rates"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Активировать спринт
                                </Link>
                                }
                                <Link
                                href="/personal/sprints/6"
                                className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-black transition-colors duration-200 transform rounded-md bg-purple-300/50 border border-[#9040F2] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
                                    Подробнее
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-2 xl:w-1/3 flex flex-row flex-wrap justify-around items-stretch'>
                    <div className="items-stretch flex-1 mb-2 w-full md:mb-0 md:mx-2 flex justify-start overflow-hidden shrink-0 text-left text-[18px] text-b39 bg-white rounded-lg">
                        <div className="shadow-lg p-4 h-full w-full flex flex-col justify-start items-start">
                            <div>
                                <Image
                                    priority
                                    src={Kusch4}
                                    alt="Rocket"
                                    className='w-full rounded-lg'
                                />
                            </div>
                            <div className='mt-4'>
                                <span>Спринт Владимира Кущенко. Развиваем четкую дикцию</span>
                            </div>
                            <div className='mt-4 text-xs flex-1'>
                                <span>
                                Артикуляция и дикция — это то, что позволяет сделать любые слова и звуки внятными. Для их развития необходимо выполнять специальные упражнения по разминке речевого аппарата. И мы приготовили их для тебя!
                                </span>
                            </div>
                            <div className='mt-4 text-xs'>
                            
                            </div>
                            <div className='mt-4 flex flex-wrap'>
                                {personalData?.status == 1 && personalData?.referal_link != "x" ?
                                <Link
                                    href="/personal/sprints/7"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Пройти спринт
                                </Link>
                                :
                                <Link
                                    href="/personal/mygame/rates"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Активировать спринт
                                </Link>
                                }
                                <Link
                                href="/personal/sprints/7"
                                className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-black transition-colors duration-200 transform rounded-md bg-purple-300/50 border border-[#9040F2] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
                                    Подробнее
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-2 xl:w-1/3 flex flex-row flex-wrap justify-around items-stretch'>
                    <div className="items-stretch flex-1 mb-2 w-full md:mb-0 md:mx-2 flex justify-start overflow-hidden shrink-0 text-left text-[18px] text-b39 bg-white rounded-lg">
                        <div className="shadow-lg p-4 h-full w-full flex flex-col justify-start items-start">
                            <div>
                                <Image
                                    priority
                                    src={Kusch5}
                                    alt="Rocket"
                                    className='w-full rounded-lg'
                                />
                            </div>
                            <div className='mt-4'>
                                <span>Спринт Владимира Кущенко. Фразы, которые помогают в речи</span>
                            </div>
                            <div className='mt-4 text-xs flex-1'>
                                <span>
                                Владимир Кущенко, тренер по публичным выступлениям, делится списком секретных фраз, которые стоит использовать в своем лексиконе, чтобы научиться говорить кратко, конкретно и доступно.
                                </span>
                            </div>
                            <div className='mt-4 text-xs'>
                            
                            </div>
                            <div className='mt-4 flex flex-wrap'>
                                {personalData?.status == 1 && personalData?.referal_link != "x" ?
                                <Link
                                    href="/personal/sprints/8"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Пройти спринт
                                </Link>
                                :
                                <Link
                                    href="/personal/mygame/rates"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Активировать спринт
                                </Link>
                                }
                                <Link
                                href="/personal/sprints/8"
                                className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-black transition-colors duration-200 transform rounded-md bg-purple-300/50 border border-[#9040F2] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]">
                                    Подробнее
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
                </>
                }
                {personalData?.referal_link != "x" &&
                <>
                <div className='w-full mt-2 xl:w-1/3 flex flex-row flex-wrap justify-around items-stretch'>
                    <div className="items-stretch flex-1 mb-2 w-full md:mb-0 md:mx-2 flex justify-start overflow-hidden shrink-0 text-left text-[18px] text-b39 bg-white rounded-lg">
                        <div className="shadow-lg p-4 h-full w-full flex flex-col justify-start items-start">
                            <div>
                                <Image
                                    priority
                                    src={Sprint1}
                                    alt="Rocket"
                                    className='w-full rounded-lg'
                                />
                            </div>
                            <div className='mt-4'>
                                <span>1 базовый спринт. Здоровье: 10 000 шагов в день</span>
                            </div>
                            <div className='mt-4 text-xs flex-1'>
                                <span>
                                    Физическая активность играет ключевую роль в нашем общем здоровье и самочувствии. Одним из простых и доступных способов улучшить физическую форму является достаточное количество шагов в день. Это способствует укреплению сердечно-сосудистой системы, улучшению общего состояния организма и снижению риска развития серьезных заболеваний, включая диабет и ожирение.
                                </span>
                            </div>
                            <div className='mt-4 flex flex-wrap'>
                                {personalData?.status == 1 ?
                                <>
                                <Link
                                    href="/personal/sprints/9"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Участвовать
                                </Link>
                                </>
                                :
                                <Link
                                    href="/personal/mygame/rates"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Активировать спринт
                                </Link>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-2 xl:w-1/3 flex flex-row flex-wrap justify-around items-stretch'>
                    <div className="items-stretch flex-1 mb-2 w-full md:mb-0 md:mx-2 flex justify-start overflow-hidden shrink-0 text-left text-[18px] text-b39 bg-white rounded-lg">
                        <div className="shadow-lg p-4 h-full w-full flex flex-col justify-start items-start">
                            <div>
                                <Image
                                    priority
                                    src={Sprint2}
                                    alt="Rocket"
                                    className='w-full rounded-lg'
                                />
                            </div>
                            <div className='mt-4'>
                                <span>2 базовый спринт.  Красота: Массаж лица в домашних условиях</span>
                            </div>
                            <div className='mt-4 text-xs flex-1'>
                                <span>
                                Массаж лица помогает уменьшить отечность, сгладить признаки старения и сохранить упругость кожи. Его можно делать не только у косметолога, но и дома. Для этого вам понадобится 5-10 минут свободного времени утром или перед сном. Девайсы по желанию, можно эффективно сделать массаж с помощью рук.
                                </span>
                            </div>
                            <div className='mt-4 flex flex-wrap'>
                                {personalData?.status == 1 ?
                                <>
                                <Link
                                    href="/personal/sprints/10"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Участвовать
                                </Link>
                                </>
                                :
                                <Link
                                    href="/personal/mygame/rates"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Активировать спринт
                                </Link>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-2 xl:w-1/3 flex flex-row flex-wrap justify-around items-stretch'>
                    <div className="items-stretch flex-1 mb-2 w-full md:mb-0 md:mx-2 flex justify-start overflow-hidden shrink-0 text-left text-[18px] text-b39 bg-white rounded-lg">
                        <div className="shadow-lg p-4 h-full w-full flex flex-col justify-start items-start">
                            <div>
                                <Image
                                    priority
                                    src={Sprint3}
                                    alt="Rocket"
                                    className='w-full rounded-lg'
                                />
                            </div>
                            <div className='mt-4'>
                                <span>3 базовый спринт. Карьера и финансы: Учет доходов и расходов</span>
                            </div>
                            <div className='mt-4 text-xs flex-1'>
                                <span>
                                Учет доходов и расходов является важным аспектом финансового планирования и помогает обеспечить контроль над финансовым состоянием.
                                </span>
                            </div>
                            <div className='mt-4 flex flex-wrap'>
                                {personalData?.status == 1 ?
                                <>
                                <Link
                                    href="/personal/sprints/11"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Участвовать
                                </Link>
                                </>
                                :
                                <Link
                                    href="/personal/mygame/rates"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Активировать спринт
                                </Link>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-2 xl:w-1/3 flex flex-row flex-wrap justify-around items-stretch'>
                    <div className="items-stretch flex-1 mb-2 w-full md:mb-0 md:mx-2 flex justify-start overflow-hidden shrink-0 text-left text-[18px] text-b39 bg-white rounded-lg">
                        <div className="shadow-lg p-4 h-full w-full flex flex-col justify-start items-start">
                            <div>
                                <Image
                                    priority
                                    src={Sprint4}
                                    alt="Rocket"
                                    className='w-full rounded-lg'
                                />
                            </div>
                            <div className='mt-4'>
                                <span>4 базовый спринт. Семья и отношения: Качественное время с ребенком</span>
                            </div>
                            <div className='mt-4 text-xs flex-1'>
                                <span>
                                Все мы знаем, что время с ребенком невероятно ценно. Ведь это идеальный момент для создания крепких связей, развития навыков и передачи ценных знаний. Именно поэтому так важно проводить время с детьми с огромной любовью и вниманием.
                                </span>
                            </div>
                            <div className='mt-4 flex flex-wrap'>
                                {personalData?.status == 1 ?
                                <>
                                <Link
                                    href="/personal/sprints/12"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Участвовать
                                </Link>
                                </>
                                :
                                <Link
                                    href="/personal/mygame/rates"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Активировать спринт
                                </Link>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-2 xl:w-1/3 flex flex-row flex-wrap justify-around items-stretch'>
                    <div className="items-stretch flex-1 mb-2 w-full md:mb-0 md:mx-2 flex justify-start overflow-hidden shrink-0 text-left text-[18px] text-b39 bg-white rounded-lg">
                        <div className="shadow-lg p-4 h-full w-full flex flex-col justify-start items-start">
                            <div>
                                <Image
                                    priority
                                    src={Sprint5}
                                    alt="Rocket"
                                    className='w-full rounded-lg'
                                />
                            </div>
                            <div className='mt-4'>
                                <span>5 базовый спринт. Саморазвитие и образование: Иностранный язык</span>
                            </div>
                            <div className='mt-4 text-xs flex-1'>
                                <span>
                                В наше время знание иностранных языков становится необходимостью. Это открывает новые горизонты и целый мир возможностей и знакомств. Изучение иностранного языка помогает улучшить коммуникативные и интеллектуальные навыки, а также способствует личностному росту. Смотри спринт и легко учи новый язык!
                                </span>
                            </div>
                            <div className='mt-4 flex flex-wrap'>
                                {personalData?.status == 1 ?
                                <>
                                <Link
                                    href="/personal/sprints/13"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Участвовать
                                </Link>
                                </>
                                :
                                <Link
                                    href="/personal/mygame/rates"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Активировать спринт
                                </Link>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-2 xl:w-1/3 flex flex-row flex-wrap justify-around items-stretch'>
                    <div className="items-stretch flex-1 mb-2 w-full md:mb-0 md:mx-2 flex justify-start overflow-hidden shrink-0 text-left text-[18px] text-b39 bg-white rounded-lg">
                        <div className="shadow-lg p-4 h-full w-full flex flex-col justify-start items-start">
                            <div>
                                <Image
                                    priority
                                    src={Sprint6}
                                    alt="Rocket"
                                    className='w-full rounded-lg'
                                />
                            </div>
                            <div className='mt-4'>
                                <span>6 базовый спринт. Увлечения и хобби: Время делать то, что нравится</span>
                            </div>
                            <div className='mt-4 text-xs flex-1'>
                                <span>
                                В современном мире, где ритм жизни становится все более плотным и насыщенным, найти время для себя и своих увлечений – большая роскошь. Однако, несмотря на все трудности и ограничения, выделение времени на хобби имеет огромное значение для физического и эмоционального благополучия.
                                </span>
                            </div>
                            <div className='mt-4 flex flex-wrap'>
                                {personalData?.status == 1 ?
                                <>
                                <Link
                                    href="/personal/sprints/14"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Участвовать
                                </Link>
                                </>
                                :
                                <Link
                                    href="/personal/mygame/rates"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Активировать спринт
                                </Link>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-2 xl:w-1/3 flex flex-row flex-wrap justify-around items-stretch'>
                    <div className="items-stretch flex-1 mb-2 w-full md:mb-0 md:mx-2 flex justify-start overflow-hidden shrink-0 text-left text-[18px] text-b39 bg-white rounded-lg">
                        <div className="shadow-lg p-4 h-full w-full flex flex-col justify-start items-start">
                            <div>
                                <Image
                                    priority
                                    src={Sprint7}
                                    alt="Rocket"
                                    className='w-full rounded-lg'
                                />
                            </div>
                            <div className='mt-4'>
                                <span>7 базовый спринт. Образ жизни: сон не позднее 23:00</span>
                            </div>
                            <div className='mt-4 text-xs flex-1'>
                                <span>
                                Сон — один из самых важных аспектов здоровья и благополучия. Но, признайся, ты тоже любишь устраивать марафоны сериалов и чатиться с друзьями до глубокой ночи? Не надо так! Есть сильные доказательства того, что ложиться спать не позднее 23:00 — отличная привычка для физического и эмоционального здоровья. Попробуешь?
                                </span>
                            </div>
                            <div className='mt-4 flex flex-wrap'>
                                {personalData?.status == 1 ?
                                <>
                                <Link
                                    href="/personal/sprints/15"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Участвовать
                                </Link>
                                </>
                                :
                                <Link
                                    href="/personal/mygame/rates"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Активировать спринт
                                </Link>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-2 xl:w-1/3 flex flex-row flex-wrap justify-around items-stretch'>
                    <div className="items-stretch flex-1 mb-2 w-full md:mb-0 md:mx-2 flex justify-start overflow-hidden shrink-0 text-left text-[18px] text-b39 bg-white rounded-lg">
                        <div className="shadow-lg p-4 h-full w-full flex flex-col justify-start items-start">
                            <div>
                                <Image
                                    priority
                                    src={Sprint8}
                                    alt="Rocket"
                                    className='w-full rounded-lg'
                                />
                            </div>
                            <div className='mt-4'>
                                <span>8 базовый спринт. Эмоциональное состояние: дневник благодарности</span>
                            </div>
                            <div className='mt-4 text-xs flex-1'>
                                <span>
                                Дневник благодарности — это очень важный инструмент, который помогает сосредоточиться на положительных и благоприятных аспектах жизни.
                                </span>
                            </div>
                            <div className='mt-4 flex flex-wrap'>
                                {personalData?.status == 1 ?
                                <>
                                <Link
                                    href="/personal/sprints/16"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Участвовать
                                </Link>
                                </>
                                :
                                <Link
                                    href="/personal/mygame/rates"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Активировать спринт
                                </Link>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className='w-full mt-2 xl:w-1/3 flex flex-row flex-wrap justify-around items-stretch'>
                    <div className="items-stretch flex-1 mb-2 w-full md:mb-0 md:mx-2 flex justify-start overflow-hidden shrink-0 text-left text-[18px] text-b39 bg-white rounded-lg">
                        <div className="shadow-lg p-4 h-full w-full flex flex-col justify-start items-start">
                            <div>
                                <Image
                                    priority
                                    src={Sprint9}
                                    alt="Rocket"
                                    className='w-full rounded-lg'
                                />
                            </div>
                            <div className='mt-4'>
                                <span>9 базовый спринт. Самореализация: проявленность в соцсетях</span>
                            </div>
                            <div className='mt-4 text-xs flex-1'>
                                <span>
                                Проявленность в соцсетях — важный аспект для любого эксперта. Нужно быть «видимым» и активно участвовать в онлайн-сообществе. Куда большинство людей идет за информацией и экспертным мнением? Конечно, в соцсети. Поэтому у экспертов есть уникальная возможность поделиться своими знаниями, опытом и мнением с широкой аудиторией, а также установить контакт с потенциальными клиентами, коллегами и партнерами. Не упусти ее!
                                </span>
                            </div>
                            <div className='mt-4 flex flex-wrap'>
                                {personalData?.status == 1 ?
                                <>
                                <Link
                                    href="/personal/sprints/17"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Участвовать
                                </Link>
                                </>
                                :
                                <Link
                                    href="/personal/mygame/rates"
                                    className="px-4 text-xs lg:text-sm py-2 mb-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] mr-4">
                                        Активировать спринт
                                </Link>
                                }
                            </div>
                        </div>
                    </div>
                </div>
                </>
                }
            </div>
        :
            <Loading />
        }
        </>
    )
}