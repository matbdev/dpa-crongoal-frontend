import { Task } from "@/types/task";
import { LuCoins, LuCheck, LuPencil, LuTrash2 } from "react-icons/lu";
import * as TaskService from "@/services/task.service";
import toast from "react-hot-toast";
import Button from "../ui/Button";
import { useState } from "react";
import AddNewTaskPopUp from "./AddEditTaskPopUp";

interface TaskCardProps {
    task: Task;
    onUpdate?: (updatedTask: Task) => void;
    onDelete?: (deletedId: string) => void;
    onComplete?: (taskId: string) => void;
}

export default function TaskCard({ task, onUpdate, onDelete, onComplete }: TaskCardProps) {
    const [isPopUpEditOpen, setIsPopUpEditOpen] = useState(false);

    const handleCompleteTask = async () => {
        try {
            if (onComplete) {
                onComplete(task.id as string);
            } else {
                await TaskService.createDailyRegister({ taskId: task.id as string, isDone: true });
                toast.success("Tarefa concluída!");
            }
        } catch (error: any) {
            toast.error("Erro ao concluir tarefa");
            console.log(error.response?.data?.errors?.[0]?.message ||
                error.response?.data?.error ||
                "Erro ao concluir tarefa");
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
            toast.error("Erro ao excluir tarefa");
            console.log(error.response?.data?.errors?.[0]?.message ||
                error.response?.data?.error ||
                "Erro ao excluir tarefa");
        };
    };

    return (
        <div className="flex flex-col h-full gap-3 rounded-xl p-5 border transition-all bg-bg-card border-border-card hover:border-accent hover:shadow-md">
            {isPopUpEditOpen && <AddNewTaskPopUp
                onClose={() => { setIsPopUpEditOpen(false) }}
                onSuccess={() => {
                    setIsPopUpEditOpen(false);
                    handleUpdateTask(task);
                }}
                task={task}
            />}
            <div className="flex flex-row justify-between">
                <div className="flex flex-row items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-accent/10 text-accent">
                                {task.type === 'RECURRENT' ? 'Recorrente' : 'Única'}
                            </span>
                        </div>
                        <h3 className="font-semibold text-lg leading-tight text-text-primary">{task.title}</h3>
                        {task.description && (
                            <p className="text-sm mt-1 text-text-secondary">{task.description}</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-auto w-full pt-3 border-t border-border-card flex flex-row items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 font-bold text-warning whitespace-nowrap">
                    <LuCoins size={18} />
                    <span>{task.generatedPoints} pts</span>
                </div>

                <div className="flex flex-row gap-2">
                    <Button
                        icon={<LuTrash2 />}
                        text="Excluir"
                        variant="cancel"
                        onClick={handleDeleteTask}
                    />
                    <Button
                        icon={<LuPencil />}
                        text="Editar"
                        variant="secondary"
                        onClick={handleEditTask}
                    />
                    <Button
                        icon={<LuCheck />}
                        onClick={handleCompleteTask}
                        text="Concluir"
                        variant="primary"
                    />
                </div>
            </div>
        </div>
    );
}
