import React from 'react';
import { Paper } from '@mui/material';
import SingleChat from './SingleChat';

const ChatBox = ({ fetchAgain, setFetchAgain }: { fetchAgain: boolean, setFetchAgain: React.Dispatch<React.SetStateAction<boolean>> }) => {
    return (
        <Paper sx={{ marginRight: '10px' }}>
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </Paper>
    );
};

export default ChatBox;
