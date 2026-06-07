"use client";

import AddNewTaskPopUp from "@/components/tasks/AddEditTaskPopUp";
import TaskCard from "@/components/tasks/TaskCard";
import KanbanBoard, { KanbanColumnDef } from "@/components/ui/KanbanBoard";
import Button from "@/components/ui/Button";
import CustomEmptyList from "@/components/ui/CustomEmptyList";
import { Task } from "@/types/task";
import { LuPlus, LuLayoutGrid, LuSquareKanban } from "react-icons/lu";
import { useState } from "react";

interface TasksPageBaseProps {
    title?: string;
    subtitle?: string;
    pageTasks: Task[];
    setPageTasks?: (tasks: Task[]) => void;
    isLoading?: boolean;
    setIsLoading?: (loading: boolean) => void;
    handleUpdateTask?: (updatedTask: Task) => void;
    handleDeleteTask?: (taskId: string) => void;
    handleCompleteTask?: (taskId: string) => void;
}

export default function TasksPageBase({
    pageTasks,
    title = "Tarefas",
    subtitle,
    setPageTasks,
    isLoading = false,
    setIsLoading,
    handleUpdateTask,
    handleDeleteTask,
    handleCompleteTask
}: TasksPageBaseProps) {
    const [isPopUpAddNewOpen, setIsPopUpAddNewOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'kanban'>('kanban');

    // Define columns placing all tasks in the first column for now
    const kanbanColumns: KanbanColumnDef<Task>[] = [
        { id: "todo", title: "A Fazer", items: pageTasks },
        { id: "in_progress", title: "Em Andamento", items: [] },
        { id: "done", title: "Concluído", items: [] },
    ];

    return (
        <div className="p-8 h-[calc(100vh-80px)] flex flex-col">
            {isPopUpAddNewOpen && (
                <AddNewTaskPopUp
                    onClose={() => setIsPopUpAddNewOpen(false)}
                    onSuccess={(task: Task) => {
                        setPageTasks && setPageTasks([...pageTasks, task]);
                        setIsPopUpAddNewOpen(false);
                    }}
                />
            )}
            <div className="flex flex-col gap-6 h-full">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-6">
                        <h1 className="text-2xl font-semibold text-text-primary">{title}</h1>
                        {subtitle && <p className="text-text-secondary">{subtitle}</p>}

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
                    <Button variant="primary" text="Adicionar Nova" onClick={() => { setIsPopUpAddNewOpen(true); }} icon={<LuPlus />} />
                </div>

                <div className="flex-1 overflow-hidden">
                    {isLoading ? null : pageTasks.length === 0 ? (
                        <CustomEmptyList text="Nenhuma tarefa encontrada" secondaryText="Cadastre uma nova tarefa para começar" />
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-8 h-full content-start">
                            {pageTasks.map(task => (
                                <TaskCard
                                    key={task.id || task.title}
                                    task={task}
                                    onUpdate={handleUpdateTask}
                                    onDelete={handleDeleteTask}
                                    onComplete={handleCompleteTask}
                                />
                            ))}
                        </div>
                    ) : (
                        <KanbanBoard<Task>
                            columns={kanbanColumns}
                            emptyText="Nenhuma tarefa"
                            renderCard={(task) => (
                                <TaskCard
                                    key={task.id || task.title}
                                    task={task}
                                    onUpdate={handleUpdateTask}
                                    onDelete={handleDeleteTask}
                                    onComplete={handleCompleteTask}
                                />
                            )}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}