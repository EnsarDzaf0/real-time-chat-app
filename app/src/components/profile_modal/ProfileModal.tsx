import React from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Typography, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { User } from '../../types/user';
import { convertDate, convertDateTime } from '../../utils/dateConverter';

const ModalTitle = styled(DialogTitle)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled(IconButton)`
  margin-left: auto;
`;

interface ProfileModalProps {
    open: boolean;
    onClose: () => void;
    user: User | null;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ open, onClose, user }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
            <ModalTitle>
                <Typography variant='h6'>Profile</Typography>
                <CloseButton aria-label='close' onClick={onClose}>
                    <CloseIcon />
                </CloseButton>
            </ModalTitle>
            <DialogContent>
                <Box
                    component="img"
                    src={user?.image ?? ''}
                    alt={user?.name}
                    sx={{ width: '100px', height: '100px', borderRadius: 10, border: '1px solid #ccc', marginBottom: '10px' }}
                />
                <Typography variant="body1" sx={{ textAlign: 'left' }}>
                    <strong>{user?.name}</strong>
                </Typography>
                <Typography variant="body2" sx={{ textAlign: 'left' }}>
                    Username: {user?.username}
                </Typography>
                <Typography variant="body1" sx={{ textAlign: 'left' }}>
                    Email: {user?.email}
                </Typography>
                <Typography variant="body1"><strong>Date of Birth:</strong></Typography>
                <Typography variant="body2">{convertDate(user?.dateOfBirth)}</Typography>
            </DialogContent>
        </Dialog >
    );
};

export default ProfileModal;
