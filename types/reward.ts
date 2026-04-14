export interface Reward {
    id?: string;
    title: string;
    pointsToGet: number;
    isActive: boolean;
    description?: string;
    icon?: string;
    userId?: string;
}