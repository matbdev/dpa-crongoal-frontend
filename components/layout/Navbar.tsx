"use client"

import { FaGithub } from "react-icons/fa";
import { LuLogIn, LuUserPlus, LuCoins } from "react-icons/lu";
import ToggleMode from "../ui/ToggleMode";
import Link from "next/link";
import { getProfile } from "../../services/user.service";
import { useEffect, useState } from "react";

interface NavbarProps {
    showLogin?: boolean;
    showRegister?: boolean;
    showUserPoints?: boolean;
}

export default function Navbar({ showLogin = true, showRegister = true, showUserPoints = false }: NavbarProps) {
    const showAuthButtons = showLogin || showRegister;
    const [points, setPoints] = useState<number | null>(null);

    useEffect(() => {
        if (showUserPoints) {
            getProfile().then((user) => setPoints(user.pointsBalance ?? 0)).catch(() => { });
        }
    }, [showUserPoints]);

    return (
        <nav className="flex sticky top-0 z-10 flex-row items-center justify-between px-6 py-3 border-b border-border-card bg-bg-card/50 backdrop-blur-sm">
            {/* Logo / Nome — só mostra quando tem botões de auth (tela de deslogado) */}
            {showAuthButtons ? (
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="text-lg font-bold tracking-tight text-text-primary group-hover:text-accent transition-colors">
                        CronGoal
                    </span>
                </Link>
            ) : (
                <div />
            )}

            {/* Ações à direita */}
            <div className="flex flex-row items-center gap-1">
                {showUserPoints && points !== null && (
                    <div className="flex flex-row items-center gap-1.5 px-3 py-1.5 rounded-lg bg-warning/10 text-warning font-semibold text-sm">
                        <LuCoins size={16} />
                        <span>{points} pts</span>
                    </div>
                )}

                <ToggleMode />

                <Link
                    href="https://github.com/matbdev"
                    target="_blank"
                    className="p-2 rounded-md hover:bg-hover-sidebar transition-colors text-text-secondary hover:text-text-primary"
                    title="GitHub"
                >
                    <FaGithub size={20} />
                </Link>

                {showAuthButtons && (
                    <>
                        <div className="w-px h-5 bg-border-card mx-2" />

                        {showLogin && (
                            <Link
                                href="/auth"
                                className="flex items-center border border-accent gap-2 px-4 py-2 rounded-lg text-sm font-medium text-accent hover:bg-accent/20 transition-colors"
                            >
                                <LuLogIn size={16} />
                                Entrar
                            </Link>
                        )}

                        {showRegister && (
                            <Link
                                href="/auth?mode=register"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white bg-accent hover:bg-accent/90 transition-colors"
                            >
                                <LuUserPlus size={16} />
                                Criar Conta
                            </Link>
                        )}
                    </>
                )}
            </div>
        </nav>
    )
}