export interface LoginUserResponse {
    user: {
        id: number;
        name: string;
        username: string;
        email: string;
        password: string;
        lastLoginDate: string | null;
        image: string;
        dateOfBirth: string;
        created_at: string;
        updated_at: string;
    }
    token: string;
}

export interface RouteResponse {
    error: string;
    status: number;
    message: string;
}