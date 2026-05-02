"use client"

import CustomEmptyList from "@/components/ui/CustomEmptyList";
import AddNewRewardPopUp from "@/components/rewards/AddEditRewardPopUp";
import RewardCard from "@/components/rewards/RewardCard";
import Button from "@/components/ui/Button";
import { getRewards } from "@/services/reward.service";
import { Reward } from "@/types/reward";
import { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";

export default function RewardsPage() {
    const [rewards, setRewards] = useState<Reward[]>([]);
    const [isPopUpAddNewOpen, setIsPopUpAddNewOpen] = useState(false);

    useEffect(() => {
        getRewards().then(setRewards);
    }, []);

    return (
        <div className="p-8">
            {isPopUpAddNewOpen && <AddNewRewardPopUp
                onClose={() => { setIsPopUpAddNewOpen(false); }}
                onSuccess={(newReward) => {
                    setRewards(prev => [newReward, ...prev]);
                    setIsPopUpAddNewOpen(false);
                }}
            />}

            <div className="flex flex-col gap-6">
                <div className="flex flex-row items-center justify-between">
                    <h1 className="text-2xl font-bold">Recompensas</h1>
                    <Button variant="primary" text="Adicionar Nova" onClick={() => { setIsPopUpAddNewOpen(true); }} icon={<LuPlus />} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                    {rewards.length === 0 ? <CustomEmptyList text="Nenhuma recompensa encontrada" secondaryText="Cadastre uma nova recompensa para começar" /> : rewards.map(reward => (
                        <RewardCard
                            key={reward.id || reward.title}
                            reward={reward}
                            onUpdate={(updatedReward) => setRewards(prev => prev.map(r => r.id === updatedReward.id ? updatedReward : r))}
                            onDelete={(deletedId) => setRewards(prev => prev.filter(r => r.id !== deletedId))}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
