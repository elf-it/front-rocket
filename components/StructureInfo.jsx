"use client"
import { useSession } from "next-auth/react"
import { useEffect, useState, useMemo } from 'react'
import { getStructureData } from '@/lib/fetch'
import "../styles/struct.css"

import Loading from "./Loading"

export default function StructureInfo() {
    
    const {data, status} = useSession()

    const [structureData, setStructureData] = useState(null)

    const [tab, setTab] = useState(0)

    const useSortableData = (items, config = null) => {
        const [sortConfig, setSortConfig] = useState(config)
        
        const sortedItems = useMemo(() => {
            let sortableItems = [...items]
            if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1
                }
                return 0
            });
            }
            return sortableItems
        }, [items, sortConfig])
        
        const requestSort = key => {
            let direction = 'ascending'
            if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending'
            }
            setSortConfig({ key, direction })
        }
        return { items: sortedItems, requestSort, sortConfig }
    }

    const getThStructureData = async (uid) => {
        try {
            const response = await getStructureData({
				key: process.env.AUTH_KEY,
				uid
			})

            if(response.error){
                setStructureData(null)
            }else{
				setStructureData(response)
			}
        } catch (error) {
            console.log("Error: ", error)
        }
    }

    const SortedData = (props) => {
        const { items, requestSort, sortConfig } = useSortableData(props.sdata)
        const getClassNamesFor = (name) => {
            if (!sortConfig) {
                return
            }
            return sortConfig.key === name ? sortConfig.direction : undefined
        }
        return (
            <table className="table-auto w-full min-w-[1060px]">
                <thead>
                    <tr className="border border-[#C2C9D1] border-opacity-75">
                    <th scope="col" className="text-center text-xs text-black font-semibold leading-none pt-[22px] pb-[10px] w-[20%]">
                        <button
                            type="button"
                            onClick={() => requestSort('login')}
                            className={getClassNamesFor('login')}
                            >
                            Логин
                        </button>
                    </th>
                    <th scope="col" className="text-center text-xs text-black font-semibold leading-none pt-[22px] pb-[10px] w-[9%]">
                        <button
                            type="button"
                            onClick={() => requestSort('level_line')}
                            className={getClassNamesFor('level_line')}
                            >
                            Уровень
                        </button>
                    </th>
                    <th scope="col" className="text-center text-xs text-black font-semibold leading-none pt-[22px] pb-[10px] w-[11%]">
                        <button
                            type="button"
                            onClick={() => requestSort('referrer')}
                            className={getClassNamesFor('referrer')}
                            >
                            Наставник
                        </button>
                    </th>
                    <th scope="col" className="text-center text-xs text-black font-semibold leading-none pt-[22px] pb-[10px]">
                        <button
                            type="button"
                            onClick={() => requestSort('email')}
                            className={getClassNamesFor('email')}
                            >
                            E-mail
                        </button>
                    </th>
                    <th scope="col" className="text-center text-xs text-black font-semibold leading-none pt-[22px] pb-[10px] w-[10%]">
                        <button
                            type="button"
                            onClick={() => requestSort('branch')}
                            className={getClassNamesFor('branch')}
                            >
                            Ветка
                        </button>
                    </th>
                    <th scope="col" className="text-center text-xs text-black font-semibold leading-none pt-[22px] pb-[10px] w-[12%]">
                        <button
                            type="button"
                            onClick={() => requestSort('qualification')}
                            className={getClassNamesFor('qualification')}
                            >
                            Квалификация
                        </button>
                    </th>
                    <th scope="col" className="text-center text-xs text-black font-semibold leading-none pt-[22px] pb-[10px] w-[9%]">
                        <button
                            type="button"
                            onClick={() => requestSort('activity')}
                            className={getClassNamesFor('activity')}
                            >
                            Активность
                        </button>
                    </th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, i) => (
                        <tr key={i} className="hover:bg-neutral-100 border border-[#C2C9D1] border-opacity-75">
                            <td className="px-[10px] py-[12px] leading-none text-xs font-normal text-blackm">{item.login}</td>
                            <td className="px-[10px] leading-none text-xs font-normal text-black text-center">{item.level_line}</td>
                            <td className="px-[10px] leading-none text-xs font-normal text-black text-center">{item.referrer}</td>
                            <td className="px-[10px] leading-none text-xs font-normal text-black text-center">{item.email}</td>
                            <td className="px-[10px] leading-none text-xs font-normal text-black text-center">{item.branch}</td>
                            <td className="px-[10px] leading-none text-xs font-normal text-black text-center">{item.qualification}</td>
                            <td className="px-[10px] leading-none text-xs font-normal text-black text-center">{item.activity == 1 ? "активен" : "не активен"}</td>
                        </tr>
                    ))
                    }
                </tbody>
            </table>
        );
    }

    useEffect(() => {
        if(structureData == null){
            getThStructureData(data?.user?.uid)
        }
    }, [data])

    return(
        <>
            {status != "loading" ? (
                <>
                    <div>
                        <ul className="flex list-none mx-[-5px] p-0">
                            <li className="px-[5px]">
                                <button onClick={() => setTab(0)} className={`h-[35px] md:h-[41px] px-[18px] md:px-[26px] ${tab == 0 ? "bg-gradient-to-t from-violet-600 to-purple-400 shadow-[0_15px_17px_-8px_rgba(64,4,236,0.30)]" : "hover:text-white hover:border-none hover:bg-gradient-to-t hover:from-violet-600 hover:to-purple-400 border border-opacity-50 border-violet-600 bg-white text-zinc-900"} rounded-md items-center inline-flex text-white text-xs font-normal md:font-semibold whitespace-nowrap`}>Описание программы</button>
                            </li>
                            <li className="px-[5px]">
                                <button onClick={() => setTab(1)} className={`h-[35px] md:h-[41px] px-[18px] md:px-[26px] ${tab == 1 ? "bg-gradient-to-t from-violet-600 to-purple-400 shadow-[0_15px_17px_-8px_rgba(64,4,236,0.30)]" : "hover:text-white hover:border-none hover:bg-gradient-to-t hover:from-violet-600 hover:to-purple-400 border border-opacity-50 border-violet-600 bg-white text-zinc-900"} rounded-md items-center inline-flex text-white text-xs font-normal md:font-semibold whitespace-nowrap`}>Моя структура</button>
                            </li>
                        </ul>
                    </div>
                    {tab == 0 ?
                    <div className="bg-white w-full md:w-3/4 rounded-[18px] px-[30px] py-[20px] mt-[20px]">
                        <h1 className="text-slate-900 text-xl font-semibold">Партнерская программа</h1>
                        <h2 className="mt-[10px] text-gray-500 text-xs font-normal">Посмотрите видеоролик для детального ознакомления с партнерской программой</h2>
                        <div className="mt-[23px] md:mt-[33px] ">
                            <div className="relative pt-[56%] rounded-xl overflow-hidden">
                                <iframe className="top-0 left-0 absolute h-full w-full" src="https://www.youtube.com/embed/8eNt0boPgkU?si=6Umm37zaYhpJ4OEg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
                            </div>
                        </div>
                        <div className="mt-[20px] md:mt-[40px] text-slate-900 text-xs md:text-sm font-normal">
                            <div className="mb-[20px]">
                            <p className="font-bold">
                            Партнерская программа Rocket Science
                            </p>
                            <br />
                            <p>
                            В Rocket Science действует система лидерского маркетинг плана — ты можешь строить свою большую структуру и зарабатывать большие деньги на пассивном доходе. 
                            </p>
                            <br />
                            <p>
                            Всего у лидеров 7 видов бонусов:
                            </p>
                            <br />
                            <p>
                            1. Personal
                            </p>
                            <br />
                            <p className="pl-4">
                            Бонус за то, что ты привел друга, который зарегистрировался и оплатил подписку на платформе за 27$ — от 20% до 25% за каждого подписчика. 
                            Чем дольше ты находишься на платформе, тем выше у тебя статус, тем больше твой бонус за каждого подписчика. 
                            <br />
                            <br />
                            5 человек, которые пришли по твоей реферальной ссылке — это твоя точка безубыточности — ты уже окупаешь свою подписку.
                            </p>
                            <br />
                            <p>
                            2. Лидерский
                            </p>
                            <br />
                            <p className="pl-4">
                            Бонус за построение команды. У каждого лидера есть ранг — от 0 до 12.
                            </p>
                            <br />
                            <p className="pl-4">
                            0 ранг — 50 человек (3% с каждого абонента)<br />
                            1 ранг — 100 человек (5% с каждого абонента)<br />
                            2 ранг — 250 человек (7% с каждого абонента)<br />
                            3 ранг — 500 человек (9% с каждого абонента)<br />
                            4 ранг — 1000 человек (11% с каждого абонента)<br />
                            5 ранг — 2500 человек (13% с каждого абонента)<br />
                            6 ранг — 5000 человек (15% с каждого абонента)<br />
                            7 ранг — 10000 человек (17% с каждого абонента)<br />
                            8 ранг — 30000 человек (19% с каждого абонента)<br />
                            9 ранг — 100 000 человек (21% с каждого абонента)<br />
                            10 ранг — 250 000 человек (22% с каждого абонента)<br />
                            11 ранг — 500 000 человек (23% с каждого абонента)<br />
                            12 ранг — 1 000 000 человек (23,5% с каждого абонента)
                            </p>
                            <br />
                            <p>
                            3. Matching Bonus
                            </p>
                            <br />
                            <p className="pl-4">
                            Это доход с дохода. В твоей команде есть лидеры, которые уже отлично продают и зарабатывают. Наша компания будет выплачивать тебе процент с дохода лидеров. Не забирать у них, а платить тебе из своих средств, так как ты смог собрать классную команду и вырастил лидеров.
                            </p>
                            <br />
                            <p>
                            4. World Bonus — объединяющий бонус.
                            </p>
                            <br />
                            <p className="pl-4">
                            Процент от оборота всей компании Rocket Science. Доступен для лидеров 8, 9 и 10 ранга.
                            <br />
                            8 ранг — 1% со всего оборота
                            9 ранг — +0,8% со всего оборота
                            10 ранг — +0,8% со всего оборот
                            </p>
                            <br />
                            <p>
                            5. Ambassador Bonus
                            </p>
                            <br />
                            <p className="pl-4">
                            У амбассадоров платформы Rocket Science свои привилегии: поездки, обучение, авиабилеты — все за счет компании.
                            </p>
                            <br />
                            <p>
                            6. Автобонус
                            </p>
                            <br />
                            <p className="pl-4">
                            Ты можешь получить в подарок от компании автомобиль премиального класса. При достижении 5 ранга и удержание его 3 месяца участник может получить автомобиль на выбор.
                            </p>
                            <br />
                            <p>
                            7. Gift Bonus
                            </p>
                            <br />
                            <p className="pl-4">
                            Подарки при удержании ранга 3 месяца и более.
                            <br />
                            <br />
                            2 ранг — мерч-набор в подарок (брендированные ручки, блокнот и термо-кружка)<br />
                            3 ранг — фирменные худи и духи в подарок<br />
                            4 ранг — техника Apple в подарок<br />
                            5 ранг — путешествие в подарок<br />
                            6 ранг — драгоценные украшения
                            </p>
                            </div>
                        </div>
                    </div>
                    :
                    <div className=' w-full flex flex-row flex-wrap justify-start items-start pt-[20px]'>
                        <div className="bg-white rounded-xl px-[20px] lg:px-[40px] w-full ">
                            <div className="flex  content-center items-start md:items-center py-[16px] md:py-[0] h-auto md:h-[120px] flex-wrap mx-[-10px] xl:mx-[-30px] ">
                                <div className="py-[5px] md:py-0 w-1/2 md:w-1/4 xl:w-auto  justify-start items-center flex flex-wrap px-[10px] lg:px-[10px] xl:px-[30px]">
                                    <div className="text-gray-500 text-xs font-normal">Структура</div>
                                    <div className="text-zinc-900 text-sm md:text-xl font-bold ml-[0] md:ml-[0] lg:ml-[10px] w-full lg:w-auto">
                                        {structureData?.structure || 0}
                                    </div>
                                </div>
                                <div className="py-[5px] md:py-0 w-1/2 md:w-1/4 xl:w-auto  justify-start items-center flex flex-wrap px-[10px] lg:px-[10px] xl:px-[30px]">
                                    <div className="text-gray-500 text-xs font-normal">Основная ветка</div>
                                    <div className="text-zinc-900 text-sm md:text-xl font-bold ml-[0] md:ml-[0] lg:ml-[10px] w-full lg:w-auto">
                                        {structureData?.one_branch || 0}
                                    </div>
                                </div>
                                <div className="py-[5px] md:py-0 w-1/2 md:w-1/4 xl:w-auto  justify-start items-center flex flex-wrap px-[10px] lg:px-[10px] xl:px-[30px]">
                                    <div className="text-gray-500 text-xs font-normal">Другие ветки</div>
                                    <div className="text-zinc-900 text-sm md:text-xl font-bold ml-[0] md:ml-[0] lg:ml-[10px] w-full lg:w-auto">
                                        {structureData?.other_branch || 0}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="w-full p-[20px] md:p-[32px] bg-white rounded-xl mt-[20px]">
                            <div className="justify-end hidden">
                                <div className="w-[305px] relative">
                                    <input type="text" placeholder="Поиск" className="shadow-[0_8px_50px_0_rgba(0,0,0,0.08)] outline-0 pl-[22px] pr-[58px] placeholder:text-slate-400 text-xs font-normal w-full h-[38px] md:h-[46px] bg-white rounded-md" />
                                    <a href="#" className="absolute right-0 top-0 z-10 flex items-center justify-center w-[38px] h-[38px] md:w-[46px] md:h-[46px] bg-gradient-to-t from-violet-600 to-purple-400 rounded-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]  md:w-[21px] md:h-[21px]" viewBox="0 0 21 21" fill="none">
                                            <path d="M18.8343 18.8426C18.7119 18.9632 18.5469 19.031 18.375 19.0313C18.2007 19.0305 18.0334 18.963 17.9074 18.8426L14.3636 15.2906C12.8712 16.5442 10.9523 17.1733 9.00734 17.0465C7.06235 16.9197 5.24138 16.047 3.92422 14.6103C2.60707 13.1736 1.89542 11.2838 1.93769 9.33517C1.97997 7.38652 2.77292 5.52941 4.15115 4.15118C5.52938 2.77295 7.38648 1.98 9.33514 1.93773C11.2838 1.89545 13.1735 2.6071 14.6103 3.92426C16.047 5.24141 16.9197 7.06238 17.0465 9.00737C17.1732 10.9524 16.5442 12.8712 15.2906 14.3637L18.8343 17.9074C18.8964 17.9685 18.9456 18.0413 18.9792 18.1216C19.0128 18.2018 19.0301 18.288 19.0301 18.375C19.0301 18.462 19.0128 18.5482 18.9792 18.6285C18.9456 18.7087 18.8964 18.7815 18.8343 18.8426ZM9.5156 15.75C10.7486 15.75 11.954 15.3844 12.9792 14.6993C14.0045 14.0143 14.8035 13.0406 15.2754 11.9014C15.7473 10.7622 15.8707 9.50871 15.6302 8.29936C15.3896 7.09001 14.7959 5.97915 13.924 5.10726C13.0521 4.23537 11.9412 3.6416 10.7319 3.40105C9.52251 3.16049 8.26899 3.28395 7.12981 3.75582C5.99062 4.22768 5.01695 5.02676 4.33191 6.052C3.64686 7.07724 3.28122 8.28259 3.28122 9.51563C3.28339 11.1684 3.94093 12.7529 5.10963 13.9216C6.27833 15.0903 7.86281 15.7478 9.5156 15.75Z" fill="white"/>
                                        </svg>
                                    </a>
                                </div>
                            </div>
                            <div className="justify-between flex items-center mt-[40px]">
                                <div className="flex items-center">
                                    <a href="#"
                                    className="hover:text-white hover:bg-[#1C1C1C] inline-flex h-[32px] md:h-[38px] items-center px-[16px] md:px-[20px] bg-[#1C1C1C] text-white rounded-[6px] font-semibold text-xs">Таблица</a>
                                </div>

                                <div className="hidden">
                                    <div className="justify-start items-start flex mx-[-4px]">
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
                                        <div className="flex px-[4px]">
                                            <a href="#"
                                            className="w-[32px] h-[32px] md:w-[46px] md:h-[46px] relative bg-white flex items-center justify-center rounded-lg shadow border border-neutral-100">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M3.60938 18.375C3.24694 18.375 2.95312 18.0812 2.95312 17.7188V13.7812C2.95312 13.4188 3.24694 13.125 3.60938 13.125H4.75781C4.75781 13.125 5.84512 13.125 6.61397 13.8938C6.61397 13.8938 7.38281 14.6627 7.38281 15.75C7.38281 15.75 7.38281 16.8373 6.61397 17.6062C6.61397 17.6062 5.84512 18.375 4.75781 18.375H3.60938ZM4.75781 17.0625H4.26562V14.4375H4.75781C4.75781 14.4375 5.30147 14.4375 5.68589 14.8219C5.68589 14.8219 6.07031 15.2063 6.07031 15.75C6.07031 15.75 6.07031 16.2937 5.68589 16.6781C5.68589 16.6781 5.30147 17.0625 4.75781 17.0625Z" fill="#060B39"/>
                                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M10.6641 13.125C10.6641 13.125 11.7003 13.125 12.4239 13.9144C12.4239 13.9144 13.125 14.6792 13.125 15.75C13.125 15.75 13.125 16.8208 12.4239 17.5856C12.4239 17.5856 11.7003 18.375 10.6641 18.375C10.6641 18.375 9.62785 18.375 8.9042 17.5856C8.9042 17.5856 8.20312 16.8208 8.20312 15.75C8.20312 15.75 8.20312 14.6792 8.9042 13.9144C8.9042 13.9144 9.62785 13.125 10.6641 13.125ZM10.6641 14.4375C10.6641 14.4375 10.2052 14.4375 9.87171 14.8013C9.87171 14.8013 9.51562 15.1898 9.51562 15.75C9.51562 15.75 9.51562 16.3102 9.87171 16.6987C9.87171 16.6987 10.2052 17.0625 10.6641 17.0625C10.6641 17.0625 11.1229 17.0625 11.4564 16.6987C11.4564 16.6987 11.8125 16.3102 11.8125 15.75C11.8125 15.75 11.8125 15.1898 11.4564 14.8013C11.4564 14.8013 11.1229 14.4375 10.6641 14.4375Z" fill="#1C1C1C"/>
                                                    <path d="M16.2369 14.4375C16.6459 14.4408 16.9478 14.7168 16.9478 14.7168C17.0688 14.8273 17.2267 14.8887 17.3906 14.8887C17.4004 14.8887 17.4102 14.8884 17.42 14.888C17.5939 14.8802 17.7575 14.8037 17.875 14.6752C17.9856 14.5543 18.0469 14.3963 18.0469 14.2324L18.0469 14.2306C18.0468 14.2214 18.0466 14.2122 18.0462 14.203C18.0384 14.0292 17.9619 13.8655 17.8334 13.7481C17.1599 13.1324 16.2475 13.125 16.2475 13.125C15.203 13.125 14.4807 13.9131 14.4807 13.9131C13.7812 14.6764 13.7812 15.75 13.7812 15.75C13.7812 16.8236 14.4807 17.5869 14.4807 17.5869C15.203 18.375 16.2422 18.375 16.2422 18.375C17.1599 18.3676 17.8334 17.7519 17.8334 17.7519C17.9694 17.6276 18.0469 17.4518 18.0469 17.2676L18.0469 17.263C18.0457 17.1007 17.9845 16.9446 17.875 16.8248C17.7507 16.6888 17.5749 16.6113 17.3906 16.6113L17.3861 16.6113C17.2237 16.6125 17.0676 16.6737 16.9478 16.7832C16.6459 17.0592 16.2422 17.0625 16.2422 17.0625C15.7805 17.0625 15.4484 16.7001 15.4484 16.7001C15.0937 16.3132 15.0938 15.75 15.0938 15.75C15.0937 15.1868 15.4484 14.7999 15.4484 14.7999C15.7805 14.4375 16.2369 14.4375 16.2369 14.4375Z" fill="#1C1C1C"/>
                                                    <path d="M12.4688 2.625V7.21875H17.0625L12.4688 2.625Z" fill="black" fill-opacity="0.1"/>
                                                    <path d="M16.4062 7.49058V10.5C16.4062 10.8624 16.7001 11.1562 17.0625 11.1562C17.4249 11.1562 17.7188 10.8624 17.7188 10.5V7.21875C17.7188 7.0447 17.6496 6.87778 17.5265 6.75471L12.9328 2.16096C12.8097 2.03789 12.6428 1.96875 12.4688 1.96875L4.59375 1.96875C4.05009 1.96875 3.66567 2.35317 3.66567 2.35317C3.28125 2.73759 3.28125 3.28125 3.28125 3.28125V10.5C3.28125 10.8624 3.57506 11.1562 3.9375 11.1562C4.29994 11.1562 4.59375 10.8624 4.59375 10.5V3.28125H12.1969L16.4062 7.49058Z" fill="#1C1C1C"/>
                                                    <path d="M12.4688 7.875H17.0625C17.4249 7.875 17.7188 7.58119 17.7188 7.21875C17.7188 6.85631 17.4249 6.5625 17.0625 6.5625H13.125V2.625C13.125 2.26256 12.8312 1.96875 12.4688 1.96875C12.1063 1.96875 11.8125 2.26256 11.8125 2.625V7.21875C11.8125 7.58119 12.1063 7.875 12.4688 7.875Z" fill="#1C1C1C"/>
                                                </svg>
                                            </a>
                                        </div>
                                        <div className="flex px-[4px]">
                                            <a href="#"
                                            className="w-[32px] h-[32px] md:w-[46px] md:h-[46px] relative bg-white flex items-center justify-center rounded-lg shadow border border-neutral-100">

                                                <svg className="w-[14px] md:w-[21px] h-[14px] md:h-[21px] " xmlns="http://www.w3.org/2000/svg"
                                                    width="21" height="21" viewBox="0 0 22 21" fill="none">
                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                        d="M3.95334 3.28125C3.5632 3.28137 3.23647 3.49458 3.23647 3.49458C2.90975 3.70779 2.75254 4.06486 2.75254 4.06486C2.59532 4.42192 2.65867 4.80688 2.65867 4.80688C2.72203 5.19184 2.98537 5.47969 2.98537 5.47969L8.37334 11.4089L8.37407 11.4093C8.37501 11.4091 8.37506 11.4042 8.37506 11.4042L8.37503 17.809C8.37871 18.1759 8.56576 18.4838 8.56576 18.4838C8.7528 18.7917 9.07082 18.9609 9.07082 18.9609C9.38884 19.1302 9.74871 19.1134 9.74871 19.1134C10.1086 19.0966 10.4094 18.8984 10.4094 18.8984L13.0371 17.1494C13.3113 16.9716 13.4697 16.6768 13.4697 16.6768C13.6281 16.3821 13.625 16.0475 13.625 16.0475L13.625 11.4107L19.0162 5.47806C19.278 5.19184 19.3414 4.80688 19.3414 4.80688C19.4047 4.42191 19.2475 4.06485 19.2475 4.06485C19.0903 3.70779 18.7636 3.49458 18.7636 3.49458C18.4369 3.28137 18.0467 3.28125 18.0467 3.28125H3.95334ZM9.34469 10.5262L3.95375 4.59375L18.0463 4.59375L18.0448 4.59538L12.6615 10.5196C12.3076 10.8984 12.3125 11.4105 12.3125 11.4105L12.3126 16.0552L12.3112 16.056L12.3098 16.0568L9.68753 17.8023L9.6875 11.4169C9.69249 10.8984 9.34469 10.5262 9.34469 10.5262Z"
                                                        fill="#060B39"/>
                                                </svg>
                                            </a>
                                        </div>



                                    </div>
                                </div>
                            </div>
                            <div className="mt-[30px] md:mt-[50px]">
                                <div className="mt-[16px] md:mt-[24px] overflow-auto">
                                    {structureData &&
                                        <SortedData sdata={structureData?.users} />
                                    }
                                </div>
                            </div>
                            <div className="mt-[23px] hidden">
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
                                        className="hover:bg-gradient-to-t hover:from-violet-600 hover:to-purple-400 [&>svg>path]:hover:fill-white bg-white   rounded-md border border-zinc-100 h-[26px] w-[26px] md:h-[32px] md:w-[32px] inline-flex justify-center items-center text-zinc-800 text-xs font-semibold">
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
                    </div>
                    }
                </>
                )
                :
                (<>
                    <Loading />
                </>)
            }
        </>
    );
}