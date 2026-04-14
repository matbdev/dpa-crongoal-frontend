import { Task } from './task';

export interface KanbanColumn {
    id?: string;
    name: string;
    order: number;
    color?: string;
    projectId: string;
    tasks?: Task[];
}
