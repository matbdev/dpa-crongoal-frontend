import { Project } from "@/types/project";
import { LuCheck, LuPencil, LuTrash2, LuCalendar } from "react-icons/lu";
import * as ProjectService from "@/services/project.service";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import { useState } from "react";
import AddNewProjectPopUp from "./AddEditProjectPopUp";

interface ProjectCardProps {
    project: Project;
    onUpdate?: (updatedProject: Project) => void;
    onDelete?: (deletedId: string) => void;
    onComplete?: (projectId: string) => void;
}

export default function ProjectCard({ project, onUpdate, onDelete, onComplete }: ProjectCardProps) {
    const [isPopUpEditOpen, setIsPopUpEditOpen] = useState(false);

    const handleCompleteProject = async () => {
        try {
            await ProjectService.updateProject(project.id as string, project);
            toast.success("Projeto concluído!");
            if (onComplete) {
                onComplete(project.id as string);
            }
        } catch (error: any) {
            toast.error("Erro ao concluir projeto");
            console.log(error.response?.data?.errors?.[0]?.message ||
                error.response?.data?.error ||
                "Erro ao concluir projeto");
        };
    };

    const handleUpdateProject = (updatedProject: Project) => {
        if (onUpdate) onUpdate(updatedProject);
    };

    const handleEditProject = () => {
        setIsPopUpEditOpen(true);
    };

    const handleDeleteProject = async () => {
        try {
            if (project.id) {
                await ProjectService.deleteProject(project.id);
                toast.success("Projeto excluído com sucesso!");
                if (onDelete) onDelete(project.id);
            }
        } catch (error: any) {
            toast.error("Erro ao excluir projeto");
            console.log(error.response?.data?.errors?.[0]?.message ||
                error.response?.data?.error ||
                "Erro ao excluir projeto");
        };
    };

    return (
        <div className="flex flex-col h-full gap-3 rounded-xl p-5 border transition-all bg-bg-card border-border-card hover:border-accent hover:shadow-md">
            {isPopUpEditOpen && <AddNewProjectPopUp
                onClose={() => { setIsPopUpEditOpen(false) }}
                onSuccess={(updatedProject: Project) => {
                    setIsPopUpEditOpen(false);
                    handleUpdateProject(updatedProject);
                }}
                project={project}
            />}
            <div className="flex flex-row justify-between">
                <div className="flex flex-row items-start justify-between">
                    <div>
                        <h3 className="font-semibold text-lg leading-tight text-text-primary">{project.title}</h3>
                        {project.description && (
                            <p className="text-sm mt-1 text-text-secondary">{project.description}</p>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-warning whitespace-nowrap">
                    <LuCalendar size={18} />
                    <span>{project.limitDate.split("T")[0]}</span>
                </div>
            </div>

            <div className="mt-auto w-full pt-3 border-t border-border-card flex flex-row items-center justify-between gap-2">
                <div>
                    <p className="text-sm mt-1 text-text-secondary">Tasks: teste</p>
                </div>
                <div className="flex flex-row gap-2">
                    <Button
                        icon={<LuTrash2 />}
                        text="Excluir"
                        variant="cancel"
                        onClick={handleDeleteProject}
                    />
                    <Button
                        icon={<LuPencil />}
                        text="Editar"
                        variant="secondary"
                        onClick={handleEditProject}
                    />
                    <Button
                        icon={<LuCheck />}
                        onClick={handleCompleteProject}
                        text="Concluir"
                        variant="primary"
                    />
                </div>
            </div>
        </div>
    );
}
