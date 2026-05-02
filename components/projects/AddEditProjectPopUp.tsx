import PopUp from "../layout/PopUp";
import Button from "../ui/Button";
import Label from "../ui/Label";
import { useState } from "react";
import toast from "react-hot-toast";
import * as ProjectService from "@/services/project.service";
import Input from "../ui/Input";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Project } from "@/types/project";
import { createProjectSchema } from "@/schemas/project.schema";

type ProjectFormInput = z.input<typeof createProjectSchema>;

interface AddNewProjectPopUpProps {
    onClose: () => void;
    onSuccess?: (project: Project) => void;
    project?: Project;
}

export default function AddNewProjectPopUp({ onClose, onSuccess, project }: AddNewProjectPopUpProps) {
    const [isLoading, setIsLoading] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<ProjectFormInput>({
        resolver: zodResolver(createProjectSchema),
        defaultValues: {
            title: project?.title || "",
            description: project?.description || "",
            limitDate: project?.limitDate ? project.limitDate.split('T')[0] : "",
        },
    });

    const onSubmit = async (data: ProjectFormInput) => {
        setIsLoading(true);
        try {
            const finalProject: Project = {
                title: data.title,
                description: data.description,
                limitDate: (data.limitDate as Date).toISOString(),
            };

            // Edit logic
            if (project) {
                const updated = await ProjectService.updateProject(project?.id as string, finalProject);
                toast.success("Projeto atualizado com sucesso!");

                if (onSuccess) {
                    onSuccess(updated);
                } else {
                    onClose();
                };
            } else {
                // Add logic
                const created = await ProjectService.createProject(finalProject);
                toast.success("Projeto criado com sucesso!");

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
            toast.error("Erro ao atualizar/criar o projeto");
            console.log(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PopUp title={project ? "Editar Projeto" : "Criar Novo Projeto"} content={
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-5 mt-2">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="project-title" text="Título do Projeto" />
                            <Controller
                                name="title"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="project-title"
                                        placeholder="Ex: Refatorar aplicação"
                                        error={errors.title?.message}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <Label htmlFor="project-description" text="Descrição detalhada" />
                            <Controller
                                name="description"
                                control={control}
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id="project-description"
                                        placeholder="Descreva o projeto..."
                                        error={errors.description?.message}
                                    />
                                )}
                            />
                        </div>

                        <div className="flex flex-row gap-4">
                            <div className="flex flex-col gap-1.5 flex-1">
                                <Label htmlFor="limit-date" text="Data Limite" />
                                <Controller
                                    name="limitDate"
                                    control={control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            value={field.value as string}
                                            id="limit-date"
                                            type="date"
                                            error={errors.limitDate?.message}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end flex-row gap-3 mt-4 pt-5 border-t border-border-card">
                        <Button variant="cancel" text="Cancelar" onClick={onClose} type="button" disabled={isLoading} />
                        <Button
                            variant="primary"
                            text={project ? "Editar Projeto" : "Criar Projeto"}
                            type="submit"
                            disabled={isLoading}
                        />
                    </div>
                </div>
            </form>
        } onClose={onClose} />
    );
}