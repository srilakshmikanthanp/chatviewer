// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { useDownloadDriveChat } from "../apiClients/googleDriveApi";
import { useDriveAuth } from "../apiClients/DriveAuthProvider";
import { blobToMsg } from "../utilities/functions";
import { createViewerState } from "../utilities/constructors";
import { Header, Footer } from "../components";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import React, { useState } from "react";
import { selectUser } from "../redux/slices/userSlice";
import { useSelector } from "react-redux";
import {
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Typography,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

const ChatSharedContainer = styled("div")`
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 104px 24px 80px;
  box-sizing: border-box;
`;

const ConnectCard = styled(Card)`
  width: 100%;
  max-width: 460px;
  border-radius: 16px !important;
`;

const FileIcon = styled(Box)`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  background: rgba(25, 118, 210, 0.08);
  color: #1976d2;
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
      navigate('/viewchat', { state: createViewerState({ driveFileId }, messages), replace: true });
    } catch {
      setIsDownloadErrorOpen(true);
    } finally {
      setIsConnecting(false);
    }
  };

  // Body
  const Body = () => (
    <ChatSharedContainer>
      <ConnectCard elevation={2}>
        <CardContent sx={{ p: 4, textAlign: "center" }}>
          <FileIcon>
            <DescriptionOutlinedIcon fontSize="large" />
          </FileIcon>

          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            View shared conversation
          </Typography>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            This conversation is stored in Google Drive. Connect your
            Google account to verify that you have permission to view it.
          </Typography>

          <Button
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleConnect}
            disabled={isConnecting}
            sx={{
              py: 1.3,
              textTransform: "none",
              fontSize: "1rem",
            }}
          >
            {isConnecting ? "Connecting to Google Drive..." : "Continue with Google Drive"}
          </Button>

          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1,
              mt: 3,
              textAlign: "left",
            }}
          >
            <LockOutlinedIcon
              fontSize="small"
              sx={{ mt: "2px", color: "text.secondary" }}
            />

            <Typography variant="caption" color="text.secondary">
              Your Drive stays private. Chatviewer only uses Google Drive
              access to retrieve this shared conversation.
            </Typography>
          </Box>
        </CardContent>

        {isConnecting && <LinearProgress />}
      </ConnectCard>

      <Dialog
        open={isDownloadErrorOpen}
        onClose={() => setIsDownloadErrorOpen(false)}
      >
        <DialogTitle>Unable to open conversation</DialogTitle>

        <DialogContent>
          <Typography color="text.secondary">
            We couldn't retrieve this conversation. It may have been
            deleted, moved, or you may no longer have permission to view it.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setIsDownloadErrorOpen(false)}>
            Close
          </Button>
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
