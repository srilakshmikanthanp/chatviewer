// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { useDownloadDriveChat } from "../apiClients/googleDriveApi";
import { useDriveAuth } from "../apiClients/DriveAuthProvider";
import { blobToMsg } from "../utilities/functions";
import { createViewerState } from "../utilities/constructors";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress } from "@mui/material";
import { Header, Footer } from "../components";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import React, { useState } from "react";
import { selectUser } from "../redux/slices/userSlice";
import { useSelector } from "react-redux";

const ChatSharedContainer = styled('div')`
  justify-content: center;
  align-items: center;
  min-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
`;

/**
 * ChatShared is a component that is used to view the shared chat.
 */
export default function Chatshared() {
  // The route value is the Google Drive file ID.
  const downloadDriveChat = useDownloadDriveChat();
  const { getToken } = useDriveAuth();
  const user = useSelector(selectUser);
  const { driveFileId } = useParams<{ driveFileId: string }>();
  const [isDownloadErrorOpen, setIsDownloadErrorOpen] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  // create the navigate hook
  const navigate = useNavigate();

  const handleConnect = async () => {
    if (!driveFileId) {
      setIsDownloadErrorOpen(true);
      return;
    }

    try {
      setIsConnecting(true);
      const accessToken = await getToken(true, user?.email);
      const blob = await downloadDriveChat.mutateAsync({ driveFileId, accessToken });
      const messages = await blobToMsg(blob);
      navigate('/viewchat', { state: createViewerState({ driveFileId }, messages), replace: true});
    } catch {
      setIsDownloadErrorOpen(true);
    } finally {
      setIsConnecting(false);
    }
  };

  // Body
  const Body = () => (
    <ChatSharedContainer>
      <Alert severity="info">
        Connect Google Drive to view this shared chat.
        <Button onClick={handleConnect} disabled={isConnecting}>
          {isConnecting ? 'Opening Google Drive...' : 'Connect Google Drive'}
        </Button>
      </Alert>
      {isConnecting && <LinearProgress sx={{ width: "250px" }} />}
      <Dialog
        open={isDownloadErrorOpen}
        onClose={() => setIsDownloadErrorOpen(false)}
      >
        <DialogTitle>Chat unavailable</DialogTitle>
        <DialogContent>
          This file may have been deleted from Google Drive or you may no longer have permission to view it.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDownloadErrorOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </ChatSharedContainer>
  );

  // get the token from params
  return (
    <React.Fragment>
      <Header />
      <Body />
      <Footer />
    </React.Fragment>
  );
}
