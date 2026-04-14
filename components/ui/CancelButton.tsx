"use client"

import { ReactNode } from "react"

interface ButtonProps {
    text?: string,
    onClick: () => void,
    icon?: ReactNode,
    className?: string
}

export default function CancelButton({ text, onClick, icon, className }: ButtonProps) {
    return (
        <button onClick={onClick} className={`flex flex-row items-center justify-center gap-2 bg-danger text-white px-4 py-2 rounded-md hover:bg-red-500/50 transition-colors ${className}`}>
            {icon}
            {text}
        </button>
    )
}