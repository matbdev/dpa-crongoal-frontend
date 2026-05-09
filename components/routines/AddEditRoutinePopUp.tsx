import PopUp from "../layout/PopUp";
import Button from "../ui/Button";
import Label from "../ui/Label";
import { useState } from "react";
import toast from "react-hot-toast";
import * as RoutineService from "@/services/routine.service";
import Input from "../ui/Input";
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

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<RoutineFormInput>({
        resolver: zodResolver(createRoutineSchema),
        defaultValues: {
            name: routine?.name || "",
            description: routine?.description || ""
        },
    });

    const onSubmit = async (data: RoutineFormInput) => {
        setIsLoading(true);
        try {
            const finalRoutine: Routine = {
                name: data.name,
                description: data.description
            };

            // Edit logic
            if (routine) {
                const updated = await RoutineService.updateRoutine(routine?.id as string, finalRoutine);
                toast.success("Rotina atualizada com sucesso!");

                if (onSuccess) {
                    onSuccess(updated);
                } else {
                    onClose();
                };
            } else {
                // Add logic

                const created = await RoutineService.createRoutine(finalRoutine);
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
                "Erro ao realizar login";
            toast.error("Erro ao atualizar/criar a tarefa");
            console.log(message);
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