import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    Typography,
    styled,
    Chip,
    TextField,
    Box,
    Button,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import UserListItem from '../user/UserListItem';
import { useChatState } from '../../context/chat';
import {
    addUserToGroupChat,
    removeUserFromGroupChat,
    updateGroupChat,
} from '../../services/chat';
import { searchUser } from '../../services/user';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import socket from '../../utils/socket';
import { User } from '../../types/user';

const ModalTitle = styled(DialogTitle)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled(IconButton)`
  margin-left: auto;
`;
const UpdateGroupButton = styled(Button)`
  text-transform: none; /* Remove uppercase */
  margin-left: 5px;
  padding: 12px;
`;

const LeaveGroupButton = styled(Button)`
  text-transform: none; /* Remove uppercase */
`;

interface UpdateGroupChatModalProps {
    fetchAgain: any;
    setFetchAgain: any;
    open: boolean;
    onClose: () => void;
    fetchMessages: any;
}

const UpdateGroupChatModal: React.FC<UpdateGroupChatModalProps> = ({ fetchAgain, setFetchAgain, open, onClose, fetchMessages }) => {
    const [search, setSearch] = useState<string>('');
    const [searchResult, setSearchResult] = useState<User[]>([]);
    const [groupName, setGroupName] = useState<string>('');

    const { selectedChat, setSelectedChat, user, setChats } = useChatState();
    //const loggedUser = localStorage.getItem('user');

    const handleSearch = async (query: string) => {
        setSearch(query);
        if (!query) {
            return;
        }
        const data = await searchUser(search);
        setSearchResult(data);
    };

    const handleRemoveUser = async (userToRemove: User) => {
        try {
            if (selectedChat?.groupAdmin?.id !== user?.id && userToRemove.id !== user?.id) {
                throw new Error('You are not the admin of this group');
            }
            console.log('selectedChat?.id', selectedChat?.id);
            console.log('userToRemove.id', userToRemove.id);


            const data = await removeUserFromGroupChat(selectedChat?.id || 0, userToRemove.id);
            userToRemove.id === user?.id ? setSelectedChat(null) : setSelectedChat(data);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
        } catch (error) {
            toast.error((error as Error).message);
        }
    };

    const handleAddUser = async (userToAdd: User) => {
        try {
            if (selectedChat?.users.find((user) => user.id === userToAdd.id)) {
                throw new Error('User already in the group');
            }
            if (selectedChat?.groupAdmin?.id !== user?.id) {
                throw new Error('You are not the admin of this group');
            }
            const data = await addUserToGroupChat(selectedChat?.id || 0, userToAdd.id);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
        } catch (error) {
            toast.error((error as Error).message);
        }
    };

    const handleUpdate = async () => {
        try {
            if (!groupName) {
                throw new Error('Group name is required');
            }
            if (selectedChat?.groupAdmin?.id !== user?.id) {
                throw new Error('You are not the admin of this group');
            }
            const updatedGroup = await updateGroupChat(selectedChat?.id || 0, groupName);
            if (updatedGroup) {
                socket.emit('updateGroup', updatedGroup);
                setSelectedChat(updatedGroup);
                setFetchAgain(!fetchAgain);
                setGroupName('');
                onClose();
            }
        } catch (error) {
            toast.error((error as Error).message);
        }
    };
    return (
        <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
            <ModalTitle>
                <Typography variant='h6'>{selectedChat?.chatName}</Typography>
                <CloseButton aria-label='close' onClick={onClose}>
                    <CloseIcon />
                </CloseButton>
            </ModalTitle>
            <DialogContent>
                {selectedChat?.users.map((u) => {

                    if (u.id !== user?.id) {
                        return (
                            <Chip
                                key={u.id}
                                label={
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                            <span style={{ marginLeft: '8px' }}>{u.username} X</span>
                                        </div>
                                    </>
                                }
                                variant='outlined'
                                sx={{ backgroundColor: 'white', cursor: 'pointer' }}
                                onClick={() => handleRemoveUser(u)}
                            />
                        );
                    }
                    return null;
                })}
                {selectedChat?.users.length === 0 && (
                    <Typography sx={{ color: 'red' }}>You are alone in the group*</Typography>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                    <UpdateGroupButton
                        variant='contained'
                        color='primary'
                        sx={{ height: '100%' }}
                        size='large'
                        disabled={!groupName}
                        onClick={handleUpdate}>
                        Update
                    </UpdateGroupButton>
                </Box>

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

                {searchResult &&
                    search &&
                    searchResult.map((user) => (
                        <UserListItem user={user} key={user.id} handleFunction={() => handleAddUser(user)} />
                    ))}
            </DialogContent>
            <Box
                sx={{ display: 'flex', justifyContent: 'flex-end', padding: '8px', marginRight: '20px' }}>
                <LeaveGroupButton
                    variant='contained'
                    color='error'
                    onClick={async () => {
                        await removeUserFromGroupChat(selectedChat?.id || 0, user?.id || 0);
                        setSelectedChat(null);
                        setChats(
                            (prev) => prev.filter((chat) => chat.id !== selectedChat?.id)
                        );
                        onClose();
                    }}>
                    Leave Group
                </LeaveGroupButton>
            </Box>
            <ToastContainer autoClose={3000} />
        </Dialog>
    );
};
export default UpdateGroupChatModal;