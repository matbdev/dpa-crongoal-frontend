"use client";

import TasksPageBase from "@/components/tasks/TaskPageBase";
import { getRoutineById } from "@/services/routine.service";
import { Routine } from "@/types/routine";
import { Task } from "@/types/task";
import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { usePoints } from "@/contexts/PointsContext";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function RoutineTasks({ params }: PageProps) {
    const { id } = use(params);
    const [routine, setRoutine] = useState<Routine | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { addPoints } = usePoints();

    const handleUpdateTask = (updatedTask: Task) => {
        setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
    };

    const handleDeleteTask = (deletedId: string) => {
        setTasks(prev => prev.filter(t => t.id !== deletedId));
    };

    const handleCompleteTask = async (taskId: string) => {
        try {
            const { createDailyRegister } = await import('@/services/task.service');
            const { awardedPoints } = await createDailyRegister({ taskId, isDone: true });
            
            if (awardedPoints > 0) {
                addPoints(awardedPoints);
                toast.success(`Rotina Completa! +${awardedPoints} pts`, { icon: '🎉' });
            } else {
                toast.success("Tarefa registrada!");
            }

            // Manually set isCompleted locally so the Kanban puts it in the done column
            setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isCompleted: true, status: 'DONE' } : t));
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getRoutineById(id)
            .then((foundRoutine) => {
                setRoutine(foundRoutine);
                const now = new Date();
                let periodStart = new Date(now);
                
                switch (foundRoutine.period) {
                    case 'DAILY':
                        periodStart.setHours(0, 0, 0, 0);
                        break;
                    case 'WEEKLY':
                        const day = periodStart.getDay();
                        const diff = periodStart.getDate() - day + (day === 0 ? -6 : 1); // Monday
                        periodStart.setDate(diff);
                        periodStart.setHours(0, 0, 0, 0);
                        break;
                    case 'MONTHLY':
                        periodStart.setDate(1);
                        periodStart.setHours(0, 0, 0, 0);
                        break;
                    case 'QUARTERLY':
                        const quarterMonth = Math.floor(periodStart.getMonth() / 3) * 3;
                        periodStart.setMonth(quarterMonth, 1);
                        periodStart.setHours(0, 0, 0, 0);
                        break;
                    case 'SEMIANNUAL':
                        const halfMonth = Math.floor(periodStart.getMonth() / 6) * 6;
                        periodStart.setMonth(halfMonth, 1);
                        periodStart.setHours(0, 0, 0, 0);
                        break;
                    case 'ANNUAL':
                        periodStart.setMonth(0, 1);
                        periodStart.setHours(0, 0, 0, 0);
                        break;
                }

                const routineTasks = foundRoutine.routineTasks?.map(rt => {
                    const task = rt.task;
                    if (task && Array.isArray(task.registers)) {
                        const hasCompletedInPeriod = task.registers.some((reg: any) => {
                            if (!reg.isDone || !reg.registerDate) return false;
                            const regDate = new Date(reg.registerDate);
                            return regDate.getTime() >= periodStart.getTime();
                        });
                        
                        if (hasCompletedInPeriod) {
                            task.isCompleted = true;
                        }
                    }
                    return task;
                }).filter(Boolean) as Task[] || [];
                
                setTasks(routineTasks);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [id]);

    const periodLabel = routine?.period === 'DAILY' ? 'Diária'
        : routine?.period === 'WEEKLY' ? 'Semanal'
        : routine?.period === 'MONTHLY' ? 'Mensal'
        : routine?.period === 'QUARTERLY' ? 'Trimestral'
        : routine?.period === 'SEMIANNUAL' ? 'Semestral'
        : routine?.period === 'ANNUAL' ? 'Anual'
        : '';

    const subtitleParts = [];
    if (periodLabel) subtitleParts.push(`Rotina ${periodLabel}`);
    if (routine?.description) subtitleParts.push(routine.description);
    const subtitle = subtitleParts.join(" • ");

    return (
        <TasksPageBase
            title={`Tarefas da rotina ${routine?.name || ''}`}
            subtitle={subtitle}
            pageTasks={tasks}
            setPageTasks={setTasks}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            handleCompleteTask={handleCompleteTask}
            handleDeleteTask={handleDeleteTask}
            handleUpdateTask={handleUpdateTask}
            backUrl="/routines"
            backLabel="Voltar para Rotinas"
            defaultRoutineId={id}
        />
    );
}
