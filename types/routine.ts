import { Task } from './task';

export interface Routine {
    id?: string;
    name: string;
    description?: string;
    period?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'SEMIANNUAL' | 'ANNUAL';
    createdAt?: string;
    userId?: string;
    routineTasks?: RoutineTask[];
}

export interface RoutineTask {
    routineId: string;
    taskId: string;
    task?: Task;
    routine?: Routine;
}
