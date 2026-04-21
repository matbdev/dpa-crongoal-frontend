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

export default function RegisterPage() {
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [displayName, setDisplayName] = useState("");

    const handleFullNameChange = (value: string) => {
        setFullName(value);
    };

    const handleDisplayNameChange = (value: string) => {
        setDisplayName(value);
    };

    const handleLoginChange = (value: string) => {
        setLogin(value);
    };

    const handlePasswordChange = (value: string) => {
        setPassword(value);
    };

    const handleRegister = async () => {
        try {
            const { token } = await AuthService.register({
                email: login,
                password,
                fullName,
                displayName
            });

            localStorage.setItem("token", token);
            toast.success("Cadastro realizado com sucesso!");

            window.location.href = "/dashboard";
        } catch (error: any) {
            const message = error.response?.data?.errors?.[0]?.message ||
                error.response?.data?.error ||
                "Erro ao realizar cadastro";
            console.log(message);
            toast.error("Erro ao realizar login");
        }
    }

    return (
        <div>
            <PopUp title="Cadastro do usuário" onClose={() => { }} content={
                <div className="flex flex-col gap-5">
                    <div className="flex flex-row gap-3">
                        <div className="w-[70%]">
                            <Label htmlFor="register-full-name" text="Nome completo" span={<span className="text-danger">*</span>} />
                            <Input required={true} id="register-full-name" placeholder="Informe seu nome completo" value={fullName} onChange={handleFullNameChange} />
                        </div>
                        <div className="flex-1">
                            <Label htmlFor="register-display-name" text="Nome de exibição" />
                            <Input id="register-display-name" placeholder="Nickname" value={displayName} onChange={handleDisplayNameChange} />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="register-email" text="Email de cadastro" span={<span className="text-danger">*</span>} />
                        <Input required={true} id="register-email" placeholder="Informe o email para cadastro" value={login} onChange={handleLoginChange} />
                    </div>
                    <div>
                        <Label htmlFor="register-password" text="Senha de cadastro" span={<span className="text-danger">*</span>} />
                        <Input required={true} id="register-password" type="password" placeholder="Informe a senha para cadastro" value={password} onChange={handlePasswordChange} />
                    </div>
                    <div className="flex flex-row justify-between gap-3">
                        <Link
                            href="/login"
                            className="flex items-center border border-accent gap-2 px-4 py-2 rounded-lg text-sm font-medium text-accent hover:bg-accent/20 transition-colors"
                        >
                            <LuLogIn size={20} />
                            Entrar
                        </Link>
                        <GoogleLoginButton href={AuthService.getGoogleAuthUrl()} />
                        <PrimaryButton onClick={handleRegister} text="Entrar" icon={<LuUserPlus />} />
                    </div>
                </div>
            } />
        </div>
    );
}