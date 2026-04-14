import api from "@/lib/api";

interface LoginResponse {
    token: string;
}

interface RegisterData {
    email: string;
    password: string;
    fullName: string;
}

interface LoginData {
    email: string;
    password: string;
}

export async function login(data: LoginData): Promise<LoginResponse> {
    const response = await api.post('/api/auth/login', data);
    return response.data;
}

export async function register(data: RegisterData): Promise<LoginResponse> {
    const response = await api.post('/api/auth/register', data);
    return response.data;
}

export function getGoogleAuthUrl(): string {
    return `${process.env.NEXT_PUBLIC_BE_BASE_URL}/api/auth/google`;
}
