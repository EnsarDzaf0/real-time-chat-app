import React, { createContext, useEffect, useState, ReactNode } from "react";
import { ChatContextType, Chat, Notification } from "../types/chatContext";
import { User } from "../types/user";

export const ChatContext = createContext<ChatContextType | null>(null);

interface ChatProviderProps {
    children: ReactNode;
}

const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
    const [chats, setChats] = useState<Chat[]>([]);
    const [notification, setNotification] = useState<Notification[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<User[]>([]);

    const syncUserWithLocalStorage = () => {
        const userInfo = localStorage.getItem("user");
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
    };

    useEffect(() => {
        syncUserWithLocalStorage();

        window.addEventListener("storage", syncUserWithLocalStorage);

        return () => {
            window.removeEventListener("storage", syncUserWithLocalStorage);
        };
    }, []);

    return (<ChatContext.Provider value={{
        user,
        setUser,
        selectedChat,
        setSelectedChat,
        chats,
        setChats,
        notification,
        setNotification,
        error,
        setError,
        onlineUsers,
        setOnlineUsers,
    }
    }>
        {children}
    </ChatContext.Provider>
    );
};

export const useChatState = (): ChatContextType => {
    const context = React.useContext(ChatContext);
    if (!context) {
        throw new Error("useChatState must be used within a ChatProvider");
    }
    return context;
}

export default ChatProvider;