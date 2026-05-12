import { Project } from "@/types/project";
import { LuPencil, LuTrash2, LuCalendar } from "react-icons/lu";
import * as ProjectService from "@/services/project.service";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import { useState } from "react";
import AddNewProjectPopUp from "./AddEditProjectPopUp";

interface ProjectCardProps {
    project: Project;
    onUpdate?: (updatedProject: Project) => void;
    onDelete?: (deletedId: string) => void;
}

export default function ProjectCard({ project, onUpdate, onDelete }: ProjectCardProps) {
    const [isPopUpEditOpen, setIsPopUpEditOpen] = useState(false);
    const isCompleted = project.isCompleted ?? false;

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
            const message = error.response?.data?.error ||
                "Erro ao excluir projeto";
            toast.error(message);
            console.error(error);
        };
    };

    const completedTasks = project.tasks?.filter(t => t.isCompleted).length ?? 0;
    const totalTasks = project.tasks?.length ?? 0;

    return (
        <div className={`flex flex-col gap-3 rounded-xl p-5 border transition-all bg-bg-card border-border-card hover:border-accent hover:shadow-md ${isCompleted ? 'opacity-60' : ''}`}>
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
                        <div className="flex items-center gap-2 mb-1">
                            {isCompleted ? (
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-success/10 text-success">
                                    Concluído ✓
                                </span>
                            ) : (
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                                    Em andamento
                                </span>
                            )}
                        </div>
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
                    <p className="text-sm mt-1 text-text-secondary">Tarefas: {completedTasks}/{totalTasks}</p>
                </div>
                {!isCompleted && (
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
                    </div>
                )}
            </div>
        </div>
    );
}
