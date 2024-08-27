import { customPost, customGet, chatRoute, chatsRoute } from './services';
import { Chat } from '../types/chatContext';

export async function createChat(userId: number): Promise<Chat> {
    return customPost({ url: chatRoute, body: { userId }, requiresAuth: true });
}

export async function getChats(): Promise<Chat[]> {
    return customGet({ url: chatsRoute, requiresAuth: true });
}

