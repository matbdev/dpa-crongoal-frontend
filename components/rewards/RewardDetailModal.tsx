"use client";

import { useEffect, useState } from "react";
import { LuX, LuGift, LuCoins, LuCalendarClock, LuLoader } from "react-icons/lu";
import { getAllRedeemsByReward } from "@/services/reward.service";
import { Reward } from "@/types/reward";

interface RedeemEntry {
    id: string;
    redeemDate: string;
    spentPoints: number;
    reward?: Reward;
}

interface RewardDetailModalProps {
    reward: Reward;
    isOpen: boolean;
    onClose: () => void;
}

export default function RewardDetailModal({ reward, isOpen, onClose }: RewardDetailModalProps) {
    const [redeems, setRedeems] = useState<RedeemEntry[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (isOpen && reward.id) {
            setIsLoading(true);
            getAllRedeemsByReward(reward.id)
                .then((data: any[]) => setRedeems(data))
                .catch(console.error)
                .finally(() => setIsLoading(false));
        }
    }, [isOpen, reward.id]);

    if (!isOpen) return null;

    const formatDateTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const totalSpent = redeems.reduce((sum, r) => sum + r.spentPoints, 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            {/* Modal */}
            <div className="relative bg-bg-card border border-border-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col mx-4">
                {/* Header */}
                <div className="flex items-start justify-between p-6 border-b border-border-card">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                        {reward.icon ? (
                            <img src={reward.icon} alt={reward.title} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                        ) : (
                            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                                <LuGift size={22} className="text-accent" />
                            </div>
                        )}
                        <div className="min-w-0">
                            <h2 className="text-lg font-semibold text-text-primary truncate">{reward.title}</h2>
                            <div className="flex items-center gap-3 mt-0.5">
                                <span className="flex items-center gap-1 text-sm font-bold text-warning">
                                    <LuCoins size={14} />
                                    {reward.pointsToGet} pts
                                </span>
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${reward.isActive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
                                    {reward.isActive ? 'Ativa' : 'Inativa'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg hover:bg-bg-main transition-colors text-text-secondary hover:text-text-primary shrink-0 ml-2"
                    >
                        <LuX size={20} />
                    </button>
                </div>

                {/* Description */}
                {reward.description && (
                    <div className="px-6 py-3 border-b border-border-card">
                        <p className="text-sm text-text-secondary">{reward.description}</p>
                    </div>
                )}

                {/* Redeem History */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide flex items-center gap-2">
                            <LuCalendarClock size={16} className="text-accent" />
                            Histórico de Resgates
                        </h3>
                        {redeems.length > 0 && (
                            <span className="text-xs text-text-secondary">
                                {redeems.length} resgate{redeems.length !== 1 ? 's' : ''} · {totalSpent} pts gastos
                            </span>
                        )}
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <LuLoader size={24} className="animate-spin text-text-secondary" />
                        </div>
                    ) : redeems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-text-secondary/60">
                            <LuGift size={32} className="mb-2" />
                            <p className="text-sm">Nenhum resgate realizado ainda.</p>
                        </div>
                    ) : (
                        <ul className="flex flex-col gap-2">
                            {redeems.map((redeem) => (
                                <li
                                    key={redeem.id}
                                    className="flex items-center justify-between py-3 px-4 rounded-lg bg-bg-main border border-border-card"
                                >
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-text-primary">
                                            {formatDateTime(redeem.redeemDate)}
                                        </span>
                                    </div>
                                    <span className="flex items-center gap-1 text-sm font-semibold text-warning">
                                        <LuCoins size={14} />
                                        -{redeem.spentPoints} pts
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}
