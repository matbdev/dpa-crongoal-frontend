import { Task } from './task';

export interface Routine {
    id?: string;
    name: string;
    description?: string;
    createdAt?: string;
    userId?: string;
}

export interface RoutineTask {
    routineId: string;
    taskId: string;
    task?: Task;
    routine?: Routine;
}
