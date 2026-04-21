import { FaImage } from "react-icons/fa";
import PopUp from "../layout/PopUp";
import CancelButton from "../ui/CancelButton";
import Input from "../ui/Input";
import PrimaryButton from "../ui/PrimaryButton";
import Label from "../ui/Label";
import { useState } from "react";
import { LuTrash2 } from "react-icons/lu";
import toast from "react-hot-toast";
import { Reward } from "@/types/reward";
import { createReward } from "@/services/reward.service";

export default function AddNewRewardPopUp({ onClose, onSuccess }: { onClose: () => void, onSuccess?: (reward: Reward) => void }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [pointsToGet, setPointsToGet] = useState(0);
    const [icon, setIcon] = useState('');
    const [hasIcon, setHasIcon] = useState(false);

    const maxBytesForImage = 256 * 1024;

    const handleTitleChange = (value: string) => {
        setTitle(value);
    }

    const handleDescriptionChange = (value: string) => {
        setDescription(value);
    }

    const handlePointsToGetChange = (value: string) => {
        setPointsToGet(Number(value));
    }

    const handleIconChange = (value: string) => {
        setIcon(value);
        setHasIcon(true);
    }

    const handleIconRemove = () => {
        setIcon('');
        setHasIcon(false);
    }

    const handleNewReward = async () => {
        try {
            const reward: Reward = {
                title,
                description,
                pointsToGet,
                icon,
                isActive: true
            };
            const created = await createReward(reward);
            toast.success("Recompensa criada com sucesso!");
            if (onSuccess) {
                onSuccess(created);
            } else {
                onClose();
            }
        } catch (error: any) {
            const message = error.response?.data?.errors?.[0]?.message ||
                error.response?.data?.error ||
                "Erro ao realizar login";
            toast.error("Erro ao criar a recompensa");
            console.log(message)
        }
    }

    return (
        <PopUp title="Criar Nova Recompensa" content={
            <div className="flex flex-col gap-5 mt-2">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="reward-title" text="Título da Recompensa" />
                        <Input id="reward-title" placeholder="Ex: Assistir um filme" value={title} onChange={handleTitleChange} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="reward-description" text="Descrição detalhada" />
                        <Input id="reward-description" placeholder="Descreva como e quando será a recompensa..." value={description} onChange={handleDescriptionChange} />
                    </div>

                    <div className="flex flex-row gap-4">
                        <div className="flex flex-col gap-1.5 flex-1">
                            <Label htmlFor="reward-cost" text="Custo" span={<span className="font-normal text-warning">(Pontos)</span>} />
                            <Input id="reward-cost" type="number" placeholder="Ex: 50" value={pointsToGet} onChange={handlePointsToGetChange} />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="reward-icon" text="Ícone" />
                            <div className="flex flex-row items-center gap-2">
                                <label
                                    htmlFor="reward-icon"
                                    className={`flex items-center justify-center h-11 w-14 bg-bg-card border rounded-lg hover:text-accent hover:border-accent hover:bg-accent/10 transition-colors cursor-pointer ${icon ? 'border-accent text-accent bg-accent/5' : 'border-border-card text-text-secondary'}`}
                                    title={icon || `Escolher ícone (max ${maxBytesForImage / 1024}kb)`}
                                >
                                    <FaImage size={18} />
                                </label>
                                <input
                                    id="reward-icon"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={
                                        (e) => {
                                            if (e.target.files && e.target.files.length > 0) {
                                                const file = e.target.files[0];
                                                if (file.size > maxBytesForImage) {
                                                    toast.error(`O arquivo deve ter no máximo ${maxBytesForImage / 1024}KB`);
                                                    return;
                                                }
                                                handleIconChange(file.name);
                                            }
                                        }
                                    }
                                />
                                {hasIcon && (
                                    <CancelButton icon={<LuTrash2 size={18} />} onClick={handleIconRemove} className="w-14 h-11 px-0!" />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end flex-row gap-3 mt-4 pt-5 border-t border-border-card">
                    <CancelButton text="Cancelar" onClick={onClose} />
                    <PrimaryButton text="Criar Recompensa" onClick={() => { handleNewReward() }} />
                </div>
            </ div>
        } onClose={onClose} />
    );
}