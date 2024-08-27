import React, { useEffect, useState } from 'react';
import { Box, Button, Paper, Stack, Typography } from '@mui/material';
import { styled } from '@mui/system';
import { useChatState } from '../../context/chat';
import { getChats } from '../../services/chat';
import { getSender } from '../../utils/chatLogic';
//import GroupChatModal from '../Modals/GroupChatModal';
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

const UserChats = ({ fetchAgain }: { fetchAgain: any }) => {
    const [loggedUser, setLoggedUser] = useState<User | null>(null);
    const { selectedChat, setSelectedChat, chats, setChats } = useChatState();
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
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
        <Paper sx={{ minHeight: '85vh', padding: 2 }}>
            <Stack direction='row' alignItems='center' mb={2}>
                <TitleText>My Chats</TitleText>
                <Button variant='contained' onClick={() => setIsModalOpen(true)}>
                    New Group Chat
                </Button>
            </Stack>

            {chats?.map((chat) => (
                <Box
                    key={chat.id}
                    onClick={() => setSelectedChat(chat)}
                    sx={{
                        width: 250,
                        margin: 2,
                        padding: 2,
                        backgroundColor: selectedChat?.id === chat?.id ? 'primary.main' : '#DCDCDC',
                        borderRadius: 4,
                        '&:hover': {
                            backgroundColor: 'primary.main',
                            opacity: [0.9, 0.8, 0.7],
                        },
                    }}>
                    <Typography sx={{ fontWeight: 'bold' }}>
                        {!chat?.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}
                    </Typography>
                </Box>
            ))}
            {/* <GroupChatModal open={isModalOpen} onClose={() => setIsModalOpen(false)} /> */}
        </Paper>
    )
};

export default UserChats;