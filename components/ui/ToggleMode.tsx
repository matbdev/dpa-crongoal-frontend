"use client"

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { LuMoon, LuSun } from 'react-icons/lu';

export default function ToggleMode() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Evitamos erro de "hydration mismatch" do React verificando se já montou
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <button className="p-2 opacity-0 cursor-default" aria-hidden="true">
                <LuSun size={20} />
            </button>
        );
    }

    const isDarkMode = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    return (
        <button
            onClick={() => setTheme(isDarkMode ? 'light' : 'dark')}
            className="p-2 rounded-md hover:bg-hover-sidebar transition-colors text-text-secondary hover:text-text-primary"
            title={isDarkMode ? "Mudar para modo claro" : "Mudar para modo escuro"}
        >
            {isDarkMode ? <LuSun size={20} /> : <LuMoon size={20} />}
        </button>
    )
}
