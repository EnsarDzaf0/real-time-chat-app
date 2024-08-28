import { Box, FormControl, Input, Paper, Stack, Typography } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useChatState } from '../../context/chat';
import UpdateGroupChatModal from '../group_modal/UpdateGroupModal';
import { getSender, getSenderFull } from '../../utils/chatLogic';
import ProfileModal from '../profile_modal/ProfileModal';
import { useEffect, useState } from 'react';
import { getMessages, messageSend } from '../../services/message';
import ScrollableChat from './ScrollableChat';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import socket from '../../utils/socket';
import { Message } from '../../types/chatContext';
import { User } from '../../types/user';

interface SingleChatProps {
    fetchAgain: boolean;
    setFetchAgain: React.Dispatch<React.SetStateAction<boolean>>;
}

const SingleChat: React.FC<SingleChatProps> = ({ fetchAgain, setFetchAgain }) => {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState<boolean>(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState<string>('');
    const [socketConnected, setSocketConnected] = useState<boolean>(false);
    const [typing, setTyping] = useState<boolean>(false);
    const [isTyping, setIsTyping] = useState<boolean>(false);
    const [typingUser, setTypingUser] = useState<string>('');

    const { user, selectedChat, notification, setNotification } = useChatState();

    const fetchMessages = async () => {
        if (!selectedChat) {
            return;
        }

        const data = await getMessages(selectedChat.id);
        setMessages(data);

        socket.emit('joinChat', selectedChat.id);
    };

    useEffect(() => {
        const currentChatId = selectedChat?.id;

        socket.emit('setup', user);
        socket.on('connected', () => setSocketConnected(true));
        socket.on('typing', (userName, chatId) => {
            if (chatId === currentChatId) {
                setTypingUser(userName || '');
                setIsTyping(true);
            }
        });

        socket.on('stopTyping', (chatId) => {
            if (chatId === currentChatId) {
                setIsTyping(false);
            }
        });

        return () => {
            socket.off('connected');
            socket.off('typing');
            socket.off('stopTyping');
        };
    }, [user, selectedChat]);

    useEffect(() => {
        fetchMessages();

        // selectedChatCompare = selectedChat;
        // eslint-disable-next-line
    }, [selectedChat]);

    useEffect(() => {
        socket.on('messageReceived', (newMessageReceived) => {
            const isUserInChat = selectedChat?.id === newMessageReceived.chat.id;
            const isUserRecipient = newMessageReceived.chat.users.some(
                (u: User) => u.id === user?.id
            );

            if (!isUserInChat && isUserRecipient) {
                if (!notification.some((n) => n.id === newMessageReceived.id)) {
                    setNotification([newMessageReceived, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else if (isUserInChat) {
                setMessages([...messages, newMessageReceived]);
            }
        });

        return () => {
            socket.off('messageReceived');
        };
    }, [selectedChat, notification, messages, user, fetchAgain, setFetchAgain, setNotification]);

    const sendMessage = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        const updateData = {
            content: newMessage,
            chatId: selectedChat?.id,
            senderId: user?.id,
        };
        if (e.key === 'Enter' && newMessage) {
            socket.emit('stopTyping', selectedChat?.id);
            setNewMessage('');
            try {
                const data = await messageSend(updateData?.chatId || 0, updateData.content);
                socket.emit('newMessage', data);
                setMessages([...messages, data]);
            } catch (error) {
                toast.error((error as Error).message);
            }
        }
    };

    const typingHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewMessage(e.target.value);
        if (!socketConnected) return;
        if (!typing) {
            setTyping(true);
            socket.emit('typing', selectedChat?.id, user?.name);
        }
        let lastTypingTime = new Date().getTime();
        let timerLength = 3000;

        setTimeout(() => {
            let timeNow = new Date().getTime();
            let timeDiff = timeNow - lastTypingTime;

            if (timeDiff >= timerLength && typing) {
                socket.emit('stopTyping', selectedChat?.id);
                setTyping(false);
            }
        }, timerLength);
    };

    return (
        <>
            {selectedChat ? (
                <>
                    <Typography variant='h5'>
                        {!selectedChat.isGroupChat ? (
                            <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{
                                padding: '10px',
                            }}>
                                <span>{getSender(user, selectedChat.users)}</span>
                                <ProfileModal
                                    user={getSenderFull(user, selectedChat.users)}
                                    open={isModalOpen}
                                    onClose={() => setIsModalOpen(false)}
                                />
                                <VisibilityIcon sx={{ marginRight: '30px' }} onClick={() => setIsModalOpen(true)} />
                            </Stack>
                        ) : (
                            <>
                                <Stack direction='row' alignItems='center' justifyContent='space-between' sx={{
                                    padding: '10px',
                                }}>
                                    <span>{selectedChat.chatName.toUpperCase()}</span>
                                    <UpdateGroupChatModal
                                        fetchAgain={fetchAgain}
                                        setFetchAgain={setFetchAgain}
                                        fetchMessages={fetchMessages}
                                        open={isUpdateModalOpen}
                                        onClose={() => setIsUpdateModalOpen(false)}
                                    />
                                    <VisibilityIcon
                                        sx={{ marginRight: '30px' }}
                                        onClick={() => setIsUpdateModalOpen(true)}
                                    />
                                </Stack>
                            </>
                        )}
                    </Typography>
                    <Box
                        sx={{
                            minHeight: '85vh',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'flex-end',
                        }}>
                        <ScrollableChat messages={messages} />
                        <FormControl onKeyDown={sendMessage} required sx={{ marginTop: '3px', padding: '10px' }}>
                            {isTyping && <div>{`${typingUser} typing...`}</div>}
                            <Input placeholder='Enter a message...' onChange={typingHandler} value={newMessage} />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Paper
                    sx={{
                        minHeight: '85vh',
                        padding: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    <Typography variant='h5' align='center'>
                        Click on a user to start chatting
                    </Typography>
                </Paper>
            )}
            <ToastContainer autoClose={30000} />
        </>
    );
};

export default SingleChat;