"use client";

import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import { PointsProvider } from "@/contexts/PointsContext";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PointsProvider>
            <div className="flex h-screen">
                <Sidebar />
                <div className="flex flex-col flex-1 overflow-hidden">
                    <Navbar showLogin={false} showRegister={false} showUserPoints={true} />
                    <main className="flex-1 overflow-y-auto">
                        {children}
                    </main>
                </div>
            </div>
        </PointsProvider>
    );
};