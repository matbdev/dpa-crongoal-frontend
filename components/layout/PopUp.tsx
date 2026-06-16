"use client";

import { LuX } from "react-icons/lu"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

interface PopUpProps {
    title: string,
    content: React.ReactNode,
    onClose: () => void
}

export default function PopUp({ title, content, onClose }: PopUpProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null;

    const modal = (
        <div onClick={(e) => e.stopPropagation()} className="fixed z-100 inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="min-h-72 min-w-96 max-w-xl w-full flex flex-col shadow-2xl rounded-lg overflow-hidden border border-border-card">
                <div className="bg-bg-sidebar px-6 py-4 flex flex-row justify-between items-center border-b border-border-card">
                    <h2 className="font-bold text-lg">{title}</h2>
                    <button type="button" className="p-1 rounded-md text-text-secondary hover:text-accent hover:bg-hover-sidebar transition-colors" onClick={onClose}>
                        <LuX size={20} />
                    </button>
                </div>
                <div className="bg-bg-main p-6 flex-1">
                    {content}
                </div>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
}