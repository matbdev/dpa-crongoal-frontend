"use client"

import { ReactNode } from "react"

interface ButtonProps {
    text: string,
    onClick: () => void,
    icon?: ReactNode
}

export default function SecondaryButton({ text, onClick, icon }: ButtonProps) {
    return (
        <button onClick={onClick} className="flex flex-row items-center justify-center gap-2 bg-secondary text-white px-4 py-2 rounded-md hover:bg-secondary/50 transition-colors">
            {icon}
            {text}
        </button>
    )
}