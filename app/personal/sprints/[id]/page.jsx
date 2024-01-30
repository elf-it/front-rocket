"use client"
import SprintInfo from '@/components/SprintInfo'
import { usePathname } from 'next/navigation'

export default function SprintsId(params) {
    return(<SprintInfo params={params} />)
}