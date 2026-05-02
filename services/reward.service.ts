import { Reward } from "@/types/reward";
import api from "@/lib/api";
import * as FileService from "./file.service";

// Form data for image upload
export async function createReward(reward: Reward, imageFile?: File): Promise<Reward> {
    if (imageFile) {
        reward.icon = await FileService.uploadFile(imageFile);
    }

    const response = await api.post('/api/reward', {
        body: {
            title: reward.title,
            description: reward.description,
            pointsToGet: reward.pointsToGet,
            icon: reward.icon
        }
    });

    return response.data;
}

export async function getRewards(): Promise<Reward[]> {
    const response = await api.get('/api/reward');
    return response.data;
}

export async function updateReward(id: string, reward: Reward, imageFile?: File): Promise<Reward> {
    if (imageFile) {
        reward.icon = await FileService.uploadFile(imageFile);
    }

    const response = await api.put(`/api/reward/${id}`, {
        body: {
            title: reward.title,
            description: reward.description,
            pointsToGet: reward.pointsToGet,
            icon: reward.icon
        }
    });

    return response.data;
}

export async function deleteReward(id: string): Promise<void> {
    await api.delete(`/api/reward/${id}`);
}

export async function getRewardById(id: string): Promise<Reward> {
    const response = await api.get(`/api/reward/${id}`);
    return response.data;
}

export async function redeemReward(id: string): Promise<Reward> {
    const response = await api.post(`/api/reward/${id}/redeem`);
    return response.data;
}

export async function getAllRedeemsByReward(id: string): Promise<Reward[]> {
    const response = await api.get(`/api/reward/${id}/redeem`);
    return response.data;
}

export async function getAllRedeemsByUser(userId: string): Promise<Reward[]> {
    const response = await api.get(`/api/reward/user/${userId}/redeem`);
    return response.data;
}