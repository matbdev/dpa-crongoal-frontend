export type TaskType = 'RECURRENT' | 'UNIQUE';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'DONE';

export interface Task {
    id?: string;
    title: string;
    type: TaskType;
    status: TaskStatus;
    generatedPoints: number;
    isCompleted?: boolean;
    description?: string;
    createdAt?: string;
    userId?: string;
    projectId?: string;
    columnId?: string;
    project?: { id: string; title: string };
    routineTasks?: { routineId: string; routine?: { id: string; name: string } }[];
    registers?: DailyRegister[];
}

export interface DailyRegister {
    id?: string;
    registerDate?: string;
    isDone: boolean;
    obs?: string;
    taskId: string;
    task?: Task;
}
