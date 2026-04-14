import { KanbanColumn } from "@/types/kanban";
import api from "@/lib/api";

export async function createColumn(data: Partial<KanbanColumn>): Promise<KanbanColumn> {
    const response = await api.post('/api/kanban', data);
    return response.data;
}

export async function getColumnsByProject(projectId: string): Promise<KanbanColumn[]> {
    const response = await api.get(`/api/kanban/project/${projectId}`);
    return response.data;
}

export async function getColumnById(id: string): Promise<KanbanColumn> {
    const response = await api.get(`/api/kanban/${id}`);
    return response.data;
}

export async function updateColumn(id: string, data: Partial<KanbanColumn>): Promise<KanbanColumn> {
    const response = await api.put(`/api/kanban/${id}`, data);
    return response.data;
}

export async function deleteColumn(id: string): Promise<void> {
    await api.delete(`/api/kanban/${id}`);
}
