"use client"

import { LayoutDashboard, ListChecks, Target, Trophy, Settings, PanelLeftClose, PanelLeftOpen, User, LogOut } from "lucide-react";
import { useState } from "react";
import SidebarButton from "./SidebarButton";

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
            icon: LayoutDashboard,
        },
        {
            label: "Tarefas",
            href: "/tasks",
            icon: ListChecks,
        },
        {
            label: "Projetos",
            href: "/projects",
            icon: Target,
        },
        {
            label: "Rotinas",
            href: "/routines",
            icon: Trophy,
        },
        {
            label: "Configurações",
            href: "/settings",
            icon: Settings,
        },
        {
            label: "Perfil",
            href: "/profile",
            icon: User,
        },
        {
            label: "Sair",
            href: "/logout",
            icon: LogOut,
            color: "hover:bg-danger/70"
        },
    ];
    return (
        <aside className={`flex flex-col h-full bg-bg-sidebar border-r border-border transition-all duration-300 overflow-hidden ${isCollapsed ? "w-16" : "w-48"}`}>

            {/* Sidebar header */}
            <div className={`py-4 flex items-center ${isCollapsed ? "px-2 justify-center" : "px-4 justify-between"}`}>
                <h1 className={`text-xl font-bold whitespace-nowrap transition-all duration-300 ${isCollapsed ? "opacity-0 scale-0 w-0" : "opacity-100 scale-100"}`}>CronGoal</h1>
                <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 hover:bg-hover-sidebar rounded transition-colors">
                    {isCollapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
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