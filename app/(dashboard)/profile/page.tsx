"use client";

import { useState, useEffect } from "react";
import { getProfile, updateProfile, deleteAccount } from "@/services/user.service";
import { User } from "@/types/user";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import Card from "@/components/ui/Card";
import Spinner from "@/components/ui/Spinner";
import { LuUser, LuMail, LuCoins, LuCalendar, LuSave, LuTrash2, LuShield } from "react-icons/lu";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [fullName, setFullName] = useState("");
    const [displayName, setDisplayName] = useState("");
    const router = useRouter();

    useEffect(() => {
        getProfile()
            .then((data) => {
                setUser(data);
                setFullName(data.fullName || "");
                setDisplayName(data.displayName || "");
                setLoading(false);
            })
            .catch(() => {
                toast.error("Erro ao carregar perfil");
                setLoading(false);
            });
    }, []);

    const handleSave = async () => {
        if (!fullName.trim()) {
            toast.error("O nome completo é obrigatório");
            return;
        }

        setSaving(true);
        try {
            const updatedUser = await updateProfile({ fullName, displayName });
            setUser(updatedUser);
            toast.success("Perfil atualizado com sucesso!");
        } catch (error) {
            toast.error("Erro ao atualizar perfil");
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (confirm("Tem certeza que deseja excluir sua conta? Esta ação é irreversível e todos os seus dados serão apagados.")) {
            try {
                await deleteAccount();
                toast.success("Conta excluída com sucesso.");
                localStorage.removeItem("token");
                router.push("/auth");
            } catch (error) {
                toast.error("Erro ao excluir conta");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-200px)]">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-8 text-center">
                <p className="text-danger mb-4">Erro ao carregar informações do usuário.</p>
                <Button text="Tentar Novamente" onClick={() => window.location.reload()} />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 overflow-y-auto">
            <header className="flex flex-col gap-1">
                <h1 className="text-3xl font-bold tracking-tight text-text-primary">Configurações de Perfil</h1>
                <p className="text-text-secondary text-sm">Gerencie suas informações pessoais e preferências da conta.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
                {/* Lateral: Resumo e Status */}
                <div className="lg:col-span-1 space-y-5">
                    <Card className="flex flex-col items-center p-6">
                        <div className="relative group">
                            <div className="h-28 w-28 rounded-full border-4 border-accent/20 overflow-hidden bg-hover-sidebar flex items-center justify-center transition-transform group-hover:scale-105">
                                {user.picUrl ? (
                                    <img 
                                        src={user.picUrl} 
                                        alt={user.fullName} 
                                        className="h-full w-full object-cover" 
                                    />
                                ) : (
                                    <LuUser size={56} className="text-text-secondary" />
                                )}
                            </div>
                        </div>
                        
                        <div className="mt-4 text-center w-full px-2 overflow-hidden">
                            <h2 className="text-xl font-bold text-text-primary truncate" title={user.displayName || user.fullName}>
                                {user.displayName || user.fullName}
                            </h2>
                            <p className="text-sm text-text-secondary truncate" title={user.email}>{user.email}</p>
                        </div>

                        <div className="w-full mt-6 pt-6 border-t border-border-card space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <LuCoins className="text-warning" size={18} />
                                    <span>Pontos</span>
                                </div>
                                <span className="font-bold text-warning">{user.pointsBalance || 0} pts</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-2 text-text-secondary">
                                    <LuShield className="text-accent" size={18} />
                                    <span>Cargo</span>
                                </div>
                                <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-bold uppercase tracking-wider">
                                    {user.role || 'USER'}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-sm text-text-secondary">
                                <div className="flex items-center gap-2">
                                    <LuCalendar size={18} />
                                    <span>Desde</span>
                                </div>
                                <span>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-5 bg-danger/5 border-danger/20">
                        <h3 className="text-danger font-semibold text-sm mb-2 flex items-center gap-2">
                            <LuTrash2 size={16} />
                            Zona de Perigo
                        </h3>
                        <p className="text-xs text-text-secondary mb-4">
                            Uma vez que você exclui sua conta, não há volta. Por favor, tenha certeza.
                        </p>
                        <Button 
                            text="Excluir minha conta"
                            variant="cancel"
                            className="w-full text-xs py-2"
                            onClick={handleDeleteAccount}
                        />
                    </Card>
                </div>

                {/* Principal: Formulário de Edição */}
                <div className="lg:col-span-2">
                    <Card className="p-6">
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-text-primary">Informações Básicas</h3>
                            <p className="text-text-secondary text-sm">Atualize seu nome e como você aparece para os outros.</p>
                        </div>
                        
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label text="Nome Completo" htmlFor="fullName" />
                                <Input 
                                    id="fullName" 
                                    value={fullName} 
                                    onChange={setFullName} 
                                    placeholder="Ex: João Silva"
                                />
                            </div>
                            
                            <div className="space-y-2">
                                <Label 
                                    text="Nome de Exibição" 
                                    htmlFor="displayName" 
                                    span={<span className="text-[10px] font-normal opacity-70">(Opcional)</span>}
                                />
                                <Input 
                                    id="displayName" 
                                    value={displayName} 
                                    onChange={setDisplayName} 
                                    placeholder="Ex: joaosilva"
                                />
                                <p className="text-[11px] text-text-secondary italic">
                                    Este é o nome que outros usuários verão.
                                </p>
                            </div>
                            
                            <div className="space-y-2">
                                <Label text="Endereço de E-mail" htmlFor="email" />
                                <div className="relative group">
                                    <Input 
                                        id="email" 
                                        value={user.email} 
                                        readOnly
                                        className="bg-bg-sidebar/50 cursor-not-allowed pl-10 border-dashed opacity-80"
                                    />
                                    <LuMail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent transition-colors" size={18} />
                                </div>
                                <p className="text-[11px] text-text-secondary">
                                    O e-mail não pode ser alterado após o cadastro.
                                </p>
                            </div>

                            <div className="pt-6 flex justify-end">
                                <Button 
                                    text={saving ? "Salvando..." : "Salvar Alterações"}
                                    icon={saving ? <Spinner size="sm" /> : <LuSave size={18} />}
                                    onClick={handleSave} 
                                    className="min-w-[200px]" 
                                    disabled={saving}
                                />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
