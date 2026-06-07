"use client";

import AddNewTaskPopUp from "@/components/tasks/AddEditTaskPopUp";
import TaskCard from "@/components/tasks/TaskCard";
import KanbanBoard, { KanbanColumnDef } from "@/components/ui/KanbanBoard";
import Button from "@/components/ui/Button";
import CustomEmptyList from "@/components/ui/CustomEmptyList";
import { Task } from "@/types/task";
import { LuPlus, LuLayoutGrid, LuSquareKanban, LuFileText } from "react-icons/lu";
import { useState } from "react";
import ReportModal from "@/components/reports/ReportModal";

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
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);

    // Define columns placing tasks based on completion status
    const kanbanColumns: KanbanColumnDef<Task>[] = [
        { id: "todo", title: "A Fazer", items: pageTasks.filter(t => !t.isCompleted) },
        { id: "in_progress", title: "Em Andamento", items: [] },
        { id: "done", title: "Concluído", items: pageTasks.filter(t => t.isCompleted) },
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
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsReportModalOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-md border border-border-card bg-bg-card text-text-primary hover:border-accent hover:text-accent transition-colors text-sm font-medium"
                        >
                            <LuFileText size={16} />
                            Relatório
                        </button>
                        <Button variant="primary" text="Nova Tarefa" onClick={() => { setIsPopUpAddNewOpen(true); }} icon={<LuPlus />} />
                    </div>
                </div>

                <ReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} module="tasks" />

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
                            getId={(task) => task.id as string}
                            isItemDraggable={(task) => !task.isCompleted}
                            onItemMove={async (taskId, sourceColId, destColId) => {
                                if (destColId === 'done' && handleCompleteTask) {
                                    handleCompleteTask(taskId);
                                } else if (destColId !== 'done') {
                                    // Normally we would save column state, but for now we only have basic status
                                }
                            }}
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