import { Typography, Box, IconButton } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import { User } from '../../types/user';

interface UserListItemProps {
    user: User;
    handleFunction: () => void;
}

const UserListItem: React.FC<UserListItemProps> = ({ user, handleFunction }) => {
    return (
        <Box
            onClick={handleFunction}
            sx={{
                display: 'flex',
                alignItems: 'center',
                width: 250,
                margin: 2,
                padding: 2,
                backgroundColor: '#DCDCDC',
                borderRadius: 4,
                '&:hover': {
                    backgroundColor: 'primary.main',
                    opacity: [0.9, 0.8, 0.7],
                },
            }}>
            <Typography sx={{ fontWeight: 'bold' }}>{user.name}</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton aria-label='status'>
                <CircleIcon style={{ color: user.logged ? 'green' : 'red' }} />
            </IconButton>
        </Box>
    );
};
export default UserListItem;
