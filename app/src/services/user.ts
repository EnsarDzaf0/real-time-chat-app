import { LoginUserResponse } from '../types/user';
import { customPost, loginRoute, registerRoute } from './services';

export async function login(username: string, password: string): Promise<LoginUserResponse> {
    const data = await customPost<LoginUserResponse>({ url: loginRoute, body: { username, password }, requiresAuth: false });
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
}

export async function register(username: string, password: string, name: string, email: string, image: File, dateOfBirth: string): Promise<LoginUserResponse> {
    const formData = new FormData();
    formData.append('image', image);
    const userData = {
        username,
        password,
        name,
        email,
        dateOfBirth
    };
    formData.append('userData', JSON.stringify(userData));
    console.log(formData.get('image'));
    const data = await customPost<LoginUserResponse>({ url: registerRoute, body: formData, requiresAuth: false });
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
}

export async function logout() {
    await customPost({ url: '/logout', requiresAuth: true });
    localStorage.removeItem('user');
}