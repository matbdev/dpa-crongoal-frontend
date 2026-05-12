"use client";

import AddNewTaskPopUp from "@/components/tasks/AddEditTaskPopUp";
import TaskCard from "@/components/tasks/TaskCard";
import KanbanBoard, { KanbanColumnDef } from "@/components/ui/KanbanBoard";
import Button from "@/components/ui/Button";
import CustomEmptyList from "@/components/ui/CustomEmptyList";
import { getTasks } from "@/services/task.service";
import { Task } from "@/types/task";
import { useEffect, useState } from "react";
import { LuPlus, LuLayoutGrid, LuSquareKanban } from "react-icons/lu";

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isPopUpAddNewOpen, setIsPopUpAddNewOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'kanban'>('kanban');

    useEffect(() => {
        getTasks().then(setTasks).finally(() => setIsLoading(false));
    }, []);

    const handleUpdateTask = (updatedTask: Task) => {
        setTasks(prev => prev.map(r => r.id === updatedTask.id ? updatedTask : r))
    };

    const handleDeleteTask = (deletedId: string) => {
        setTasks(prev => prev.filter(r => r.id !== deletedId))
    };

    const handleCompleteTask = (taskId: string) => {
        // Task stays visible — the TaskCard handles its own completion UI
    };

    // Define columns placing all tasks in the first column for now
    const kanbanColumns: KanbanColumnDef<Task>[] = [
        { id: "todo", title: "A Fazer", items: tasks },
        { id: "in_progress", title: "Em Andamento", items: [] },
        { id: "done", title: "Concluído", items: [] },
    ];

    return (
        <div className="p-8 h-[calc(100vh-80px)] flex flex-col">
            {isPopUpAddNewOpen && (
                <AddNewTaskPopUp
                    onClose={() => setIsPopUpAddNewOpen(false)}
                    onSuccess={(task: Task) => {
                        setTasks([...tasks, task]);
                        setIsPopUpAddNewOpen(false);
                    }}
                />
            )}
            <div className="flex flex-col gap-6 h-full">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex items-center gap-6">
                        <h1 className="text-2xl font-semibold text-text-primary">Tarefas</h1>

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
                    {isLoading ? null : tasks.length === 0 ? (
                        <CustomEmptyList text="Nenhuma tarefa encontrada" secondaryText="Cadastre uma nova tarefa para começar" />
                    ) : viewMode === 'grid' ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto pr-2 pb-8 h-full content-start">
                            {tasks.map(task => (
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