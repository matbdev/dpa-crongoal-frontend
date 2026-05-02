"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogOutPage() {
    const router = useRouter();

    useEffect(() => {
        localStorage.removeItem("token");
        router.push("/auth");
    }, [router]);

    return (
        <div className="flex h-screen w-full items-center justify-center bg-bg-main">
            <div className="flex flex-col items-center gap-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent"></div>
                <p className="text-text-secondary font-medium">Saindo...</p>
            </div>
        </div>
    );
}
