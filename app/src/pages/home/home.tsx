import React, { useState } from 'react';
import {
    Grid
} from '@mui/material';
import SideDrawer from '../../components/sidebar/SideBar';
import UserChats from '../../components/user_chats/UserChats';
import ChatBox from '../../components/chat_box/ChatBox';

export default function HomePage() {
    const [fetchAgain, setFetchAgain] = useState<boolean>(false);

    return (
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <SideDrawer />
            </Grid>
            <Grid item xs={12} sm={4}>
                <UserChats fetchAgain={fetchAgain} />
            </Grid>
            <Grid item xs={12} sm={8}>
                <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            </Grid>
        </Grid>
    );
}
