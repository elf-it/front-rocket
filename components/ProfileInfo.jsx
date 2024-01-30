import Image from "next/image"

export default function ProfileInfo(){
    return(
        <div class="bg-white p-[24px] md:p-[32px] rounded-xl w-full">
            <ul class="flex px-[16px] mx-[-24px] md:mx-[-5px] overflow-auto">
                <li class="px-[5px]">
                    <a href="#" class="whitespace-nowrap rounded-md bg-zinc-900 min-w-[140px] px-[20px] h-[38px] inline-flex justify-center items-center text-center text-white text-xs font-semibold">Личные данные</a>
                </li>
                <li class="px-[5px]">
                    <a href="#" class="whitespace-nowrap opacity-50 transition-opacity hover:opacity-100 rounded-md border border-zinc-900 min-w-[140px] px-[20px] h-[38px] inline-flex justify-center items-center text-zinc-900 text-xs font-semibold">Пароль</a>
                </li>
                <li class="px-[5px]">
                    <a href="#" class="whitespace-nowrap opacity-50 transition-opacity hover:opacity-100 rounded-md border border-zinc-900 min-w-[140px] px-[20px] h-[38px] inline-flex justify-center items-center text-zinc-900 text-xs font-semibold">Привязка кошелька</a>
                </li>
                <li class="px-[5px]">
                    <a href="#" class="whitespace-nowrap opacity-50 transition-opacity hover:opacity-100 rounded-md border border-zinc-900 min-w-[140px] px-[20px] h-[38px] inline-flex justify-center items-center text-zinc-900 text-xs font-semibold">Телеграм-бот</a>
                </li>
            </ul>
            <div style={{display: "block"}} class="mt-[30px] md:mt-[50px]">
                <div class="pb-[40px] md:pb-[60px] border-b border-b-gray-200">
                    <h2 class="text-zinc-900 text-xl font-bold">Основная информация</h2>
                    <div class="max-w-full w-full md:max-w-[575px] mt-[20px] md:mt-[40px]">
                        <div>
                            <label class="flex flex-wrap items-center">
                                <span class="inline-flex w-full md:w-[195px] text-slate-900 text-sm font-semibold">Имя</span>
                                <input type="text" placeholder="Введите текст" class="outline-0 mt-[6px] md:mt-0 px-[22px] w-full md:w-[calc(100%-195px)] h-10 md:h-12 bg-white rounded-md border border-gray-200 text-indigo-950 text-sm font-normal placeholder:opacity-50" />
                            </label>
                        </div>
                        <div class="mt-[12px]">
                            <label class="flex flex-wrap items-center">
                                <span class="inline-flex w-full md:w-[195px] text-slate-900 text-sm font-semibold">Фамилия</span>
                                <input type="text" placeholder="Введите текст" class="outline-0 mt-[6px] md:mt-0 px-[22px] w-full md:w-[calc(100%-195px)] h-10 md:h-12 bg-white rounded-md border border-gray-200 text-indigo-950 text-sm font-normal placeholder:opacity-50" />
                            </label>
                        </div>
                        <div class="mt-[12px]">
                            <label class="flex flex-wrap items-center">
                                <span class="inline-flex w-full md:w-[195px] text-slate-900 text-sm font-semibold">Логин:</span>
                                <input type="text" placeholder="Введите текст" class="outline-0 mt-[6px] md:mt-0 px-[22px] w-full md:w-[calc(100%-195px)] h-10 md:h-12 bg-white rounded-md border border-gray-200 text-indigo-950 text-sm font-normal placeholder:opacity-50" />
                            </label>
                        </div>
                        <div class="mt-[12px]">
                            <label class="flex flex-wrap items-center">
                                <span class="inline-flex w-full md:w-[195px] text-slate-900 text-sm font-semibold">День рождения:</span>
                                <input type="date" class="outline-0 mt-[6px] md:mt-0 px-[22px] w-full md:w-[calc(100%-195px)] h-10 md:h-12 bg-white rounded-md border border-gray-200 text-indigo-950 text-sm font-normal placeholder:opacity-50 bg-[url('/calendar.svg')] bg-no-repeat bg-[calc(100%-20px)]" />
                            </label>
                        </div>
                    </div>
                </div>

                <div class="pb-[40px] md:pb-[60px] border-b border-b-gray-200 mt-[30px] md:mt-[40px]">
                    <h2 class="text-zinc-900 text-xl font-bold">Фотография</h2>
                    <div class="mt-[32px] flex">
                        <div class="w-[210px]">
                            <div class="w-full h-[210px] border-dashed rounded-[20px] border border-purple-500 flex items-center justify-center">
                                <span class="text-purple-500 text-xs font-semibold">Загрузить фотографию</span>
                                <span class="ml-[5px]">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M18.4546 17.1421C18.4546 17.1421 17.878 17.7188 17.0625 17.7188H3.9375C3.9375 17.7188 3.12202 17.7188 2.54538 17.1421C2.54538 17.1421 1.96875 16.5655 1.96875 15.75V6.5625C1.96875 6.5625 1.96875 5.74702 2.54538 5.17038C2.54538 5.17038 3.12202 4.59375 3.9375 4.59375H6.21129L7.32897 2.91723C7.45068 2.73466 7.65558 2.625 7.875 2.625H13.125C13.3444 2.625 13.5493 2.73466 13.671 2.91723L14.7887 4.59375H17.0625C17.0625 4.59375 17.878 4.59375 18.4546 5.17038C18.4546 5.17038 19.0312 5.74702 19.0312 6.5625V15.75C19.0312 15.75 19.0312 16.5655 18.4546 17.1421ZM17.5265 16.214C17.5265 16.214 17.7188 16.0218 17.7188 15.75V6.5625C17.7188 6.5625 17.7188 6.29067 17.5265 6.09846C17.5265 6.09846 17.3343 5.90625 17.0625 5.90625H14.4375C14.2181 5.90625 14.0132 5.79659 13.8915 5.61402L12.7738 3.9375H8.22621L7.10853 5.61402C6.98682 5.79659 6.78192 5.90625 6.5625 5.90625H3.9375C3.9375 5.90625 3.66567 5.90625 3.47346 6.09846C3.47346 6.09846 3.28125 6.29067 3.28125 6.5625V15.75C3.28125 15.75 3.28125 16.0218 3.47346 16.214C3.47346 16.214 3.66567 16.4062 3.9375 16.4062H17.0625C17.0625 16.4062 17.3343 16.4062 17.5265 16.214Z" fill="#974AF4"/>
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 7.21875C10.5 7.21875 11.9951 7.21875 13.0522 8.27591C13.0522 8.27591 14.1094 9.33307 14.1094 10.8281C14.1094 10.8281 14.1094 12.3232 13.0522 13.3803C13.0522 13.3803 11.9951 14.4375 10.5 14.4375C10.5 14.4375 9.00495 14.4375 7.94779 13.3803C7.94779 13.3803 6.89062 12.3232 6.89062 10.8281C6.89062 10.8281 6.89062 9.33307 7.94779 8.27591C7.94779 8.27591 9.00495 7.21875 10.5 7.21875ZM10.5 8.53125C10.5 8.53125 9.5486 8.53125 8.87586 9.20399C8.87586 9.20399 8.20312 9.87673 8.20312 10.8281C8.20312 10.8281 8.20312 11.7795 8.87586 12.4523C8.87586 12.4523 9.5486 13.125 10.5 13.125C10.5 13.125 11.4514 13.125 12.1241 12.4523C12.1241 12.4523 12.7969 11.7795 12.7969 10.8281C12.7969 10.8281 12.7969 9.87673 12.1241 9.20399C12.1241 9.20399 11.4514 8.53125 10.5 8.53125Z" fill="#974AF4"/>
                                    </svg>
                                </span>
                            </div>
                            <div class="opacity-40 text-center text-indigo-950 text-xs font-normal mt-[15px]">
                                Перетащите изображение в это поле или воспользуйтесь кнопкой загрузки
                            </div>
                        </div>
                        <div class="flex flex-col ml-[25px] mt-[35px]">
                            <a href="#" class="transition-transform hover:scale-0 md:hover:scale-[1.1] w-10 h-10 bg-white rounded-lg shadow border border-neutral-100 inline-flex justify-center items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M3.75 17.4999H7.24116L7.24219 17.4999C7.24219 17.4999 7.48843 17.5004 7.71629 17.4068C7.71629 17.4068 7.94515 17.3128 8.12054 17.1383L17.4966 7.76219C17.4966 7.76219 17.6722 7.58934 17.7692 7.3577C17.7692 7.3577 17.8661 7.12606 17.8661 6.87493C17.8661 6.87493 17.8661 6.62381 17.7692 6.39216C17.7692 6.39216 17.6722 6.16052 17.4932 5.98431L14.0123 2.5033C14.0123 2.5033 13.8394 2.32777 13.6078 2.23078C13.6078 2.23078 13.3761 2.13379 13.125 2.13379C13.125 2.13379 12.8739 2.13379 12.6422 2.23078C12.6422 2.23078 12.4106 2.32777 12.2344 2.5067L2.86275 11.8783C2.86275 11.8783 2.68714 12.0548 2.59314 12.2836C2.59314 12.2836 2.49914 12.5125 2.50001 12.7599L2.5 16.2499C2.5 16.2499 2.5 16.7677 2.86612 17.1338C2.86612 17.1338 3.23224 17.4999 3.75 17.4999ZM16.6127 6.8783L7.24112 16.2499H3.75L3.75 12.7588L13.125 3.38379L13.1284 3.38719L16.6161 6.87493L16.6127 6.8783Z" fill="#060B39"/>
                                    <path d="M14.5577 9.81662C14.6749 9.93383 14.8342 10 15 10C15.1658 10 15.3247 9.93415 15.4419 9.81694C15.5591 9.69973 15.625 9.54076 15.625 9.375C15.625 9.20924 15.5591 9.05027 15.4419 8.93306L11.067 4.55813C10.9497 4.44085 10.7908 4.375 10.625 4.375C10.4592 4.375 10.3003 4.44085 10.1831 4.55806C10.0658 4.67527 10 4.83424 10 5C10 5.16576 10.0658 5.32473 10.1831 5.44194L14.5577 9.81662Z" fill="#060B39"/>
                                </svg>
                            </a>
                            <a href="#" class="transition-transform hover:scale-0 md:hover:scale-[1.1] mt-[10px] w-10 h-10 bg-white rounded-lg shadow border border-neutral-100 inline-flex justify-center items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M12.839 6.84787L12.8393 6.84819C12.9565 6.9654 13.1155 7.03125 13.2812 7.03125C13.447 7.03125 13.606 6.9654 13.7232 6.84819C13.8404 6.73098 13.9062 6.57201 13.9062 6.40625C13.9062 6.24049 13.8404 6.08152 13.7232 5.96431L10.4419 2.68306C10.3247 2.56585 10.1658 2.5 10 2.5C9.83424 2.5 9.67527 2.56585 9.55806 2.68306L6.27704 5.96407L6.27681 5.96431C6.1596 6.08152 6.09375 6.24049 6.09375 6.40625C6.09375 6.41626 6.09399 6.42627 6.09447 6.43627C6.10194 6.59147 6.16694 6.73832 6.27681 6.84819C6.39402 6.9654 6.55299 7.03125 6.71875 7.03125C6.88451 7.03125 7.04348 6.9654 7.16069 6.84819L7.16093 6.84796L10 4.00888L12.839 6.84787Z" fill="#060B39"/>
                                    <path d="M10.625 11.875V3.125C10.625 2.77982 10.3452 2.5 10 2.5C9.65482 2.5 9.375 2.77982 9.375 3.125V11.875C9.375 12.2202 9.65482 12.5 10 12.5C10.3452 12.5 10.625 12.2202 10.625 11.875Z" fill="#1C1C1C"/>
                                    <path d="M3.75 16.25V11.875C3.75 11.5298 3.47018 11.25 3.125 11.25C2.77982 11.25 2.5 11.5298 2.5 11.875V16.25C2.5 16.7678 2.86612 17.1339 2.86612 17.1339C3.23223 17.5 3.75 17.5 3.75 17.5H16.25C16.7678 17.5 17.1339 17.1339 17.1339 17.1339C17.5 16.7678 17.5 16.25 17.5 16.25V11.875C17.5 11.5298 17.2202 11.25 16.875 11.25C16.5298 11.25 16.25 11.5298 16.25 11.875V16.25H3.75Z" fill="#1C1C1C"/>
                                </svg>
                            </a>
                            <a href="#" class="transition-transform hover:scale-0 md:hover:scale-[1.1] mt-[10px] w-10 h-10 bg-white rounded-lg shadow border border-neutral-100 inline-flex justify-center items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M16.875 3.75H3.125C2.77982 3.75 2.5 4.02982 2.5 4.375C2.5 4.72018 2.77982 5 3.125 5H16.875C17.2202 5 17.5 4.72018 17.5 4.375C17.5 4.02982 17.2202 3.75 16.875 3.75Z" fill="#060B39"/>
                                    <path d="M6.875 2.5H13.125C13.4702 2.5 13.75 2.22018 13.75 1.875C13.75 1.52982 13.4702 1.25 13.125 1.25H6.875C6.52982 1.25 6.25 1.52982 6.25 1.875C6.25 2.22018 6.52982 2.5 6.875 2.5Z" fill="#060B39"/>
                                    <path d="M5 16.25V4.375C5 4.02982 4.72018 3.75 4.375 3.75C4.02982 3.75 3.75 4.02982 3.75 4.375V16.25C3.75 16.7678 4.11612 17.1339 4.11612 17.1339C4.48223 17.5 5 17.5 5 17.5H15C15.5178 17.5 15.8839 17.1339 15.8839 17.1339C16.25 16.7678 16.25 16.25 16.25 16.25V4.375C16.25 4.02982 15.9702 3.75 15.625 3.75C15.2798 3.75 15 4.02982 15 4.375V16.25H5Z" fill="#060B39"/>
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>

                <div class="pb-[40px] md:pb-[60px] border-b border-b-gray-200 mt-[30px] md:mt-[40px]">
                    <h2 class="text-zinc-900 text-xl font-bold">Контакты</h2>
                    <div class="max-w-[575px] mt-[20px] md:mt-[40px]">
                        <div class="relative">
                            <label class="flex flex-wrap items-center">
                                <span class="inline-flex w-full md:w-[195px] text-slate-900 text-sm font-semibold">Email</span>
                                <input type="text" placeholder="Введите текст" readonly value="123@ya.ru" class="outline-0 mt-[6px] md:mt-0 px-[22px] w-[calc(100%-55px)] md:w-[calc(100%-195px)] h-10 md:h-12 bg-gradient-to-b from-neutral-100 to-zinc-100 rounded-md border border-gray-200 text-indigo-950 text-sm font-normal placeholder:opacity-50" />
                            </label>
                            <a href="#" class="transition-transform hover:scale-0 md:hover:scale-[1.04] absolute right-0 bottom-0 md:left-[calc(100%+10px)] md:top-0 w-12 h-10 md:h-12 bg-white rounded-[9.60px] shadow border border-neutral-100 inline-flex justify-center items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="25" viewBox="0 0 24 25" fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.5 21.8H8.6894L8.69063 21.8C8.69063 21.8 8.98612 21.8005 9.25954 21.6882C9.25954 21.6882 9.53418 21.5754 9.74464 21.366L20.996 10.1147C20.996 10.1147 21.2066 9.90726 21.323 9.62929C21.323 9.62929 21.4394 9.35132 21.4394 9.04997C21.4394 9.04997 21.4394 8.74862 21.323 8.47064C21.323 8.47064 21.2066 8.19267 20.9919 7.98122L16.8147 3.80401C16.8147 3.80401 16.6073 3.59337 16.3293 3.47698C16.3293 3.47698 16.0514 3.3606 15.75 3.3606C15.75 3.3606 15.4487 3.3606 15.1707 3.47698C15.1707 3.47698 14.8927 3.59337 14.6813 3.80809L3.4353 15.054C3.4353 15.054 3.22457 15.2658 3.11177 15.5404C3.11177 15.5404 2.99897 15.8151 3.00001 16.112L3 20.3C3 20.3 3 20.9213 3.43934 21.3606C3.43934 21.3606 3.87868 21.8 4.5 21.8ZM19.9353 9.05401L8.68935 20.3H4.5L4.5 16.1106L15.75 4.8606L15.754 4.86467L19.9394 9.04997L19.9353 9.05401Z" fill="#060B39"/>
                                    <path d="M17.4693 12.58C17.6099 12.7206 17.8011 12.8 18 12.8C18.1989 12.8 18.3897 12.721 18.5303 12.5804C18.671 12.4397 18.75 12.249 18.75 12.05C18.75 11.8511 18.671 11.6604 18.5303 11.5197L13.2804 6.26981C13.1397 6.12907 12.9489 6.05005 12.75 6.05005C12.5511 6.05005 12.3603 6.12907 12.2197 6.26972C12.079 6.41037 12 6.60114 12 6.80005C12 6.99896 12.079 7.18973 12.2197 7.33038L17.4693 12.58Z" fill="#060B39"/>
                                </svg>
                            </a>
                        </div>
                        <div class="mt-[12px]">
                            <label class="flex flex-wrap items-center">
                                <span class="inline-flex w-full md:w-[195px] text-slate-900 text-sm font-semibold">Телефон:</span>
                                <input type="text" placeholder="Введите текст" class="outline-0 mt-[6px] md:mt-0 px-[22px] w-full md:w-[calc(100%-195px)] h-10 md:h-12 bg-white rounded-md border border-gray-200 text-indigo-950 text-sm font-normal placeholder:opacity-50" />
                            </label>
                        </div>
                    </div>
                </div>

                <div class="mt-[30px] md:mt-[40px]">
                    <h2 class="text-zinc-900 text-xl font-bold">Наставник</h2>
                    <div class="max-w-[575px] mt-[20px] md:mt-[40px]">
                        <div>
                            <label class="flex flex-wrap items-center">
                                <span class="inline-flex w-full md:w-[195px] text-slate-900 text-sm font-semibold">Имя:</span>
                                <input type="text" placeholder="Введите текст" class="outline-0 mt-[6px] md:mt-0 px-[22px] w-full md:w-[calc(100%-195px)] h-10 md:h-12 bg-white rounded-md border border-gray-200 text-indigo-950 text-sm font-normal placeholder:opacity-50" />
                            </label>
                        </div>
                        <div class="mt-[12px]">
                            <label class="flex flex-wrap items-center">
                                <span class="inline-flex w-full md:w-[195px] text-slate-900 text-sm font-semibold">Фамилия:</span>
                                <input type="text" placeholder="Введите текст" class="outline-0 mt-[6px] md:mt-0 px-[22px] w-full md:w-[calc(100%-195px)] h-10 md:h-12 bg-white rounded-md border border-gray-200 text-indigo-950 text-sm font-normal placeholder:opacity-50" />
                            </label>
                        </div>
                    </div>
                </div>

                <div class="mt-[30px] md:mt-[50px]">
                    <a href="#" class="transition-opacity hover:opacity-100 md:hover:opacity-90 w-full md:w-auto px-[35px] h-[46px] bg-gradient-to-t from-violet-600 to-purple-400 rounded-md shadow inline-flex justify-center items-center text-white text-xs font-semibold">Сохранить</a>
                </div>
            </div>
            <div style={{display: "none"}} class="mt-[30px] md:mt-[50px]">
                <div class="">
                    <h2 class="text-zinc-900 text-xl font-bold">Пароль</h2>
                    <div class="max-w-[575px] mt-[20px] md:mt-[40px]">
                        <div>
                            <label class="flex flex-wrap items-center">
                                <span class="inline-flex w-full md:w-[195px] text-slate-900 text-sm font-semibold pr-[10px]">Введите текущий пароль:</span>
                                <input type="text" placeholder="Введите пароль" class="outline-0 mt-[6px] md:mt-0 px-[22px] w-full md:w-[calc(100%-195px)] h-10 md:h-12 bg-white rounded-md border border-gray-200 text-indigo-950 text-sm font-normal placeholder:opacity-50" />
                            </label>
                        </div>
                        <div class="mt-[12px]">
                            <label class="flex flex-wrap items-center">
                                <span class="inline-flex w-full md:w-[195px] text-slate-900 text-sm font-semibold pr-[10px]">Введите новый пароль:</span>
                                <input type="text" placeholder="Введите пароль" class="outline-0 mt-[6px] md:mt-0 px-[22px] w-full md:w-[calc(100%-195px)] h-10 md:h-12 bg-white rounded-md border border-gray-200 text-indigo-950 text-sm font-normal placeholder:opacity-50" />
                            </label>
                        </div>
                        <div class="mt-[12px]">
                            <label class="flex flex-wrap items-center">
                                <span class="inline-flex w-full md:w-[195px] text-slate-900 text-sm font-semibold pr-[10px]">Введите новый пароль еще раз:</span>
                                <input type="text" placeholder="Введите пароль" class="outline-0 mt-[6px] md:mt-0 px-[22px] w-full md:w-[calc(100%-195px)] h-10 md:h-12 bg-white rounded-md border border-gray-200 text-indigo-950 text-sm font-normal placeholder:opacity-50" />
                            </label>
                        </div>
                    </div>
                </div>

                <div class="mt-[30px] md:mt-[50px]">
                    <a href="#" class="transition-opacity hover:opacity-100 md:hover:opacity-90 w-full md:w-auto px-[35px] h-[46px] bg-gradient-to-t from-violet-600 to-purple-400 rounded-md shadow inline-flex justify-center items-center text-white text-xs font-semibold">Сохранить</a>
                </div>
            </div>
            <div style={{display: "none"}} class="mt-[30px] md:mt-[50px]">
                <div class="">
                    <h2 class="text-zinc-900 text-xl font-bold">Привязка кошелька</h2>
                    <div class="mt-[24px]">
                        <p class="text-indigo-950 text-sm font-normal  mb-0">
                            Поздравляем! Вы зарегистрировались.
                        </p>
                        <p class="text-indigo-950 text-sm font-normal  mt-[15px] mb-0">
                            Теперь необходимо подключить MetaMask кошелек к Вашему аккаунту.<br />
                            Ознакомьтесь с <a href="#" class="text-purple-500 text-sm font-bold">инструкцией</a> по привязке кошелька к Вашему аккаунту
                        </p>
                        <p class="text-indigo-950 text-sm font-normal mt-[24px] mb-0">
                            Если у вас не установлен MetaMask ознакомьтесь с <a href="#" class="text-purple-500 text-sm font-bold">инструкцией</a> по установке MetaMask
                            <Image class="inline-flex" src="/metamask-icon.png" alt="Rocket" />
                        </p>
                    </div>
                    <div class="max-w-[575px] mt-[40px]">
                        <div>
                            <label class="flex flex-wrap items-center">
                                <span class="inline-flex w-full md:w-[195px] text-slate-900 text-sm font-semibold pr-[10px]">Кошелек:</span>
                                <input type="text" placeholder="Введите текст" value="987vbjklko7908765yusjklsla;90877890" readonly class="outline-0 mt-[6px] md:mt-0 bg-gradient-to-b from-neutral-100 to-zinc-100 px-[22px] w-full md:w-[calc(100%-195px)] h-10 md:h-12 bg-white rounded-md border border-gray-200 text-indigo-950 text-sm font-normal placeholder:opacity-50" />
                            </label>
                        </div>
                    </div>
                </div>

                <div class="mt-[30px] md:mt-[50px]">
                    <a href="#" class="transition-opacity hover:opacity-100 md:hover:opacity-90 w-full md:w-auto px-[35px] h-[46px] bg-gradient-to-t from-violet-600 to-purple-400 rounded-md shadow inline-flex justify-center items-center text-white text-xs font-semibold">Сохранить</a>
                </div>
            </div>
            <div style={{display: "none"}} class="mt-[30px] md:mt-[50px]">
                <div class="">
                    <h2 class="text-zinc-900 text-xl font-bold">Телеграм-бот</h2>
                    <div class="mt-[20px] md:mt-[40px]">
                        <div class="min-w-[240px] max-w-[350px] md:max-w-none w-full md:w-auto bg-white rounded-xl border border-black border-opacity-10 p-[18px] md:p-[24px] inline-flex items-center flex-wrap">
                            <Image src="/tg.svg" alt="Telegram" class="max-w-[80px] md:max-w-none" />
                            <a href="#" class="transition-opacity md:hover:opacity-90 ml-auto md:ml-[120px] inline-flex items-center justify-center px-[14px] md:px-[20px] min-w-0 md:min-w-[132px] h-[36px] md:h-[46px] bg-gradient-to-t from-violet-600 to-purple-400 rounded-md shadow text-white text-xs font-semibold hover:opacity-90">Подписаться</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}