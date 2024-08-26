import { Typography, Button, Box } from '@mui/material';
import { clearCookies } from '../../services/services';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/user';

export default function HomePage() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        clearCookies();
        navigate('/login');
    }

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" color={"beige"}>Real-time Chat</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button variant="contained" color="secondary" onClick={() => handleLogout()} sx={{ mr: 2 }}>
                        Logout
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}
