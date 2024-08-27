import { messageRoute, messagesRoute, customPost, customGet } from "./services";
import { Message } from "../types/chatContext";

export async function getMessages(chatId: number): Promise<Message[]> {
    return customGet({ url: messagesRoute + '/' + chatId, requiresAuth: true });
}

export async function messageSend(chatId: number, content: string): Promise<Message> {
    return customPost({ url: messageRoute, body: { chatId, content }, requiresAuth: true });
}