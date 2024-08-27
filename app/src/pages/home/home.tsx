import React, { useState } from 'react';
import {
    Typography,
    Button,
    Box,
    Grid
} from '@mui/material';
import SideDrawer from '../../components/sidebar/SideBar';
import UserChats from '../../components/user_chats/UserChats';

export default function HomePage() {
    const [fetchAgain, setFetchAgain] = useState();

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <SideDrawer />
            </Grid>
            <Grid item xs={12} sm={4}>
                <UserChats fetchAgain={fetchAgain} />
            </Grid>
            <Grid item xs={12} sm={8}>
                {/* <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} /> */}
            </Grid>
        </Grid>
    )
    {/* <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" color={"beige"}>Real-time Chat</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Button variant="contained" color="secondary" onClick={() => handleLogout()} sx={{ mr: 2 }}>
                        Logout
                    </Button>
                </Box>
            </Box>
        </Box> */}

}
