"use client";

import Button from "@/components/ui/Button";
import { LuPlus, LuLayoutGrid, LuSquareKanban, LuFileText, LuSearch } from "react-icons/lu";
import ProjectCard from "@/components/projects/ProjectCard";
import KanbanBoard, { KanbanColumnDef } from "@/components/ui/KanbanBoard";
import { useEffect, useState } from "react";
import * as ProjectService from "@/services/project.service";
import { Project } from "@/types/project";
import AddNewProjectPopUp from "@/components/projects/AddEditProjectPopUp";
import CustomEmptyList from "@/components/ui/CustomEmptyList";
import ReportModal from "@/components/reports/ReportModal";

export default function ProjectsPage() {

    const [isPopUpOpen, setIsPopUpOpen] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'kanban'>('kanban');
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'active' | 'completed' | 'overdue'>('active');
    const [searchQuery, setSearchQuery] = useState('');

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

    const now = new Date();
    const filteredProjects = projects.filter(project => {
        const isOverdue = new Date(project.limitDate) < now && !project.isCompleted;
        
        if (activeTab === 'completed' && !project.isCompleted) return false;
        if (activeTab === 'overdue' && !isOverdue) return false;
        if (activeTab === 'active' && (project.isCompleted || isOverdue)) return false;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            return (
                project.title?.toLowerCase().includes(query) ||
                project.description?.toLowerCase().includes(query)
            );
        }

        return true;
    });

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
                        
                        {/* Tabs */}
                        <div className="flex items-center bg-bg-card border border-border-card rounded-lg p-1">
                            <button
                                onClick={() => setActiveTab('active')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'active' ? 'bg-bg-main text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                            >
                                Em Andamento
                            </button>
                            <button
                                onClick={() => setActiveTab('completed')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'completed' ? 'bg-bg-main text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                            >
                                Concluídos
                            </button>
                            <button
                                onClick={() => setActiveTab('overdue')}
                                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'overdue' ? 'bg-bg-main text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'}`}
                            >
                                Vencidos
                            </button>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="relative hidden md:block">
                            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                            <input 
                                type="text"
                                placeholder="Buscar projetos..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 rounded-md border border-border-card bg-bg-card text-text-primary focus:outline-none focus:border-accent w-64 text-sm"
                            />
                        </div>
                        <button
                            onClick={() => setIsReportModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-md border border-border-card bg-bg-card text-text-primary hover:border-accent hover:text-accent transition-colors text-sm font-medium"
                        >
                            <LuFileText size={16} />
                            Relatório
                        </button>
                        <Button text="Novo Projeto" variant="primary" icon={<LuPlus />} onClick={() => setIsPopUpOpen(true)} />
                    </div>
                </div>

                <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} module="projects" />

                <div className="flex-1 overflow-hidden">
                    {isLoading ? null : filteredProjects.length === 0 ? (
                        <CustomEmptyList 
                            text={activeTab === 'active' ? "Nenhum projeto em andamento" : activeTab === 'completed' ? "Nenhum projeto concluído" : "Nenhum projeto vencido"} 
                            secondaryText={searchQuery ? "Tente buscar por outro termo" : activeTab === 'active' ? "Cadastre um novo projeto para começar" : ""} 
                        />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-8 h-full content-start">
                            {filteredProjects.map(project => (
                                <ProjectCard
                                    key={project.id}
                                    project={project}
                                    onUpdate={handleUpdateProject}
                                    onDelete={handleDeleteProject}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}