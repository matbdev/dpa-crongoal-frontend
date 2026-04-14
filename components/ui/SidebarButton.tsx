import Link from "next/link";
import { MenuItem } from "../layout/Sidebar";

interface SidebarButtonProps {
    item: MenuItem;
    isCollapsed: boolean;
};

export default function SidebarButton({ item, isCollapsed }: SidebarButtonProps) {
    return (
        <Link href={item.href} className={`flex items-center rounded-md py-2 transition-all duration-300 ${isCollapsed ? "justify-center px-0" : "gap-2 px-2"} ${item.color || "hover:bg-hover-sidebar"}`}>
            <item.icon size={20} />
            <span className={`whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? "opacity-0 w-0" : "opacity-100 w-auto"}`}>{item.label}</span>
        </Link>
    )
}