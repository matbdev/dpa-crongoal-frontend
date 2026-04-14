"use client"

import AddNewRewardPopUp from "@/components/rewards/AddNewRewardPopUp";
import RewardCard from "@/components/rewards/RewardCard";
import Button from "@/components/ui/PrimaryButton";
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
                    <Button text="Adicionar Nova" onClick={() => { setIsPopUpAddNewOpen(true); }} icon={<LuPlus />} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                    {rewards.map(reward => (
                        <RewardCard key={reward.id || reward.title} reward={reward} />
                    ))}
                </div>
            </div>
        </div>
    );
}
