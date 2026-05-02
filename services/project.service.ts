import { Project } from "@/types/project";
import api from "@/lib/api";

export async function createProject(data: Partial<Project>, taskIds?: string[]): Promise<Project> {
    const response = await api.post('/api/project', { ...data, taskIds });
    return response.data;
}

export async function getProjects(): Promise<Project[]> {
    const response = await api.get('/api/project');
    return response.data;
}

export async function getProjectCount(): Promise<number> {
    const response = await api.get('/api/project/count');
    return response.data;
}

export async function getProjectById(id: string): Promise<Project> {
    const response = await api.get(`/api/project/${id}`);
    return response.data;
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
    const response = await api.put(`/api/project/${id}`, data);
    return response.data;
}

export async function deleteProject(id: string): Promise<void> {
    await api.delete(`/api/project/${id}`);
}
