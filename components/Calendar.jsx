import {
    add,
    eachDayOfInterval,
    endOfMonth,
    endOfWeek,
    format,
    getDay,
    isSameMonth,
    isToday,
    parse,
    startOfToday,
    startOfWeek
} from "date-fns"
import { capitalizeFirstLetter } from "@/lib/functions"
import { useState } from "react"
import Lives from "../public/live.svg"
import Image from "next/image"

export default function Calendar({data}){

    const today = startOfToday()
    const days = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"]
    const colStartClasses = [
        "col-start-0",
        "col-start-1",
        "col-start-2",
        "col-start-3",
        "col-start-4",
        "col-start-5",
        "col-start-6"
    ]

    const [currMonth, setCurrMonth] = useState(() => format(today, "MMM-yyyy"))
    let firstDayOfMonth = parse(currMonth, "MMM-yyyy", new Date(), {weekStartsOn: 1})

    const daysInMonth = eachDayOfInterval({
        start: startOfWeek(firstDayOfMonth, {weekStartsOn: 1}),
        end: endOfWeek(endOfMonth(firstDayOfMonth), {weekStartsOn: 1}),
    })

    const prev_days = daysInMonth.findIndex((el) => isToday(el))

    const no_color_days = prev_days - data?.button_days > 0 ? prev_days - data?.button_days : prev_days

    const getPrevMonth = (event) => {
        event.preventDefault()
        const firstDayOfPrevMonth = add(firstDayOfMonth, { months: -1 })
        setCurrMonth(format(firstDayOfPrevMonth, "MMM-yyyy"))
    }

    const getNextMonth = (event) => {
        event.preventDefault()
        const firstDayOfNextMonth = add(firstDayOfMonth, { months: 1 })
        setCurrMonth(format(firstDayOfNextMonth, "MMM-yyyy"))
    }

    const isDays = (ncd, idxx, td) => {
        if(ncd < idxx && idxx <= td){
            return false
        }else{
            return true
        }
    }

    return(
    <>
        <div className="p-6 w-full flex items-center justify-center rounded-[18px] bg-white">
            <div className="w-full">
                <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm xl:text-xl">
                        Персональный трекер
                    </p>
                    <p className="font-semibold text-xl">
                        <Image
                            priority
                            src={Lives}
                            alt="Lives"
                            className="px-1 inline-block"
                            width={30}
                        />
                        {data?.status == 0 ? 0 : data?.lives}
                    </p>
                </div>
                <div className="grid grid-cols-7 mt-6 gap-0.5 place-items-center text-xs md:text-sm text-black/30">
                {days.map((day, idx) => {
                    return (
                    <div key={idx} className="font-semibold">
                        {capitalizeFirstLetter(day)}
                    </div>
                    );
                })}
                </div>
                <div className="grid grid-cols-7 mt-8 gap-0.5 place-items-center">
                {daysInMonth.map((day, idx) => {
                    return (
                    <div key={idx} className={`${colStartClasses[getDay(day)]} h-8 w-8 xl:h-8 xl:w-8`}>
                        <p
                        className={`cursor-pointer flex items-center justify-center text-[9.63px] xl:h-8 xl:w-8 h-8 w-8 rounded-full border-[0.7px] border-solid ${isSameMonth(day, today) ? "text-gray-900" : "text-gray-400"} ${isDays(no_color_days, idx, today) && "bg-[#38b260] border-[#38b260] text-white"} ${isToday(day) && "border-[0.7px] border-solid border-[#8a4ccd] text-[#8a4ccd] "}`}
                        >
                        {isDays(no_color_days, idx, today) ?
                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 12 12"
                            fill="none">
                                <g clip-path="url(#clip0_2109_680)">
                                <path d="M0.409454 5.88047C2.08172 7.68984 3.70313 9.31875 5.26172 11.3789C6.95625 8.00859 8.69063 4.62656 11.5523 0.963982L10.7813 0.610779C8.36485 3.17344 6.4875 5.59922 4.85625 8.48203C3.72188 7.46015 1.8886 6.01406 0.76922 5.27109L0.409454 5.88047Z"
                                    fill="white"/>
                                </g>
                                <defs>
                                <clipPath id="clip0_2109_680">
                                <rect width="12" height="12" fill="white"/>
                                </clipPath>
                                </defs>
                            </svg>
                            :
                            format(day, "d", {weekStartsOn: 1})
                         }
                        </p>
                    </div>
                    );
                })}
                </div>
            </div>
        </div>
    </>
    )
}