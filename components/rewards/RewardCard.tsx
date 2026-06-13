import { Reward } from "@/types/reward";
import { LuCoins, LuGift, LuPencil, LuTrash2 } from "react-icons/lu";
import * as RewardService from "@/services/reward.service";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import AddNewRewardPopUp from "./AddEditRewardPopUp";
import RewardDetailModal from "./RewardDetailModal";
import ConfirmDeleteModal from "../ui/ConfirmDeleteModal";
import { useState } from "react";
import { usePoints } from "@/contexts/PointsContext";

interface RewardCardProps {
    reward: Reward;
    onUpdate?: (updatedReward: Reward) => void;
    onDelete?: (deletedId: string) => void;
}

export default function RewardCard({ reward, onUpdate, onDelete }: RewardCardProps) {
    const [isPopUpEditOpen, setIsPopUpEditOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isConfirmingRedeem, setIsConfirmingRedeem] = useState(false);
    const { points, subtractPoints } = usePoints();

    const handleRedeemReward = async () => {
        if (points !== null && points < reward.pointsToGet) {
            const deficit = reward.pointsToGet - points;
            toast.error(`Você precisa de mais ${deficit} pontos para resgatar esta recompensa.`);
            setIsConfirmingRedeem(false);
            return;
        }

        try {
            await RewardService.redeemReward(reward.id as string);
            subtractPoints(reward.pointsToGet);
            toast.success("Recompensa resgatada com sucesso!");
            setIsConfirmingRedeem(false);
        } catch (error: any) {
            const message = error.response?.data?.error ||
                "Erro ao resgatar recompensa";
            toast.error(message);
            console.error(error);
            setIsConfirmingRedeem(false);
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
            const message = error.response?.data?.errors?.[0]?.message ||
                error.response?.data?.error ||
                "Erro ao excluir recompensa";
            toast.error(message);
            console.error(error);
        };
    };

    const canAfford = points !== null && points >= reward.pointsToGet;

    return (
        <>
            <div
                className={`flex flex-col gap-3 rounded-xl p-5 border transition-all cursor-pointer ${reward.isActive ? 'bg-bg-card border-border-card hover:border-accent hover:shadow-md' : 'bg-bg-main border-border-card opacity-70'}`}
                onClick={() => setIsDetailOpen(true)}
            >
                {isPopUpEditOpen && <AddNewRewardPopUp
                    onClose={() => { setIsPopUpEditOpen(false); }}
                    onSuccess={(updatedReward) => {
                        handleUpdateReward(updatedReward);
                        setIsPopUpEditOpen(false);
                    }}
                    reward={reward}
                />}
                <ConfirmDeleteModal
                    isOpen={isConfirmDeleteOpen}
                    onClose={() => setIsConfirmDeleteOpen(false)}
                    onConfirm={handleDeleteReward}
                    itemName={reward.title}
                />
                <div className="flex flex-row justify-between">
                    <div className="flex flex-row items-start justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                {!reward.isActive && (
                                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-danger/10 text-danger">
                                        Inativa
                                    </span>
                                )}
                            </div>
                            <h3 className={`font-semibold text-lg leading-tight ${reward.isActive ? 'text-text-primary' : 'text-text-secondary'}`}>{reward.title}</h3>
                            <p className={`text-sm mt-1 ${reward.isActive ? 'text-text-secondary' : 'text-text-secondary/60'}`}>{reward.description}</p>
                        </div>
                    </div>
                    {reward.icon && (
                        <img src={reward.icon} alt={reward.title} className="w-12 h-12 text-sm rounded-lg object-cover" />
                    )}
                </div>

                <div className="mt-auto w-full pt-3 border-t border-border-card flex flex-wrap items-center justify-between gap-3">
                    <div className={`shrink-0 flex items-center gap-1.5 font-bold ${reward.isActive ? 'text-warning' : 'text-text-secondary/50'}`}>
                        <LuCoins size={18} />
                        <span>{reward.pointsToGet} pts</span>
                    </div>

                    <div className="flex flex-wrap gap-2 w-full sm:w-auto flex-1 justify-end min-w-[200px]" onClick={(e) => e.stopPropagation()}>
                        <Button
                            icon={<LuTrash2 />}
                            text="Excluir"
                            variant="cancel"
                            className="flex-1 min-w-[100px]"
                            onClick={() => {
                                setIsConfirmDeleteOpen(true);
                            }}
                        />
                        <Button
                            icon={<LuPencil />}
                            text="Editar"
                            variant="secondary"
                            className="flex-1 min-w-[100px]"
                            onClick={handleEditReward}
                        />
                        {reward.isActive && (
                            isConfirmingRedeem ? (
                                <div className="flex-1 min-w-[150px] flex flex-wrap items-center gap-1.5">
                                    <button
                                        onClick={handleRedeemReward}
                                        className="flex-1 min-w-[80px] px-3 py-2 rounded-md bg-success text-white text-sm font-medium hover:bg-success/80 transition-colors"
                                    >
                                        Confirmar
                                    </button>
                                    <button
                                        onClick={() => setIsConfirmingRedeem(false)}
                                        className="flex-1 min-w-[80px] px-3 py-2 rounded-md bg-bg-main text-text-secondary text-sm font-medium hover:bg-bg-main/80 transition-colors border border-border-card"
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            ) : (
                                <Button
                                    className="flex-1 min-w-[100px]"
                                    icon={<LuGift />}
                                    onClick={() => {
                                        if (!canAfford) {
                                            const deficit = reward.pointsToGet - (points ?? 0);
                                            toast.error(`Você precisa de mais ${deficit} pontos para resgatar.`);
                                            return;
                                        }
                                        setIsConfirmingRedeem(true);
                                    }}
                                    text="Resgatar"
                                    variant="primary"
                                />
                            )
                        )}
                    </div>
                </div>
            </div>

            <RewardDetailModal
                reward={reward}
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
            />
        </>
    );
}