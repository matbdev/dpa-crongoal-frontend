"use client"

import Link from "next/link";
import { ReactNode } from "react";
import { FcGoogle } from "react-icons/fc";

export type ButtonVariant = "primary" | "secondary" | "cancel" | "google" | "outline" | "ghost";

interface ButtonProps {
    text?: string;
    onClick?: () => void;
    icon?: ReactNode;
    href?: string;
    variant?: ButtonVariant;
    className?: string;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
}

export default function Button({
    text,
    onClick,
    icon,
    href,
    variant = "primary",
    className = "",
    type = "button",
    disabled = false
}: ButtonProps) {
    // Some sensible defaults so all variants share common positioning, flex layouts, typography text-sm
    const baseStyles = "flex flex-row items-center justify-center gap-2 px-4 py-2 rounded-md transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-bg-main";

    let variantStyles = "";

    switch (variant) {
        case "primary":
            variantStyles = "bg-surface text-white hover:bg-surface/50";
            break;
        case "secondary":
            variantStyles = "bg-secondary text-white hover:bg-secondary/50";
            break;
        case "cancel":
            variantStyles = "bg-danger text-white hover:bg-red-500/50";
            break;
        case "google":
            // Slightly taller padding for google button traditionally
            variantStyles = "w-full border shadow-sm bg-bg-sidebar border-border-card hover:bg-hover-sidebar";
            icon = icon || <FcGoogle size={22} />;
            if (!text && text !== "") text = "Continuar com o Google";
            break;
        case "outline":
            variantStyles = "border border-accent text-accent hover:bg-accent/20";
            break;
        case "ghost":
            variantStyles = "hover:bg-accent/10";
            break;
    }

    const combinedClasses = `${baseStyles} ${variantStyles} ${className}`.trim();

    if (href) {
        return (
            <Link href={href} className={combinedClasses} onClick={onClick}>
                {icon}
                {text && <span>{text}</span>}
            </Link>
        );
    }

    return (
        <button type={type} onClick={onClick} className={combinedClasses} disabled={disabled}>
            {icon}
            {text && <span>{text}</span>}
        </button>
    );
}
