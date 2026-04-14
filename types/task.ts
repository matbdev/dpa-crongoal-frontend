export type TaskType = 'RECURRENT' | 'UNIQUE';

export interface Task {
    id?: string;
    title: string;
    type: TaskType;
    generatedPoints: number;
    description?: string;
    createdAt?: string;
    userId?: string;
    projectId?: string;
    columnId?: string;
}

export interface DailyRegister {
    id?: string;
    registerDate?: string;
    isDone: boolean;
    obs?: string;
    taskId: string;
    task?: Task;
}
