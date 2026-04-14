"use client"

import { useState } from "react";
import SidebarButton from "../ui/SidebarButton";
import { LuLayoutDashboard, LuListChecks, LuLogOut, LuPanelLeftClose, LuPanelLeftOpen, LuSettings, LuTarget, LuTrophy, LuUser } from "react-icons/lu";
import { FaAward } from "react-icons/fa";

export interface MenuItem {
    label: string;
    href: string;
    icon: React.ComponentType<{ size?: number }>;
    color?: string;
}

export default function Sidebar() {
    const [activeItem, setActiveItem] = useState("dashboard");
    const [isCollapsed, setIsCollapsed] = useState(false);

    const menuItems: MenuItem[] = [
        {
            label: "Dashboard",
            href: "/dashboard",
            icon: LuLayoutDashboard,
        },
        {
            label: "Tarefas",
            href: "/tasks",
            icon: LuListChecks,
        },
        {
            label: "Projetos",
            href: "/projects",
            icon: LuTarget,
        },
        {
            label: "Rotinas",
            href: "/routines",
            icon: LuTrophy,
        },
        {
            label: "Recompensas",
            href: "/rewards",
            icon: FaAward,
        },
        {
            label: "Configurações",
            href: "/settings",
            icon: LuSettings,
        },
        {
            label: "Perfil",
            href: "/profile",
            icon: LuUser,
        },
        {
            label: "Sair",
            href: "/logout",
            icon: LuLogOut,
            color: "hover:bg-danger/70"
        },
    ];
    return (
        <aside className={`flex flex-col h-full bg-bg-sidebar border-r border-border transition-all duration-300 overflow-hidden ${isCollapsed ? "w-16" : "w-48"}`}>

            {/* Sidebar header */}
            <div className={`py-4 flex items-center ${isCollapsed ? "px-2 justify-center" : "px-4 justify-between"}`}>
                <h1 className={`text-xl font-bold whitespace-nowrap transition-all duration-300 ${isCollapsed ? "opacity-0 scale-0 w-0" : "opacity-100 scale-100"}`}>CronGoal</h1>
                <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 hover:bg-hover-sidebar rounded transition-colors">
                    {isCollapsed ? <LuPanelLeftOpen size={20} /> : <LuPanelLeftClose size={20} />}
                </button>
            </div>

            {/* Sidebar items */}
            <nav className="p-2">
                <ul>
                    {menuItems.slice(0, -3).map((item) => (
                        <li key={item.label}>
                            <SidebarButton item={item} isCollapsed={isCollapsed} />
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Sidebar footer */}
            <div className="p-2 mt-auto">
                <ul>
                    {menuItems.slice(-3).map((item) => (
                        <li key={item.label}>
                            <SidebarButton item={item} isCollapsed={isCollapsed} />
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    )
}