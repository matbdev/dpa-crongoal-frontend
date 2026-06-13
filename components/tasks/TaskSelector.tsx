import { useEffect, useState } from "react";
import Button from "../ui/Button";
import * as TaskService from "@/services/task.service";
import { Task } from "@/types/task";
import { LuPlus, LuCheck } from "react-icons/lu";
import AddNewTaskPopUp from "./AddEditTaskPopUp";

interface TaskSelectorProps {
    context: "project" | "routine";
    selectedTaskIds: string[];
    onSelectionChange: (ids: string[]) => void;
}

export default function TaskSelector({ context, selectedTaskIds, onSelectionChange }: TaskSelectorProps) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isTaskPopUpOpen, setIsTaskPopUpOpen] = useState(false);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = () => {
        setIsLoading(true);
        TaskService.getTasks()
            .then(data => {
                setTasks(data);
                setIsLoading(false);
            })
            .catch(error => {
                console.error("Erro ao buscar tarefas", error);
                setIsLoading(false);
            });
    };

    const handleTaskClick = (taskId: string) => {
        // Toggle selection for both contexts (projects can have multiple tasks too)
        if (selectedTaskIds.includes(taskId)) {
            onSelectionChange(selectedTaskIds.filter(id => id !== taskId));
        } else {
            onSelectionChange([...selectedTaskIds, taskId]);
        }
    };

    const handleTaskCreated = (newTask: Task) => {
        setTasks(prev => [...prev, newTask]);
        // Auto-selecionar a nova task
        onSelectionChange([...selectedTaskIds, newTask.id as string]);
    };

    // Filtro rigoroso: só tarefas Órfãs e Não-Concluídas, a menos que já estejam selecionadas
    const availableTasks = tasks.filter(task => {
        if (selectedTaskIds.includes(task.id as string)) return true;
        if (task.isCompleted) return false;
        if (task.projectId) return false;
        if (task.routineTasks && task.routineTasks.length > 0) return false;
        return true;
    });

    const selectedTasks = availableTasks.filter(task => selectedTaskIds.includes(task.id as string));
    const unselectedTasks = availableTasks.filter(task => !selectedTaskIds.includes(task.id as string));

    return (
        <div className="flex flex-col gap-4 w-full">
            {isTaskPopUpOpen && (
                <AddNewTaskPopUp
                    onClose={() => setIsTaskPopUpOpen(false)}
                    onSuccess={(task) => {
                        setIsTaskPopUpOpen(false);
                        handleTaskCreated(task);
                    }}
                />
            )}

            {/* Container de Tarefas Selecionadas */}
            <div className="flex flex-col gap-2 bg-surface/20 rounded-md px-4 py-3 border border-border-card">
                <span className="text-sm font-semibold text-text-secondary mb-1">
                    Tarefas Selecionadas: {selectedTasks.length}
                </span>
                {isLoading ? (
                    <div className="text-center py-2 text-sm text-text-secondary">Carregando...</div>
                ) : selectedTasks.length === 0 ? (
                    <div className="text-center py-2 text-sm text-text-secondary">Nenhuma tarefa selecionada</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                        {selectedTasks.map(task => (
                            <div
                                key={task.id}
                                onClick={() => handleTaskClick(task.id as string)}
                                className={`cursor-pointer flex flex-row items-center justify-between bg-bg-card rounded-md px-3 py-2 border transition-all border-accent shadow-sm`}
                            >
                                <div className="flex flex-col overflow-hidden">
                                    <span className="font-medium text-sm truncate">{task.title}</span>
                                    <span className="text-xs text-text-secondary truncate">{task.generatedPoints} pts</span>
                                </div>
                                <div className="text-accent shrink-0 ml-2">
                                    <LuCheck size={18} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Container de Tarefas Disponíveis */}
            <div className="flex flex-col gap-2 bg-surface/5 rounded-md px-4 py-3 border border-border-card">
                <div className="flex flex-row justify-between items-center w-full mb-1">
                    <span className="text-sm font-semibold text-text-secondary">
                        Tarefas Disponíveis: {unselectedTasks.length}
                    </span>
                    <Button
                        icon={<LuPlus />}
                        text="Nova Tarefa"
                        variant="outline"
                        onClick={() => setIsTaskPopUpOpen(true)}
                        type="button"
                    />
                </div>
                {isLoading ? (
                    <div className="text-center py-4 text-sm text-text-secondary">Carregando...</div>
                ) : unselectedTasks.length === 0 ? (
                    <div className="text-center py-4 text-sm text-text-secondary">
                        Nenhuma tarefa disponível. Crie uma nova!
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                        {unselectedTasks.map(task => (
                            <div
                                key={task.id}
                                onClick={() => handleTaskClick(task.id as string)}
                                className={`cursor-pointer flex flex-row items-center justify-between bg-bg-card rounded-md px-3 py-2 border transition-all border-border-card hover:border-accent/50`}
                            >
                                <div className="flex flex-col overflow-hidden">
                                    <span className="font-medium text-sm truncate">{task.title}</span>
                                    <span className="text-xs text-text-secondary truncate">{task.generatedPoints} pts</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
