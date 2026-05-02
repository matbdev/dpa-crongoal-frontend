import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Button from "@/components/ui/Button";
import * as AuthService from "@/services/auth.service";
import toast from "react-hot-toast";
import { LuLogIn, LuUserPlus } from "react-icons/lu";
import { loginSchema } from "@/schemas/auth.schema";
import { z } from "zod";
import { useRouter } from "next/navigation";

interface LoginFormProps {
    setIsLoading: (isLogin: boolean) => void;
    router: ReturnType<typeof useRouter>;
    isLoading: boolean;
    toggleMode: () => void;
}

export default function LoginForm({ setIsLoading, router, isLoading, toggleMode }: LoginFormProps) {
    type LoginFormData = z.infer<typeof loginSchema>;

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        try {
            const { token } = await AuthService.login({
                email: data.email,
                password: data.password,
            });
            localStorage.setItem("token", token);
            toast.success("Login realizado com sucesso!");
            router.push("/dashboard");
        } catch (error: any) {
            const message =
                error.response?.data?.errors?.[0]?.message ||
                error.response?.data?.error ||
                "Erro ao realizar login";
            console.error("Auth error:", message);
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-5 w-full">
            <div className="text-center mb-2">
                <h2 className="text-xl font-bold text-text-primary">
                    Login do usuário
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                    Bem-vindo de volta! Faça login para continuar.
                </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                    <Label
                        htmlFor="auth-email"
                        text="Email"
                        span={<span className="text-danger">*</span>}
                    />
                    <Controller
                        name="email"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id="auth-email"
                                placeholder="Seu e-mail de acesso"
                                error={errors?.email?.message as string}
                            />
                        )}
                    />
                </div>

                <div className="flex flex-col gap-1.5">
                    <Label
                        htmlFor="auth-password"
                        text="Senha"
                        span={<span className="text-danger">*</span>}
                    />
                    <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id="auth-password"
                                type="password"
                                placeholder="******"
                                error={errors?.password?.message as string}
                            />
                        )}
                    />
                </div>
                {errors.root?.message && (
                    <span className="text-danger text-sm font-medium mt-1">{errors.root.message}</span>
                )}

                <div className="flex flex-col sm:flex-row justify-end gap-3 mt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={toggleMode}
                        icon={<LuUserPlus size={18} />}
                        text={"Criar Conta"}
                        className="w-full sm:w-auto px-6"
                        disabled={isLoading}
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        icon={<LuLogIn size={18} />}
                        text={"Entrar"}
                        className="w-full sm:w-auto px-6"
                        disabled={isLoading}
                    />
                </div>
            </form>

            <div className="relative mt-2">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border-card"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-bg-card text-text-secondary">ou</span>
                </div>
            </div>

            <div className="mt-1 w-full">
                <Button variant="google" href={AuthService.getGoogleAuthUrl()} />
            </div>
        </div>
    );
}