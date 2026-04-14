"use client"

interface InputProps {
    placeholder?: string,
    value: string | number,
    onChange: (value: string) => void,
    type?: string,
    id?: string
}

export default function Input({ placeholder, value, onChange, type = "text", id }: InputProps) {
    return (
        <input
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-11 px-3.5 rounded-lg bg-bg-main border border-border-card text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-all"
        />
    )
}