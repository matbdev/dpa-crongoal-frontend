import { Task } from "./task";

export interface Project {
    id?: string;
    title: string;
    description?: string;
    limitDate: string;
    isCompleted?: boolean;
    createdAt?: string;
    userId?: string;
    tasks?: Task[];
}
