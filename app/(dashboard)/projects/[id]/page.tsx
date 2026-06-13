"use client";

import TasksPageBase from "@/components/tasks/TaskPageBase";
import { getProjectById } from "@/services/project.service";
import { Project } from "@/types/project";
import { Task } from "@/types/task";
import { use, useEffect, useState } from "react";
import { usePoints } from "@/contexts/PointsContext";
import toast from "react-hot-toast";

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

    const { addPoints } = usePoints();

    const handleCompleteTask = async (taskId: string) => {
        try {
            const { createDailyRegister } = await import('@/services/task.service');
            const { awardedPoints } = await createDailyRegister({ taskId, isDone: true });
            
            if (awardedPoints > 0) {
                addPoints(awardedPoints);
                toast.success(`Tarefa concluída! +${awardedPoints} pts`);
            } else {
                toast.success("Tarefa concluída!");
            }

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
            backUrl="/projects"
            backLabel="Voltar para Projetos"
            defaultProjectId={id}
        />
    );
}