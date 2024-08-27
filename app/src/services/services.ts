import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

export const baseUrl = 'http://localhost:8080/api';

export const loginRoute = '/login';
export const registerRoute = '/register';
export const logoutRoute = '/logout';
export const usersRoute = '/users';
export const chatRoute = '/chat';
export const chatsRoute = '/chats';
export const groupRoute = '/group';
export const messageRoute = '/message';
export const messagesRoute = '/messages';

interface RequestParams {
    url: string;
    queryParams?: Record<string, string>;
    body?: object;
    requiresAuth: boolean;
    headers?: Record<string, string>;
}


const getAxiosConfig = function (headers?: Record<string, string>): AxiosRequestConfig {
    return {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `${Cookies.get('token')}`,
            ...headers,
        },
        validateStatus: () => true,
    };
};

export const tokenPresent = async function (): Promise<boolean> {
    return !!Cookies.get('token');
}

export const clearCookies = function (): void {
    Cookies.remove('token');
}

export const customGet = async <T>(params: RequestParams): Promise<T> => {
    if (params.requiresAuth && !(await tokenPresent())) {
        throw new Error('Unauthorized');
    }
    let url = baseUrl + params.url;
    const queryParams = params.queryParams;
    if (queryParams) {
        url += '?';
        for (const key in queryParams) {
            url += `${key}=${queryParams[key]}&`;
        }
    }
    const response = await axios.get(url, getAxiosConfig(params.headers));
    if (response.status === 401) {
        window.location.href = '/login';
        clearCookies();
    }
    return response.data as T;
}

export const customPost = async <T>(params: RequestParams): Promise<T> => {
    if (params.requiresAuth && !(await tokenPresent())) {
        throw new Error('Unauthorized');
    }

    if (params.body instanceof FormData) {
        console.log((params.body as FormData).get('image'));

        const response = await axios.post(baseUrl + params.url, params.body, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `${Cookies.get('token')}`,
                ...params.headers,
            },
            validateStatus: () => true,
        });

        if (response.status === 401) {
            window.location.href = '/login';
            clearCookies();
        }

        return response.data as T;
    }
    const response = await axios.post(baseUrl + params.url, params.body, getAxiosConfig(params.headers));
    if (response.status === 401) {
        window.location.href = '/login';
        clearCookies();
    }
    return response.data as T;
}

export const customPut = async <T>(params: RequestParams): Promise<T> => {
    if (params.requiresAuth && !(await tokenPresent())) {
        throw new Error('Unauthorized');
    }
    const response = await axios.put(baseUrl + params.url, params.body, getAxiosConfig(params.headers));
    if (response.status === 401) {
        window.location.href = '/login';
        clearCookies();
    }
    return response.data as T;
};
