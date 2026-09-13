// Copyright (c) 2026 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { useState } from 'react';
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useShareDriveChat } from '../apiClients/googleDriveApi';
import { useDriveAuth } from '../apiClients/DriveAuthProvider';
import { selectUser } from '../redux/slices/userSlice';
import { useSelector } from 'react-redux';

interface ShareModalProps {
  driveFileId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ShareModal({
  driveFileId,
  isOpen,
  onClose,
  onSuccess,
}: ShareModalProps) {
  const [emailAddress, setEmailAddress] = useState('');
  const shareDriveChat = useShareDriveChat();
  const { getToken } = useDriveAuth();
  const user = useSelector(selectUser);

  const handleShare = async () => {
    const email = emailAddress.trim();

    if (!email) {
      return;
    }

    const accessToken = await getToken(true, user?.email);
    await shareDriveChat.mutateAsync({ driveFileId, emailAddress: email, accessToken });
    await navigator.clipboard.writeText(`${window.location.origin}/chatshared/${driveFileId}`);
    onSuccess();
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Share Chat</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter the Google account email address that should be allowed to view this chat.
        </DialogContentText>
        {shareDriveChat.isError && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {shareDriveChat.error instanceof Error ? shareDriveChat.error.message : 'Unable to share this chat'}
          </Alert>
        )}
        <TextField
          autoFocus
          fullWidth
          margin="normal"
          label="Google account email"
          type="email"
          value={emailAddress}
          onChange={(event) => setEmailAddress(event.target.value)}
          disabled={shareDriveChat.isPending}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={shareDriveChat.isPending}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleShare}
          disabled={!emailAddress.trim() || shareDriveChat.isPending}
          startIcon={shareDriveChat.isPending ? <CircularProgress size={16} /> : undefined}
        >
          Share & Copy Link
        </Button>
      </DialogActions>
    </Dialog>
  );
}
