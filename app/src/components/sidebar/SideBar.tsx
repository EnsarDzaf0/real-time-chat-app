import { useState, MouseEvent, ChangeEvent } from 'react';
import {
    Typography,
    Button,
    Paper,
    IconButton,
    Menu,
    MenuItem,
    Drawer,
    List,
    ListItem,
    TextField,
    Badge
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { styled } from '@mui/system';
import { clearCookies } from '../../services/services';
import { useNavigate } from 'react-router-dom';
import { logout, searchUser } from '../../services/user';
import { createChat } from '../../services/chat';
import { useChatState } from '../../context/chat';
import ProfileModal from '../../components/profile_modal/ProfileModal';
import UserListItem from '../../components/user/UserListItem';
import { getSender } from '../../utils/chatLogic';
import { User } from '../../types/user';
import { Chat } from '../../types/chatContext';

const SideDrawerContainer = styled(Paper)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
`;

const SearchContainer = styled('div')`
  display: flex;
  align-items: center;
`;

const SearchInput = styled(Typography)`
  margin-right: 8px;
  cursor: pointer;
`;

const LiveChatText = styled(Typography)`
  flex-grow: 1;
  text-align: center;
`;
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

const SideBar = () => {
    const { user, setSelectedChat, chats, setChats, notification, setNotification } = useChatState();
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const [searchResult, setSearchResult] = useState<User[]>();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

    const navigate = useNavigate();

    const handleMenuOpen = (event: MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotificationOpen = (event: MouseEvent<HTMLButtonElement>) => {
        setNotificationAnchorEl(event.currentTarget);
    };

    const handleNotificationClose = () => {
        setNotificationAnchorEl(null);
    };

    const handleOpenModal = () => {
        setIsProfileModalOpen(true);
        handleMenuClose();
    };

    const handleCloseModal = () => {
        setIsProfileModalOpen(false);
    };

    const handleDrawerOpen = async () => {
        setIsDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setIsDrawerOpen(false);
    };

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(event.target.value);
    };

    const handleSearchSubmit = async () => {
        setSearchResult(await searchUser(searchValue));
    };

    const accessChat = async (userId: number) => {
        const data: Chat = await createChat(userId);
        if (!chats.find((c) => c.id === data.id)) {
            setChats([data, ...chats]);
        }
        setSelectedChat(data);
        handleDrawerClose();
    };

    const handleLogout = async () => {
        await logout();
        clearCookies();
        setSelectedChat(null);
        navigate('/login');
    }

    return (
        <>
            <SideDrawerContainer elevation={2}>
                <SearchContainer>
                    <SearchInput variant='body1' onClick={handleDrawerOpen}>
                        Search user
                    </SearchInput>
                    <IconButton aria-label='search' onClick={handleDrawerOpen}>
                        <SearchIcon />
                    </IconButton>
                </SearchContainer>
                <LiveChatText variant='body1'>Live Chat Application</LiveChatText>
                <div>
                    <IconButton aria-label='notifications' onClick={handleNotificationOpen}>
                        <Badge badgeContent={notification.length} color='secondary'>
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <Menu
                        anchorEl={notificationAnchorEl}
                        open={Boolean(notificationAnchorEl)}
                        onClose={handleNotificationClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}>
                        {!notification.length && 'No New Messages'}
                        {notification.map((n) => {
                            return (
                                <MenuItem
                                    key={n.id}
                                    onClick={() => {
                                        setSelectedChat(n.chat);
                                        setNotification(notification.filter((notif) => notif !== n));
                                        handleNotificationClose();
                                    }}>
                                    {n.chat.isGroupChat
                                        ? `New Message in ${n.chat.chatName}`
                                        : `New Message from ${getSender(user, n.chat.users)} `}
                                </MenuItem>
                            );
                        })}
                    </Menu>
                    <IconButton aria-label='profile' onClick={handleMenuOpen}>
                        <AccountCircleIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}>
                        <MenuItem onClick={handleOpenModal}>My Profile</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </div>
            </SideDrawerContainer>
            <Drawer anchor='left' open={isDrawerOpen} onClose={handleDrawerClose}>
                <TitleText>Search user</TitleText>
                <List>
                    <ListItem>
                        <TextField
                            placeholder='Search user'
                            value={searchValue}
                            size='small'
                            onChange={handleSearchChange}
                        />
                        <Button
                            onClick={handleSearchSubmit}
                            size='small'
                            variant='outlined'
                            sx={{ ml: 2 }}
                            disabled={!searchValue}>
                            GO
                        </Button>
                    </ListItem>
                    {searchResult?.map((user: User) => (
                        <UserListItem key={user.id} user={user} handleFunction={() => accessChat(user.id)} />
                    ))}
                </List>
            </Drawer>
            <ProfileModal open={isProfileModalOpen} onClose={handleCloseModal} user={user} />
        </>
    )
};

export default SideBar;