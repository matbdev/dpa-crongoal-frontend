"use client";

import TasksPageBase from "@/components/tasks/TaskPageBase";
import { getTasks } from "@/services/task.service";
import { Task } from "@/types/task";
import { useEffect, useState } from "react";
import { usePoints } from "@/contexts/PointsContext";
import toast from "react-hot-toast";

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const handleUpdateTask = (updatedTask: Task) => {
        setTasks(prev => prev.map(r => r.id === updatedTask.id ? updatedTask : r))
    };

    const handleDeleteTask = (deletedId: string) => {
        setTasks(prev => prev.filter(r => r.id !== deletedId))
    };

    const { addPoints } = usePoints();

    const handleCompleteTask = async (taskId: string) => {
        try {
            const { createDailyRegister } = await import('@/services/task.service');
            const { awardedPoints } = await createDailyRegister({ taskId, isDone: true });
            
            if (awardedPoints > 0) {
                addPoints(awardedPoints);
                toast.success(`Tarefa concluída! +${awardedPoints} pts`);
            }
            
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isCompleted: true, status: 'DONE' } : t));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getTasks()
            .then((allTasks) => {
                const filteredTasks = allTasks.filter(task => 
                    !task.projectId && (!task.routineTasks || task.routineTasks.length === 0)
                );
                setTasks(filteredTasks);
            })
            .finally(() => setIsLoading(false));
    }, []);

    return (
        <TasksPageBase
            pageTasks={tasks}
            setPageTasks={setTasks}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            handleCompleteTask={handleCompleteTask}
            handleDeleteTask={handleDeleteTask}
            handleUpdateTask={handleUpdateTask}
        />
    );
}