import { Reward } from "@/types/reward";
import { LuCoins, LuGift, LuPencil, LuTrash2 } from "react-icons/lu";
import * as RewardService from "@/services/reward.service";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import AddNewRewardPopUp from "./AddEditRewardPopUp";
import { useState } from "react";

interface RewardCardProps {
    reward: Reward;
    onUpdate?: (updatedReward: Reward) => void;
    onDelete?: (deletedId: string) => void;
}

export default function RewardCard({ reward, onUpdate, onDelete }: RewardCardProps) {
    const [isPopUpEditOpen, setIsPopUpEditOpen] = useState(false);

    const handleRedeemReward = async () => {
        try {
            await RewardService.redeemReward(reward.id as string);
            toast.success("Recompensa resgatada com sucesso!");
        } catch (error: any) {
            toast.error("Erro ao resgatar recompensa");
            console.log(error.response?.data?.errors?.[0]?.message ||
                error.response?.data?.error ||
                "Erro ao realizar cadastro");
        };
    };

    const handleUpdateReward = (updatedReward: Reward) => {
        if (onUpdate) onUpdate(updatedReward);
    };

    const handleEditReward = () => {
        setIsPopUpEditOpen(true);
    };

    const handleDeleteReward = async () => {
        try {
            await RewardService.deleteReward(reward.id as string);
            toast.success("Recompensa excluída com sucesso!");
            if (onDelete) onDelete(reward.id as string);
        } catch (error: any) {
            toast.error("Erro ao excluir recompensa");
            console.log(error.response?.data?.errors?.[0]?.message ||
                error.response?.data?.error ||
                "Erro ao excluir recompensa");
        };
    };

    return (
        <div className={`flex flex-col h-full gap-3 rounded-xl p-5 border transition-all ${reward.isActive ? 'bg-bg-card border-border-card hover:border-accent hover:shadow-md' : 'bg-bg-main border-border-card'}`}>
            {isPopUpEditOpen && <AddNewRewardPopUp
                onClose={() => { setIsPopUpEditOpen(false); }}
                onSuccess={(updatedReward) => {
                    handleUpdateReward(updatedReward);
                    setIsPopUpEditOpen(false);
                }}
                reward={reward}
            />}
            <div className="flex flex-row justify-between">
                <div className="flex flex-row items-start justify-between">
                    <div>
                        <h3 className={`font-semibold text-lg leading-tight ${reward.isActive ? 'text-text-primary' : 'text-text-secondary'}`}>{reward.title}</h3>
                        <p className={`text-sm mt-1 ${reward.isActive ? 'text-text-secondary' : 'text-text-secondary/60'}`}>{reward.description}</p>
                    </div>
                </div>
                {reward.icon && (
                    <img src={reward.icon} alt={reward.title} className="w-10 h-10 rounded-full" />
                )}
            </div>

            <div className="mt-auto w-full pt-3 border-t border-border-card flex flex-row items-center justify-between">
                <div className={`flex items-center gap-1.5 font-bold ${reward.isActive ? 'text-warning' : 'text-text-secondary/50'}`}>
                    <LuCoins size={18} />
                    <span>{reward.pointsToGet} pts</span>
                </div>

                <div className="flex flex-row gap-2">
                    <Button
                        icon={<LuTrash2 />}
                        text="Excluir"
                        variant="cancel"
                        onClick={handleDeleteReward}
                    />
                    <Button
                        icon={<LuPencil />}
                        text="Editar"
                        variant="secondary"
                        onClick={handleEditReward}
                    />
                    <Button
                        icon={<LuGift />}
                        disabled={!reward.isActive}
                        onClick={handleRedeemReward}
                        text="Resgatar"
                        variant="primary"
                    />
                </div>
            </div>
        </div>
    );
}