"use client";

import Button from "@/components/ui/Button";
import { LuPlus, LuLayoutGrid, LuSquareKanban } from "react-icons/lu";
import ProjectCard from "@/components/projects/ProjectCard";
import KanbanBoard, { KanbanColumnDef } from "@/components/ui/KanbanBoard";
import { useEffect, useState } from "react";
import * as ProjectService from "@/services/project.service";
import { Project } from "@/types/project";
import AddNewProjectPopUp from "@/components/projects/AddEditProjectPopUp";
import CustomEmptyList from "@/components/ui/CustomEmptyList";

export default function ProjectsPage() {

    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'kanban'>('kanban');

    useEffect(() => {
        ProjectService.getProjects().then(setProjects).finally(() => setIsLoading(false));
    }, []);

    const handleUpdateProject = (updatedProject: Project) => {
        setProjects(currentProjects => currentProjects.map(
            project => project.id === updatedProject.id ? updatedProject : project
        ));
    };

    const handleDeleteProject = (deletedId: string) => {
        setProjects(currentProjects => currentProjects.filter(project => project.id !== deletedId));
    };

    const kanbanColumns: KanbanColumnDef<Project>[] = [
        { id: "todo", title: "A Fazer", items: projects },
        { id: "in_progress", title: "Em Andamento", items: [] },
        { id: "done", title: "Concluído", items: [] },
    ];

    return (
        <div className="p-8 h-[calc(100vh-80px)] flex flex-col">
            {isPopUpOpen && <AddNewProjectPopUp
                onClose={() => { setIsPopUpOpen(false); }}
                onSuccess={(newProject) => {
                    setProjects(prev => [newProject, ...prev]);
                    setIsPopUpOpen(false);
                }}
            />}

            <div className="flex flex-col gap-6 h-full">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-6">
                        <h1 className="text-2xl font-semibold text-text-primary">Projetos</h1>

                        {/* View Toggle */}
                        <div className="flex items-center bg-bg-card border border-border-card rounded-lg p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${viewMode === 'grid' ? 'bg-bg-main text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                                title="Visualização em Grade"
                            >
                                <LuLayoutGrid size={18} />
                            </button>
                            <button
                                onClick={() => setViewMode('kanban')}
                                className={`p-1.5 rounded-md flex items-center justify-center transition-colors ${viewMode === 'kanban' ? 'bg-bg-main text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                                title="Visualização Kanban"
                            >
                                <LuSquareKanban size={18} />
                            </button>
                        </div>
                    </div>
                    <Button text="Novo Projeto" variant="primary" icon={<LuPlus />} onClick={() => setIsPopUpOpen(true)} />
                </div>

                <div className="flex-1 overflow-hidden">
                    {isLoading ? null : projects.length === 0 ? (
                        <CustomEmptyList text="Nenhum projeto encontrado" secondaryText="Cadastre um novo projeto para começar" />
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-8 h-full content-start">
                            {projects.map(project => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onUpdate={handleUpdateProject}
                                    onDelete={handleDeleteProject}
                                />
                            ))}
                        </div>
                    ) : (
                        <KanbanBoard<Project>
                            columns={kanbanColumns}
                            emptyText="Nenhum projeto"
                            renderCard={(project) => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onUpdate={handleUpdateProject}
                                    onDelete={handleDeleteProject}
                                />
                            )}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}