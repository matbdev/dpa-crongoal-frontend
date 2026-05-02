"use client";

import { useState } from "react";
import LoginForm from "./LoginForm";
import { useRouter } from 'next/navigation';
import RegisterForm from "./RegisterForm";

interface AuthFormProps {
    initialMode?: "login" | "register";
}

export default function AuthContainer({ initialMode = "login" }: AuthFormProps) {
    const [mode, setMode] = useState<"login" | "register">(initialMode);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const isLogin = mode === "login";
    const toggleMode = () => {
        setMode(isLogin ? "register" : "login");
    };

    if (isLogin) {
        return <LoginForm setIsLoading={setIsLoading} router={router} isLoading={isLoading} toggleMode={toggleMode} />
    } else {
        return <RegisterForm setIsLoading={setIsLoading} router={router} isLoading={isLoading} toggleMode={toggleMode} />
    }
}