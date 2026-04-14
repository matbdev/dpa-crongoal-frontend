import { Routine, RoutineTask } from "@/types/routine";
import api from "@/lib/api";

export async function createRoutine(data: Partial<Routine>, taskIds?: string[]): Promise<Routine> {
    const response = await api.post('/api/routine', { ...data, taskIds });
    return response.data;
}

export async function getRoutines(): Promise<Routine[]> {
    const response = await api.get('/api/routine');
    return response.data;
}

export async function getRoutineById(id: string): Promise<Routine> {
    const response = await api.get(`/api/routine/${id}`);
    return response.data;
}

export async function updateRoutine(id: string, data: Partial<Routine>): Promise<Routine> {
    const response = await api.put(`/api/routine/${id}`, data);
    return response.data;
}

export async function deleteRoutine(id: string): Promise<void> {
    await api.delete(`/api/routine/${id}`);
}

export async function addTaskToRoutine(routineId: string, taskId: string): Promise<RoutineTask> {
    const response = await api.post('/api/routine/task', { routineId, taskId });
    return response.data;
}

export async function removeTaskFromRoutine(routineId: string, taskId: string): Promise<void> {
    await api.delete('/api/routine/task', { data: { routineId, taskId } });
}
