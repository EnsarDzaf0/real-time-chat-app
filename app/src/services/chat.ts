import { customPost, customGet, chatRoute, chatsRoute, groupRoute, customPut } from './services';
import { Chat } from '../types/chatContext';

export async function createChat(userId: number): Promise<Chat> {
    return customPost({ url: chatRoute, body: { userId }, requiresAuth: true });
}

export async function getChats(): Promise<Chat[]> {
    return customGet({ url: chatsRoute, requiresAuth: true });
}

export async function createGroupChat(users: number[], name: string): Promise<Chat> {
    return customPost({ url: groupRoute, body: { users, name }, requiresAuth: true });
}

export async function updateGroupChat(chatId: number, name: string): Promise<Chat> {
    return customPut({ url: groupRoute, body: { chatId, name }, requiresAuth: true });
}

export async function addUserToGroupChat(chatId: number, userId: number): Promise<Chat> {
    return customPut({ url: groupRoute + '/add', body: { chatId, userId }, requiresAuth: true });
}

export async function removeUserFromGroupChat(chatId: number, userId: number): Promise<Chat> {
    return customPut({ url: groupRoute + '/remove', body: { chatId, userId }, requiresAuth: true });
}
