import { User } from "@/types/user";
import api from "@/lib/api";

export async function getProfile(): Promise<User> {
    const response = await api.get('/api/user');
    return response.data;
}

export async function updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put('/api/user', data);
    return response.data;
}

export async function deleteAccount(): Promise<void> {
    await api.delete('/api/user');
}

export async function getAllUsers(): Promise<User[]> {
    const response = await api.get('/api/user/admin/all');
    return response.data;
}
