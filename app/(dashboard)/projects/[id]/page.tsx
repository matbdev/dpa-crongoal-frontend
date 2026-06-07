"use client";

import TasksPageBase from "@/components/tasks/TaskPageBase";
import { getProjectById } from "@/services/project.service";
import { Project } from "@/types/project";
import { Task } from "@/types/task";
import { use, useEffect, useState } from "react";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ProjectTasks({ params }: PageProps) {
    const { id } = use(params);
    const [project, setProject] = useState<Project | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const handleUpdateTask = (updatedTask: Task) => {
        setTasks(prev => prev.map(r => r.id === updatedTask.id ? updatedTask : r))
    };

    const handleDeleteTask = (deletedId: string) => {
        setTasks(prev => prev.filter(r => r.id !== deletedId))
    };

    const handleCompleteTask = async (taskId: string) => {
        try {
            // Task is completed. The backend handles points logic (awarding points, checking overdue etc)
            // But we need to update the local state to show it in the 'done' column.
            const { createDailyRegister } = await import('@/services/task.service');
            await createDailyRegister({ taskId, isDone: true });
            
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isCompleted: true } : t));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getProjectById(id)
            .then((foundProject) => {
                setProject(foundProject);
                setTasks(foundProject.tasks || []);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [id]);

    return (
        <TasksPageBase
            title={`Tarefas do projeto ${project?.title}`}
            subtitle={project?.description}
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