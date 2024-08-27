import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    styled,
    Box,
    Button,
    TextField,
    Chip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useChatState } from '../../context/chat';
import { searchUser } from '../../services/user';
import UserListItem from '../user/UserListItem';
import { createGroupChat } from '../../services/chat';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import socket from '../../utils/socket';
import { User } from '../../types/user';

const ModalTitle = styled(DialogTitle)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CreateChatButton = styled(Button)`
  text-transform: none; /* Remove uppercase */
`;

const CloseButton = styled(IconButton)`
  margin-left: auto;
`;

interface GroupChatModalProps {
    open: boolean;
    onClose: () => void;
}

const GroupChatModal: React.FC<GroupChatModalProps> = ({ open, onClose }) => {
    const [search, setSearch] = useState<string>('');
    const [searchResult, setSearchResult] = useState<User[]>([]);
    const [groupName, setGroupName] = useState<string>('');
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

    const { chats, setChats } = useChatState();

    const handleSearch = async (query: string) => {
        setSearch(query);
        if (!query) {
            return;
        }
        const data = await searchUser(search);
        setSearchResult(data);
    };

    const handleGroup = (userToAdd: User) => {
        if (selectedUsers.includes(userToAdd)) {
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const handleRemove = (userToRemove: User) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel !== userToRemove));
    };

    const handleCloseAfterSubmit = () => {
        setGroupName('');
        setSelectedUsers([]);
        setSearch('');
        onClose();
    };

    const handleCreateChat = async () => {
        try {
            if (!groupName) {
                throw new Error('Please enter a group name');
            }
            if (selectedUsers.length < 2) {
                throw new Error('Please select at least 2 users to create a group chat');
            }
            const createdGroup = await createGroupChat(selectedUsers.map((user) => user.id), groupName);
            if (createdGroup) {
                socket.emit('newGroup', createdGroup);
                setChats([createdGroup, ...chats]);
                handleCloseAfterSubmit();
            }
        } catch (error) {
            toast.error((error as Error).message);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
            <ModalTitle>
                <Typography variant='h6'>Create Group Chat</Typography>
                <CloseButton aria-label='close' onClick={onClose}>
                    <CloseIcon />
                </CloseButton>
            </ModalTitle>
            <DialogContent>
                <TextField
                    label='Group Name'
                    variant='outlined'
                    name='groupName'
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    fullWidth
                    margin='normal'
                    required
                />
                <TextField
                    label='Member Names'
                    variant='outlined'
                    name='memberNames'
                    value={search}
                    onChange={(e) => handleSearch(e.target.value)}
                    fullWidth
                    margin='normal'
                    required
                />
                {selectedUsers.map((user) => (
                    <Chip
                        label={`${user.name} X`}
                        variant='outlined'
                        sx={{ backgroundColor: 'primary.main', cursor: 'pointer' }}
                        onClick={() => handleRemove(user)}
                    />
                ))}

                {searchResult &&
                    search &&
                    searchResult.map((user) => (
                        <UserListItem user={user} key={user.id} handleFunction={() => handleGroup(user)} />
                    ))}
            </DialogContent>
            <Box
                sx={{ display: 'flex', justifyContent: 'flex-end', padding: '8px', marginRight: '20px' }}>
                <CreateChatButton variant='contained' color='primary' onClick={handleCreateChat}>
                    Create Chat
                </CreateChatButton>
            </Box>
            <ToastContainer autoClose={3000} />
        </Dialog>
    );
};

export default GroupChatModal;
