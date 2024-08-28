import { isSameSenderMargin } from '../../utils/chatLogic';
import { useChatState } from '../../context/chat';
import { useEffect, useRef } from 'react';
import { Box, Avatar, Typography, Stack } from '@mui/material';
import { Message } from '../../types/chatContext';

interface ScrollableChatProps {
    messages: Message[];
}

const ScrollableChat: React.FC<ScrollableChatProps> = ({ messages }) => {
    const { user } = useChatState();
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollChatToBottom();
    }, [messages]);

    const scrollChatToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    };

    return (
        <Box
            ref={chatContainerRef}
            sx={{
                flexGrow: 1,
                overflowY: 'auto',
                maxHeight: '75vh',
                marginBottom: '10px',
                scrollBehavior: 'smooth',
            }}>
            {messages.map((m, i) => (
                <Stack
                    direction="row"
                    alignItems="center"
                    spacing={1}
                    key={m.id}
                    sx={{
                        marginBottom: '10px',
                        justifyContent: m.sender?.id === user?.id ? 'flex-end' : 'flex-start',
                    }}>
                    {m.sender?.id !== user?.id && (
                        <Avatar src={m.sender?.image} alt={m.sender?.username} />
                    )}
                    <Box
                        sx={{
                            backgroundColor: `${m.sender?.id === user?.id ? '#BEE3F8' : '#B9F5D0'}`,
                            borderRadius: '20px',
                            padding: '5px 15px',
                            maxWidth: '75%',
                            marginLeft: m.sender?.id === user?.id ? 'auto' : isSameSenderMargin(messages, m, i, user?.id || 0),
                            marginTop: '3px',
                        }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {m.sender?.username}
                        </Typography>
                        <Typography variant="body2">
                            {m.content}
                        </Typography>
                    </Box>
                    {m.sender?.id === user?.id && (
                        <Avatar src={m.sender?.image} alt={m.sender?.username} />
                    )}
                </Stack>
            ))}
        </Box>
    );
};
export default ScrollableChat;