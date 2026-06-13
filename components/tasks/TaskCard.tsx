import { Task } from "@/types/task";
import { LuCoins, LuCheck, LuPencil, LuTrash2 } from "react-icons/lu";
import * as TaskService from "@/services/task.service";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import { useState } from "react";
import AddNewTaskPopUp from "./AddEditTaskPopUp";
import ConfirmDeleteModal from "../ui/ConfirmDeleteModal";
import { usePoints } from "@/contexts/PointsContext";

interface TaskCardProps {
    task: Task;
    onUpdate?: (updatedTask: Task) => void;
    onDelete?: (deletedId: string) => void;
    onComplete?: (taskId: string) => void;
}

export default function TaskCard({ task, onUpdate, onDelete, onComplete }: TaskCardProps) {
    const [isPopUpEditOpen, setIsPopUpEditOpen] = useState(false);
    const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
    const [isCompleted, setIsCompleted] = useState(task.isCompleted ?? false);
    const { addPoints } = usePoints();

    const handleCompleteTask = async () => {
        try {
            const { awardedPoints } = await TaskService.createDailyRegister({ taskId: task.id as string, isDone: true });

            if (awardedPoints > 0) {
                addPoints(awardedPoints);
                toast.success(`+${awardedPoints} pts!`, { icon: '🎉' });
            } else {
                toast.success("Tarefa registrada!");
            }

            setIsCompleted(true);
            if (onComplete) {
                onComplete(task.id as string);
            }
        } catch (error: any) {
            const message = error.response?.data?.errors?.[0]?.message ||
                error.response?.data?.error ||
                "Erro ao concluir tarefa";
            toast.error(message);
            console.error(error);
        };
    };

    const handleUpdateTask = (updatedTask: Task) => {
        if (onUpdate) onUpdate(updatedTask);
    };

    const handleEditTask = () => {
        setIsPopUpEditOpen(true);
    };

    const handleDeleteTask = async () => {
        try {
            if (task.id) {
                await TaskService.deleteTask(task.id);
                toast.success("Tarefa excluída com sucesso!");
                if (onDelete) onDelete(task.id);
            }
        } catch (error: any) {
            const message = error.response?.data?.errors?.[0]?.message ||
                error.response?.data?.error ||
                "Erro ao excluir tarefa";
            toast.error(message);
            console.error(error);
        };
    };

    return (
        <div className={`flex flex-col gap-3 rounded-xl p-5 border transition-all bg-bg-card border-border-card hover:border-accent hover:shadow-md ${isCompleted ? 'opacity-60' : ''}`}>
            {isPopUpEditOpen && <AddNewTaskPopUp
                onClose={() => { setIsPopUpEditOpen(false) }}
                onSuccess={(updatedTask: Task) => {
                    setIsPopUpEditOpen(false);
                    handleUpdateTask(updatedTask);
                }}
                task={task}
            />}
            <ConfirmDeleteModal
                isOpen={isConfirmDeleteOpen}
                onClose={() => setIsConfirmDeleteOpen(false)}
                onConfirm={handleDeleteTask}
                itemName={task.title}
            />
            <div className="flex flex-row justify-between">
                <div className="flex flex-row items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            {task.project && (
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                                    Projeto: {task.project.title}
                                </span>
                            )}
                            {(!task.project && task.routineTasks && task.routineTasks.length > 0) && (
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">
                                    Rotina: {task.routineTasks[0].routine?.name ?? 'Sem nome'}
                                </span>
                            )}
                            {(!task.projectId && (!task.routineTasks || task.routineTasks.length === 0)) && (
                                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${task.type === 'UNIQUE' ? 'bg-accent/10 text-accent' : 'bg-secondary/10 text-secondary'}`}>
                                    {task.type === 'UNIQUE' ? 'Única' : ''}
                                </span>
                            )}
                            {isCompleted && (
                                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-success/10 text-success">
                                    Concluída ✓
                                </span>
                            )}
                        </div>
                        <h3 className="font-semibold text-lg leading-tight text-text-primary">{task.title}</h3>
                        {task.description && (
                            <p className="text-sm mt-1 text-text-secondary">{task.description}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-auto w-full pt-3 border-t border-border-card flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 font-bold text-warning whitespace-nowrap">
                    <LuCoins size={18} />
                    <span>{task.generatedPoints} pts</span>
                </div>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto flex-1 justify-end min-w-[200px]">
                    <Button
                        icon={<LuTrash2 />}
                        text="Excluir"
                        variant="cancel"
                        className={`flex-1 min-w-[100px] ${isCompleted ? 'hidden' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsConfirmDeleteOpen(true);
                        }}
                    />
                    <Button
                        icon={<LuPencil />}
                        text="Editar"
                        variant="secondary"
                        className={`flex-1 min-w-[100px] ${isCompleted ? 'hidden' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEditTask();
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
