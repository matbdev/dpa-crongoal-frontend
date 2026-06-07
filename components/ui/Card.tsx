"use client"

import { ReactNode } from "react";

interface CardProps {
    children: ReactNode;
    className?: string;
}

export default function Card({ children, className = "" }: CardProps) {
    return (
        <div className={`bg-bg-sidebar border border-border-card rounded-xl overflow-hidden shadow-sm ${className}`}>
            {children}
        </div>
    );
}
