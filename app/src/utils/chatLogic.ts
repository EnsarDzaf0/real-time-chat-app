import { User } from "../types/user";
import { Message } from "../types/chatContext";

export const getSender = (loggedUser: User | null, users: User[]) => {
    return users[0].id === loggedUser?.id ? users[1]?.username : users[0]?.username;
};

export const getSenderFull = (loggedUser: User | null, users: User[]) => {
    return users[0].id === loggedUser?.id ? users[1] : users[0];
};

export const isSameSenderMargin = (messages: Message[], m: Message, i: number, userId: number) => {
    if (
        i < messages.length - 1 &&
        messages[i + 1].sender?.id === m.sender?.id &&
        messages[i].sender?.id !== userId
    )
        return 33;
    else if (
        (i < messages.length - 1 &&
            messages[i + 1].sender?.id !== m.sender?.id &&
            messages[i].sender?.id !== userId) ||
        (i === messages.length - 1 && messages[i].sender?.id !== userId)
    )
        return 0;
    else return 'auto';
};
