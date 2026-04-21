"use client";

import PopUp from "@/components/layout/PopUp";
import GoogleLoginButton from "@/components/ui/GoogleLoginButton";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Link from "next/link";
import { useState } from "react";
import { LuLogIn, LuUserPlus } from "react-icons/lu";
import * as AuthService from "@/services/auth.service";
import PrimaryButton from "@/components/ui/PrimaryButton";
import toast from "react-hot-toast";

export default function LoginPage() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");

    const handleLoginChange = (value: string) => {
        setLogin(value);
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
    };

    const handleLogin = async () => {
        try {
            const { token } = await AuthService.login({
                email: login,
                password
            });

            localStorage.setItem("token", token);
            toast.success("Login realizado com sucesso!");

            window.location.href = "/dashboard";
        } catch (error: any) {
            const message = error.response?.data?.errors?.[0]?.message ||
                error.response?.data?.error ||
                "Erro ao realizar login";
            console.log(message);
            toast.error("Erro ao realizar login");
        }
    }

    return (
        <div>
            <PopUp title="Login do usuário" onClose={() => { }} content={
                <div className="flex flex-col gap-5">
                    <div>
                        <Label htmlFor="login-email" text="Email de cadastro" span={<span className="text-danger">*</span>} />
                        <Input required={true} id="login-email" placeholder="Informe o email de cadastro" value={login} onChange={handleLoginChange} />
                    </div>
                    <div>
                        <Label htmlFor="login-password" text="Senha de cadastro" span={<span className="text-danger">*</span>} />
                        <Input required={true} id="login-password" type="password" placeholder="Informe a senha de cadastro" value={password} onChange={handlePasswordChange} />
                    </div>
                    <div className="flex flex-row justify-between gap-3">
                        <Link
                            href="/register"
                            className="w-[25%] flex items-center border border-accent gap-2 px-4 py-2 rounded-lg text-sm font-medium text-accent hover:bg-accent/20 transition-colors"
                        >
                            <LuUserPlus size={20} />
                            Cadastrar
                        </Link>
                        <GoogleLoginButton href={AuthService.getGoogleAuthUrl()} />
                        <PrimaryButton onClick={handleLogin} text="Entrar" icon={<LuLogIn />} />
                    </div>
                </div>
            } />
        </div>
    );
}