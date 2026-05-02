"use client"
import React, { forwardRef } from "react"

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    error?: string;
    onChange?: (value: string) => void;
    onRHFChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ error, onChange, onRHFChange, className = "", ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onRHFChange) onRHFChange(e);
        if (onChange) onChange(e.target.value);
    }

    return (
        <div className="flex flex-col w-full data-[error=true]:gap-1">
            <input
                ref={ref}
                onChange={handleChange}
                className={`w-full h-11 px-3.5 rounded-lg bg-bg-main border ${error ? 'border-danger focus:ring-danger focus:border-danger' : 'border-border-card focus:border-accent focus:ring-accent'} text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-1 transition-all ${className}`}
                {...props}
            />
            {error && <span className="text-danger text-xs mt-0.5 ml-1">{error}</span>}
        </div>
    )
})

Input.displayName = "Input"
export default Input