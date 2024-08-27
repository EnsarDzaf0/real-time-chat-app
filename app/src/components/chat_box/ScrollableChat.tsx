import { isSameSenderMargin } from '../../utils/chatLogic';
import { useChatState } from '../../context/chat';
import { useEffect, useRef } from 'react';
import { Box } from '@mui/material';
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
                <div style={{ display: 'flex' }} key={m.id}>
                    <span
                        style={{
                            backgroundColor: `${m.sender?.id === user?.id ? '#BEE3F8' : '#B9F5D0'}`,
                            borderRadius: '20px',
                            padding: '5px 15px',
                            maxWidth: '75%',
                            marginLeft: isSameSenderMargin(messages, m, i, user?.id || 0),
                            marginTop: '3px',
                        }}>
                        {m.content}
                    </span>
                </div>
            ))}
        </Box>
    );
};
export default ScrollableChat;