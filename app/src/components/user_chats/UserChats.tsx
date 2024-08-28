import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useChatState } from '../../context/chat';
import { getChats } from '../../services/chat';
import { getSender } from '../../utils/chatLogic';
import GroupChatModal from '../group_modal/GroupModal';
import socket from '../../utils/socket';
import { User } from '../../types/user';

const TitleText = styled(Typography)`
  margin-right: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left: 20px;
  padding-top: 10px;
  font-size: 20px;
  font-weight: bold;
  color: black;
`;

const NewGroupButton = styled(Button)`
    margin-top: 5px;
    padding: 12px;
    background-color: #0093E9;
    background-image: linear-gradient(160deg, #D9AFD9 0%, #97D9E1 100%);
    color: black;
`;

const UserChats = ({ fetchAgain }: { fetchAgain: boolean }) => {
    const [loggedUser, setLoggedUser] = useState<User | null>(null);
    const { selectedChat, setSelectedChat, chats, setChats } = useChatState();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const userInfo = localStorage.getItem('user');

        if (userInfo) {
            const parsedUserInfo: User = JSON.parse(userInfo);
            setLoggedUser(parsedUserInfo);
        }
        const fetchData = async () => {
            const data = await getChats();
            setChats(data);
        };
        fetchData();
    }, [setChats, fetchAgain]);

    useEffect(() => {
        socket.on('groupCreated', (newGroup) => {
            setChats([newGroup, ...chats]);
        });
        socket.on('groupUpdated', (newGroup) => {
            setChats((prevChats) => {
                const updatedChats = prevChats.map((chat) => {
                    if (chat.id === newGroup.id) {
                        return newGroup;
                    }
                    return chat;
                });
                return updatedChats;
            });
        });
    }, [chats, setChats]);

    return (
        <Paper sx={{ minHeight: '85vh', padding: 2, maxWidth: '35vh' }}>
            <Stack direction='column' alignItems='center' mb={2}>
                <TitleText>My Chats</TitleText>
                <NewGroupButton variant='contained' onClick={() => setIsModalOpen(true)}>
                    New Group Chat
                </NewGroupButton>
            </Stack>

            {chats?.map((chat) => (
                <Box
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    sx={{
                        minWidth: 200,
                        margin: 2,
                        padding: 2,
                        backgroundColor: selectedChat?.id === chat?.id ? '#0093E9' : 'whitesmoke',
                        backgroundImage: selectedChat?.id === chat?.id ? 'linear-gradient(160deg, #D9AFD9 0%, #97D9E1 100%)' : 'none',
                        borderRadius: 4,
                        '&:hover': {
                            backgroundColor: '#D9AFD9',
                            opacity: [0.9, 0.8, 0.7],
                        },
                        color: selectedChat?.id === chat?.id ? '#00526c' : '#006e8a',
                    }}>
                    <Typography sx={{ fontWeight: 'bold' }}>
                        {!chat?.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                    </Typography>
                </Box>
            ))}
            <GroupChatModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </Paper>
    )
};

export default UserChats;