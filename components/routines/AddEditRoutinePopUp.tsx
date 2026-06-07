import PopUp from "../layout/PopUp";
import Button from "../ui/Button";
import Label from "../ui/Label";
import { useState } from "react";
import toast from "react-hot-toast";
import * as RoutineService from "@/services/routine.service";
import Input from "../ui/Input";
import TaskSelector from "../tasks/TaskSelector";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Routine } from "@/types/routine";
import { createRoutineSchema } from "@/schemas/routine.schema";

type RoutineFormInput = z.input<typeof createRoutineSchema>;

interface AddEditRoutinePopUpProps {
    onClose: () => void;
    onSuccess?: (routine: Routine) => void;
    routine?: Routine;
}

export default function AddEditRoutinePopUp({ onClose, onSuccess, routine }: AddEditRoutinePopUpProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>(
        routine?.routineTasks?.map(rt => rt.taskId) || []
    );

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<RoutineFormInput>({
        resolver: zodResolver(createRoutineSchema),
        defaultValues: {
            name: routine?.name || "",
            description: routine?.description || "",
            period: routine?.period || "DAILY"
        },
    });

    const onSubmit = async (data: RoutineFormInput) => {
        if (selectedTaskIds.length === 0) {
            toast.error("Selecione pelo menos uma tarefa para a rotina.");
            return;
        }

        setIsLoading(true);
        try {
            const finalRoutine: Routine = {
                name: data.name,
                description: data.description,
                period: data.period
            };

            // Edit logic
            if (routine) {
                const updated = await RoutineService.updateRoutine(routine?.id as string, finalRoutine, selectedTaskIds);
                toast.success("Rotina atualizada com sucesso!");

                if (onSuccess) {
                    onSuccess(updated);
                } else {
                    onClose();
                };
            } else {
                // Add logic

                const created = await RoutineService.createRoutine(finalRoutine, selectedTaskIds);
                toast.success("Rotina criada com sucesso!");

                if (onSuccess) {
                    onSuccess(created);
                } else {
                    onClose();
                }
            }

        } catch (error: any) {
            const message = error.response?.data?.errors?.[0]?.message ||
                error.response?.data?.error ||
                "Erro ao processar a requisição";
            toast.error(message);
            console.error(error);
        };
    };

    return (
        <PopUp title={routine ? "Editar Rotina" : "Criar Nova Rotina"} content={
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-5 mt-2">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="routine-name" text="Nome da Rotina" span={<span className="text-danger">*</span>} />
                            <Controller
                                name="name"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="routine-name"
                                        placeholder="Ex: Estudar Estrutura de Dados"
                                        error={errors.name?.message}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="routine-description" text="Descrição detalhada" />
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="routine-description"
                                        placeholder="Descreva como e quando será a rotina..."
                                        error={errors.description?.message}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="routine-period" text="Ciclo de Repetição" />
                            <Controller
                                name="period"
                                control={control}
                                render={({ field }) => (
                                    <select
                                        {...field}
                                        id="routine-period"
                                        className="px-3 py-2 text-sm rounded-lg border border-border-card bg-bg-main text-text-primary focus:outline-none focus:ring-2 focus:ring-accent"
                                    >
                                        <option value="DAILY">Diário</option>
                                        <option value="WEEKLY">Semanal</option>
                                        <option value="MONTHLY">Mensal</option>
                                        <option value="QUARTERLY">Trimestral</option>
                                        <option value="SEMIANNUAL">Semestral</option>
                                        <option value="ANNUAL">Anual</option>
                                    </select>
                                )}
                            />
                        </div>
                        
                        <TaskSelector 
                            context="routine" 
                            selectedTaskIds={selectedTaskIds} 
                            onSelectionChange={setSelectedTaskIds} 
                        />
                    </div>

                    <div className="flex justify-end flex-row gap-3 mt-4 pt-5 border-t border-border-card">
                        <Button variant="cancel" text="Cancelar" onClick={onClose} type="button" />
                        <Button
                            variant="primary"
                            text={routine ? "Editar Rotina" : "Criar Rotina"}
                            type="submit"
                        />
                    </div>
                </ div>
            </form>
        } onClose={onClose} />
    );
}