"use client"
import Link from "next/link"

export default function AddAddress() {

    return (
        <div className="relative flex w-full flex-row items-center justify-center min-h-screen overflow-hidden bg-white">
			<div className="flex w-full md:w-1/2 flex-col pt-20 items-center justify-center min-h-screen bg-white">
                <div className="mx-10 p-6 w-2/4 lg:max-w-xl flex flex-row flex-nowrap justify-around items-center">
                    <div className="flex flex-col justify-center items-center">
                        <span className="[background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] rounded-full h-14 w-14 flex justify-center items-center text-bold text-white">1</span>
                        <span className="text-[#974af4] pt-2">Привязка</span>
                    </div>
                    <div className="flex flex-col justify-center items-center">
                        <span className="[background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)] rounded-full h-14 w-14 flex justify-center items-center text-bold text-white">2</span>
                        <span className="text-[#974af4] pt-2">Готово</span>
                    </div>
                </div>
                <div className="mx-10 p-6 w-full lg:max-w-xl">
                    <h1 className="text-3xl font-bold text-center text-black">Поздравляем!</h1>
                    <span className="block text-lg text-black text-center mt-6">Добро пожаловать в игру.</span>
                    <span className="block text-md text-gray-500 text-center mt-6">P.S. Добавьте сайт в закладки, чтобы не потерять.</span>
					<div className="flex mt-6 gap-x-2 justify-center items-center">
                        <Link
                            href="/personal/mygame"
                            className="px-4 py-2 tracking-wide text-white transition-colors duration-200 transform rounded-md [background:linear-gradient(3.73deg,_#7d27ec,_#bd7bff)] hover:shadow-[0px_15px_17px_-8px_rgba(64,_4,_236,_0.3)]"
                        >
                            На платформу
                        </Link>
                    </div>
                </div>
			</div>
		</div>
    )
}