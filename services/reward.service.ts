import { Reward } from "@/types/reward";
import api from "@/lib/api";

export async function createReward(reward: Reward): Promise<Reward> {
    const response = await api.post('/api/reward', {
        title: reward.title,
        description: reward.description,
        pointsToGet: reward.pointsToGet,
        icon: reward.icon
    });
    return response.data;
}

export async function getRewards(): Promise<Reward[]> {
    const response = await api.get('/api/reward');
    return response.data;
}

export async function updateReward(id: string, reward: Reward): Promise<Reward> {
    const response = await api.put(`/api/reward/${id}`, {
        title: reward.title,
        description: reward.description,
        pointsToGet: reward.pointsToGet,
        icon: reward.icon
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