"use client";

import AddNewTaskPopUp from "@/components/tasks/AddEditTaskPopUp";
import TaskCard from "@/components/tasks/TaskCard";
import Button from "@/components/ui/Button";
import CustomEmptyList from "@/components/ui/CustomEmptyList";
import { getTasks } from "@/services/task.service";
import { Task } from "@/types/task";
import { useEffect, useState } from "react";
import { LuPlus } from "react-icons/lu";

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isPopUpAddNewOpen, setIsPopUpAddNewOpen] = useState(false);

    useEffect(() => {
        getTasks().then(setTasks);
    }, []);

    return (
        <div className="p-8">
            {isPopUpAddNewOpen && (
                <AddNewTaskPopUp
                    onClose={() => setIsPopUpAddNewOpen(false)}
                    onSuccess={(task: Task) => {
                        setTasks([...tasks, task]);
                        setIsPopUpAddNewOpen(false);
                    }}
                />
            )}
            <div className="flex flex-col gap-6">
                <div className="flex flex-row items-center justify-between">
                    <h1 className="text-2xl font-bold">Tarefas</h1>
                    <Button variant="primary" text="Adicionar Nova" onClick={() => { setIsPopUpAddNewOpen(true); }} icon={<LuPlus />} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
                    {tasks.length === 0 ? <CustomEmptyList text="Nenhuma tarefa encontrada" secondaryText="Cadastre uma nova tarefa para começar" /> : tasks.map(task => (
                        <TaskCard
                            key={task.id || task.title}
                            task={task}
                            onUpdate={(updatedReward) => setTasks(prev => prev.map(r => r.id === updatedReward.id ? updatedReward : r))}
                            onDelete={(deletedId) => setTasks(prev => prev.filter(r => r.id !== deletedId))}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}