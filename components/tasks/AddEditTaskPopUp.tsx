import PopUp from "../layout/PopUp";
import Button from "../ui/Button";
import Label from "../ui/Label";
import { useState } from "react";
import toast from "react-hot-toast";
import * as TaskService from "@/services/task.service";
import Input from "../ui/Input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Task } from "@/types/task";
import { createTaskSchema } from "@/schemas/task.schema";

type TaskFormInput = z.input<typeof createTaskSchema>;

interface AddNewTaskPopUpProps {
    onClose: () => void;
    onSuccess?: (task: Task) => void;
    task?: Task;
}

export default function AddNewTaskPopUp({ onClose, onSuccess, task }: AddNewTaskPopUpProps) {
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<TaskFormInput>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            title: task?.title || "",
            description: task?.description || "",
            generatedPoints: task?.generatedPoints || 0,
            type: task?.type || "UNIQUE"
        },
    });

    const onSubmit = async (data: TaskFormInput) => {
        setIsLoading(true);
        try {
            const finalTask: Task = {
                title: data.title,
                description: data.description,
                generatedPoints: Number(data.generatedPoints),
                type: data.type
            };

            // Edit logic
            if (task) {
                const updated = await TaskService.updateTask(task?.id as string, finalTask);
                toast.success("Recompensa atualizada com sucesso!");

                if (onSuccess) {
                    onSuccess(updated);
                } else {
                    onClose();
                };
            } else {
                // Add logic

                const created = await TaskService.createTask(finalTask);
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
            toast.error("Erro ao atualizar/criar a tarefa");
            console.log(message);
        };
    };

    return (
        <PopUp title={task ? "Editar Tarefa" : "Criar Nova Tarefa"} content={
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-5 mt-2">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="task-title" text="Título da Tarefa" />
                            <Controller
                                name="title"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="task-title"
                                        placeholder="Ex: Estudar Estrutura de Dados"
                                        error={errors.title?.message}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="task-description" text="Descrição detalhada" />
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="task-description"
                                        placeholder="Descreva como e quando será a tarefa..."
                                        error={errors.description?.message}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex flex-row gap-4">
                            <div className="flex flex-col gap-1.5 flex-1">
                                <Label htmlFor="task-cost" text="Valor" span={<span className="font-normal text-warning">(Pontos)</span>} />
                                <Controller
                                    name="generatedPoints"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            value={field.value as number}
                                            id="task-cost"
                                            type="number"
                                            placeholder="Ex: 50"
                                            error={errors.generatedPoints?.message}
                                        />
                                    )}
                                />

                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end flex-row gap-3 mt-4 pt-5 border-t border-border-card">
                        <Button variant="cancel" text="Cancelar" onClick={onClose} type="button" />
                        <Button
                            variant="primary"
                            text={task ? "Editar Tarefa" : "Criar Tarefa"}
                            type="submit"
                        />
                    </div>
                </ div>
            </form>
        } onClose={onClose} />
    );
}