import { FaImage } from "react-icons/fa";
import PopUp from "../layout/PopUp";
import Button from "../ui/Button";
import Label from "../ui/Label";
import { useState } from "react";
import { LuTrash2 } from "react-icons/lu";
import toast from "react-hot-toast";
import { Reward } from "@/types/reward";
import * as RewardService from "@/services/reward.service";
import Input from "../ui/Input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createRewardSchema } from "@/schemas/reward.schema";
import { z } from "zod";

type RewardFormInput = z.input<typeof createRewardSchema>;

interface AddEditRewardPopUpProps {
    onClose: () => void;
    onSuccess?: (reward: Reward) => void;
    reward?: Reward;
}

export default function AddEditRewardPopUp({ onClose, onSuccess, reward }: AddEditRewardPopUpProps) {
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<RewardFormInput>({
        resolver: zodResolver(createRewardSchema),
        defaultValues: {
            title: reward?.title || "",
            description: reward?.description || "",
            pointsToGet: reward?.pointsToGet || 0,
            icon: reward?.icon || "",
        },
    });

    const onSubmit = async (data: RewardFormInput) => {
        setIsLoading(true);
        try {
            const finalReward: Reward = {
                title: data.title,
                description: data.description,
                pointsToGet: Number(data.pointsToGet),
                icon,
                isActive: true
            };

            // Edit logic
            if (reward) {
                const updated = await RewardService.updateReward(reward?.id as string, finalReward, imageFile);
                toast.success("Recompensa atualizada com sucesso!");

                if (onSuccess) {
                    onSuccess(updated);
                } else {
                    onClose();
                };
            } else {
                // Add logic

                const created = await RewardService.createReward(finalReward, imageFile);
                toast.success("Recompensa criada com sucesso!");

                if (onSuccess) {
                    onSuccess(created);
                } else {
                    onClose();
                }
            }

        } catch (error: any) {
            const message = error.response?.data?.errors?.[0]?.message ||
                error.response?.data?.error ||
                "Erro ao realizar login";
            toast.error("Erro ao atualizar/criar a recompensa");
            console.log(message);
        };
    };

    const [icon, setIcon] = useState(reward?.icon || '');
    const [hasIcon, setHasIcon] = useState(!!reward?.icon);
    const [imageFile, setImageFile] = useState<File | undefined>();

    const maxBytesForImage = 256 * 1024;

    const handleIconChange = (value: string) => {
        setIcon(value);
        setHasIcon(true);
    }

    const handleIconRemove = () => {
        setIcon('');
        setHasIcon(false);
        setImageFile(undefined);
    }

    return (
        <PopUp title={reward ? "Editar Recompensa" : "Criar Nova Recompensa"} content={
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-5 mt-2">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="reward-title" text="Título da Recompensa" />
                            <Controller
                                name="title"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="reward-title"
                                        placeholder="Ex: Assistir um filme"
                                        error={errors.title?.message}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="reward-description" text="Descrição detalhada" />
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="reward-description"
                                        placeholder="Descreva como e quando será a recompensa..."
                                        error={errors.description?.message}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex flex-row gap-4">
                            <div className="flex flex-col gap-1.5 flex-1">
                                <Label htmlFor="reward-cost" text="Custo" span={<span className="font-normal text-warning">(Pontos)</span>} />
                                <Controller
                                    name="pointsToGet"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            value={field.value as number}
                                            id="reward-cost"
                                            type="number"
                                            placeholder="Ex: 50"
                                            error={errors.pointsToGet?.message}
                                        />
                                    )}
                                />

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
                                                    setImageFile(file);
                                                    handleIconChange(file.name);
                                                }
                                            }
                                        }
                                    />
                                    {hasIcon && (
                                        <Button variant="cancel" icon={<LuTrash2 size={18} />} onClick={handleIconRemove} className="w-14 h-11 px-0!" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end flex-row gap-3 mt-4 pt-5 border-t border-border-card">
                        <Button variant="cancel" text="Cancelar" onClick={onClose} type="button" />
                        <Button
                            variant="primary"
                            text={reward ? "Editar Recompensa" : "Criar Recompensa"}
                            type="submit"
                        />
                    </div>
                </ div>
            </form>
        } onClose={onClose} />
    );
}