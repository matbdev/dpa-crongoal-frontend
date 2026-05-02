import { ReactNode } from "react";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";

interface DashboardCardProps {
    title: string;
    value: string | number;
    icon: ReactNode;
    colorClass: string;
    href?: string;
}

export default function DashboardCard({ title, value, icon, colorClass, href }: DashboardCardProps) {
    const cardContent = (
        <div className={`flex flex-col gap-4 p-6 rounded-2xl border border-border-card bg-bg-card transition-all hover:shadow-md hover:scale-105`}>
            <div className="flex flex-row items-center justify-between">
                <div className={`p-3 rounded-xl ${colorClass}`}>
                    {icon}
                </div>
                {href && (
                    <Link href={href}>
                        <LuChevronRight className="w-6 h-6 text-text-secondary hover:scale-110 hover:cursor-pointer hover:text-text-primary" />
                    </Link>
                )}
            </div>

            <div className="flex flex-col gap-1 mt-2">
                <h3 className="text-3xl font-bold text-text-primary">{value}</h3>
                <span className="text-sm font-medium text-text-secondary">{title}</span>
            </div>
        </div>
    );

    return cardContent;
}