"use client";

import TasksPageBase from "@/components/tasks/TaskPageBase";
import { getTasks } from "@/services/task.service";
import { Task } from "@/types/task";
import { useEffect, useState } from "react";

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const handleUpdateTask = (updatedTask: Task) => {
        setTasks(prev => prev.map(r => r.id === updatedTask.id ? updatedTask : r))
    };

    const handleDeleteTask = (deletedId: string) => {
        setTasks(prev => prev.filter(r => r.id !== deletedId))
    };

    const handleCompleteTask = (taskId: string) => {
        // Task stays visible — the TaskCard handles its own completion UI
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