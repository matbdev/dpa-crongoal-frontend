"use client";

import AddNewTaskPopUp from "@/components/tasks/AddEditTaskPopUp";
import TaskCard from "@/components/tasks/TaskCard";
import KanbanBoard, { KanbanColumnDef } from "@/components/ui/KanbanBoard";
import Button from "@/components/ui/Button";
import CustomEmptyList from "@/components/ui/CustomEmptyList";
import { Task } from "@/types/task";
import { LuPlus, LuLayoutGrid, LuSquareKanban, LuFileText, LuArrowLeft, LuSearch } from "react-icons/lu";
import { useState, useMemo } from "react";
import ReportModal from "@/components/reports/ReportModal";
import { useRouter } from "next/navigation";

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
    backUrl?: string;
    backLabel?: string;
    defaultProjectId?: string;
    defaultRoutineId?: string;
    customKanbanColumns?: KanbanColumnDef<Task>[];
    customOnItemMove?: (taskId: string, sourceColId: string, destColId: string) => Promise<void>;
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
    handleCompleteTask,
    backUrl,
    backLabel = "Voltar",
    defaultProjectId,
    defaultRoutineId,
    customKanbanColumns,
    customOnItemMove
}: TasksPageBaseProps) {
    const [isPopUpAddNewOpen, setIsPopUpAddNewOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'grid' | 'kanban'>('kanban');
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const router = useRouter();

    const filteredTasks = useMemo(() => {
        if (!searchQuery.trim()) return pageTasks;
        const query = searchQuery.toLowerCase();
        return pageTasks.filter(t => 
            t.title?.toLowerCase().includes(query) ||
            t.description?.toLowerCase().includes(query) ||
            t.generatedPoints?.toString().includes(query)
        );
    }, [pageTasks, searchQuery]);

    // Define columns placing tasks based on completion and status
    const kanbanColumns: KanbanColumnDef<Task>[] = (customKanbanColumns && customKanbanColumns.length > 0) ? customKanbanColumns : [
        { id: "todo", title: "A Fazer", items: filteredTasks.filter(t => !t.isCompleted && t.status !== 'IN_PROGRESS' && t.status !== 'DONE') },
        { id: "in_progress", title: "Em Andamento", items: filteredTasks.filter(t => !t.isCompleted && t.status === 'IN_PROGRESS') },
        { id: "done", title: "Concluído", items: filteredTasks.filter(t => t.isCompleted || t.status === 'DONE') },
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
                    defaultProjectId={defaultProjectId}
                    defaultRoutineId={defaultRoutineId}
                />
            )}
            <div className="flex flex-col gap-6 h-full">
                {backUrl && (
                    <button 
                        onClick={() => router.push(backUrl)}
                        className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary self-start transition-colors"
                    >
                        <LuArrowLeft size={16} />
                        {backLabel}
                    </button>
                )}
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
                        <div className="relative hidden md:block">
                            <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                            <input 
                                type="text"
                                placeholder="Buscar tarefas..."
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
                        <Button variant="primary" text="Nova Tarefa" onClick={() => { setIsPopUpAddNewOpen(true); }} icon={<LuPlus />} />
                    </div>
                </div>

                <ReportModal 
                    isOpen={isReportModalOpen} 
                    onClose={() => setIsReportModalOpen(false)} 
                    module="tasks"
                    initialFilters={Object.fromEntries(
                        Object.entries({
                            projectId: defaultProjectId,
                            routineId: defaultRoutineId
                        }).filter((entry): entry is [string, string] => entry[1] !== undefined)
                    )} 
                />

                <div className="flex-1 overflow-hidden">
                    {isLoading ? null : filteredTasks.length === 0 ? (
                        <CustomEmptyList text="Nenhuma tarefa encontrada" secondaryText={searchQuery ? "Tente buscar por outro termo" : "Cadastre uma nova tarefa para começar"} />
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-8 h-full content-start">
                            {filteredTasks.map(task => (
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
                            onItemMove={customOnItemMove || (async (taskId, sourceColId, destColId) => {
                                if (destColId === 'done' && handleCompleteTask) {
                                    handleCompleteTask(taskId);
                                } else if (destColId !== 'done' && handleUpdateTask) {
                                    const newStatus = destColId === 'in_progress' ? 'IN_PROGRESS' : 'TODO';
                                    const taskToUpdate = filteredTasks.find(t => t.id === taskId);
                                    if (taskToUpdate) {
                                        const updatedTask = { ...taskToUpdate, status: newStatus as any };
                                        handleUpdateTask(updatedTask);
                                        const { updateTask } = await import('@/services/task.service');
                                        await updateTask(taskId, { status: newStatus as any });
                                    }
                                }
                            })}
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