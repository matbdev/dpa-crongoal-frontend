import { ReactNode } from "react"

interface LabelProps {
    text: string,
    span?: ReactNode,
    htmlFor?: string
}

export default function Label({ text, span, htmlFor }: LabelProps) {
    return (
        <label htmlFor={htmlFor} className="text-sm font-semibold text-text-secondary">{text} {span}</label>
    )
}