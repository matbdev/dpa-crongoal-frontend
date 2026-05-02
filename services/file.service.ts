import api from "@/lib/api";

export async function uploadFile(file: File) {
    const formData = new FormData();
    formData.append('icon', file);

    try {
        const response = await api.post('/api/upload/reward-icon', formData);
        return response.data.url;
    } catch (error) {
        console.error("Erro no upload", error);
        throw error;
    }
}