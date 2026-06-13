import { Task, DailyRegister } from "@/types/task";
import api from "@/lib/api";

export async function createTask(data: Partial<Task>): Promise<Task> {
    const response = await api.post('/api/task', data);
    return response.data;
}

export async function getTasks(): Promise<Task[]> {
    const response = await api.get('/api/task');
    return response.data;
}

export async function getTaskCount(): Promise<number> {
    const response = await api.get('/api/task/count');
    return response.data;
}

export async function getTaskById(id: string): Promise<Task> {
    const response = await api.get(`/api/task/${id}`);
    return response.data;
}

export async function updateTask(id: string, data: Partial<Task>): Promise<Task> {
    const response = await api.put(`/api/task/${id}`, data);
    return response.data;
}

export async function deleteTask(id: string): Promise<void> {
    await api.delete(`/api/task/${id}`);
}

export async function createDailyRegister(data: any): Promise<{ register: DailyRegister, awardedPoints: number }> {
    const response = await api.post('/api/task/daily', data);
    return response.data;
}

export async function getDailyTasks(): Promise<DailyRegister[]> {
    const response = await api.get('/api/task/daily');
    return response.data;
}

export async function moveTaskToColumn(taskId: string, newColumnId: string): Promise<Task> {
    const response = await api.put('/api/task/move', { taskId, newColumnId });
    return response.data;
}
