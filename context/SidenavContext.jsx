"use client"
import { createContext, useState } from "react"

export const SidenavContext = createContext()

export default function SidenavContextProvider({children}){
    const [open, setOpen] = useState(false)

    const toggle = () => {
        setOpen((prev) => !prev)
    }

    return <SidenavContext.Provider value={{open, toggle}}>
        {children}
    </SidenavContext.Provider>
}