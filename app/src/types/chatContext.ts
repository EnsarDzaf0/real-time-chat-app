import { User } from "./user";

export interface Sender {
    id: number;
    username: string;
    image: string;
    email: string;
    dateOfBirth: string;
}

export interface Message {
    id: number;
    content: string;
    senderId: number;
    chatId: number;
    createdAt: string;
    updatedAt: string;
    sender: Sender;
}

export interface Chat {
    id: number;
    chatName: string;
    isGroupChat: boolean;
    groupAdminId: number;
    latestMessageId: number;
    createdAt: string;
    updatedAt: string;
    users: User[];
    groupAdmin: Sender;
    latestMessage: Message;
}

export interface Notification {
    id: number;
    message: string;
    chat: Chat;
}

export interface ChatContextType {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
    selectedChat: Chat | null;
    setSelectedChat: React.Dispatch<React.SetStateAction<Chat | null>>;
    chats: Chat[];
    setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
    notification: Notification[];
    setNotification: React.Dispatch<React.SetStateAction<Notification[]>>;
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
    onlineUsers: User[];
    setOnlineUsers: React.Dispatch<React.SetStateAction<User[]>>;
}
