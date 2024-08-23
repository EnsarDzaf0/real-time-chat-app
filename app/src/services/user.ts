import { LoginUserResponse } from '../types/user';
import { customPost, loginRoute, registerRoute } from './services';

export async function login(username: string, password: string): Promise<LoginUserResponse> {
    return customPost<LoginUserResponse>({ url: loginRoute, body: { username, password }, requiresAuth: false });
}

export async function register(username: string, password: string, name: string, email: string, image: File, dateOfBirth: string): Promise<LoginUserResponse> {
    const formData = new FormData();
    formData.append('image', image);
    const userData = {
        username,
        password,
        name,
        email,
        dateOfBirth,
        role: "employee"
    };
    formData.append('userData', JSON.stringify(userData));
    console.log(formData.get('image'));

    return customPost<LoginUserResponse>({ url: registerRoute, body: formData, requiresAuth: false });
}