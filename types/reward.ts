export interface Reward {
    id?: string;
    title: string;
    pointsToGet: number;
    isActive: boolean;
    description?: string;
    icon?: string;
    userId?: string;
}

export interface Redeem {
    id?: string;
    redeemDate: string;
    spentPoints: number;
    userId: string;
    rewardId: string;
}