export interface User {
    id?: string;
    role?: string;
    email: string;
    fullName: string;
    displayName?: string;
    picUrl?: string;
    pointsBalance?: number;
    theme?: 'DARK' | 'LIGHT';
    createdAt?: string;
    updatedAt?: string;
}
