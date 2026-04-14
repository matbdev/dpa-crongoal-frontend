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
