"use client"

import CustomEmptyList from "@/components/ui/CustomEmptyList";
import AddNewRewardPopUp from "@/components/rewards/AddEditRewardPopUp";
import RewardCard from "@/components/rewards/RewardCard";
import Button from "@/components/ui/Button";
import { getRewards } from "@/services/reward.service";
import { Reward } from "@/types/reward";
import { useEffect, useState } from "react";
import { LuPlus, LuFileText } from "react-icons/lu";
import ReportModal from "@/components/reports/ReportModal";

export default function RewardsPage() {
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [isPopUpAddNewOpen, setIsPopUpAddNewOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    useEffect(() => {
        getRewards().then(setRewards).finally(() => setIsLoading(false));
    }, []);

    const handleUpdateReward = (updatedReward: Reward) => {
        setRewards(prev => prev.map(r => r.id === updatedReward.id ? updatedReward : r))
    };

    const handleDeleteReward = (deletedId: string) => {
        setRewards(prev => prev.filter(r => r.id !== deletedId))
    };

    return (
        <div className="p-8 h-[calc(100vh-80px)] flex flex-col">
            {isPopUpAddNewOpen && <AddNewRewardPopUp
                onClose={() => { setIsPopUpAddNewOpen(false); }}
                onSuccess={(newReward) => {
                    setRewards(prev => [...prev, newReward]);
                    setIsPopUpAddNewOpen(false);
                }}
            />}

            <div className="flex flex-col gap-6 h-full">
                <div className="flex flex-row items-center justify-between">
                    <h1 className="text-2xl font-semibold text-text-primary">Recompensas</h1>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsReportModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-md border border-border-card bg-bg-card text-text-primary hover:border-accent hover:text-accent transition-colors text-sm font-medium"
                        >
                            <LuFileText size={16} />
                            Relatório
                        </button>
                        <Button variant="primary" text="Adicionar Nova" onClick={() => { setIsPopUpAddNewOpen(true); }} icon={<LuPlus />} />
                    </div>
                </div>

                <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} module="rewards" />

                <div className="flex-1 overflow-hidden">
                    {isLoading ? null : rewards.length === 0 ? (
                        <CustomEmptyList text="Nenhuma recompensa encontrada" secondaryText="Cadastre uma nova recompensa para começar" />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-8 h-full content-start">
                            {rewards.map(reward => (
                                <RewardCard
                                    key={reward.id || reward.title}
                                    reward={reward}
                                    onUpdate={handleUpdateReward}
                                    onDelete={handleDeleteReward}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
