// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { IViewchatState } from "../types/pagestates";
import { Container, Row, Col } from "react-bootstrap";
import React, { useState, useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Selector, ShareModal } from "../modals";
import { useDownloadDriveChat } from "../apiClients/googleDriveApi";
import { useDriveAuth } from "../apiClients/DriveAuthProvider";
import { IUser } from "../types";
import { saveAs } from 'file-saver';
import {
  selectUser,
  selectJwt
} from "../redux/slices/userSlice";
import {
  Header,
  ChatBox,
  Footer
} from "../components";
import {
  SpeedDialAction,
  SpeedDial,
  SpeedDialIcon,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  CloudDownload,
  Person,
  Share,
  Construction,
  Close,
} from '@mui/icons-material';

interface IChatBoxProps {
  onDownload: () => void;
  onShare: () => void;
  onAuthor: () => void;
  downloadable: boolean;
  shareable: boolean;
  canChangeAuthor: boolean;
}

const SpeedDialActionWithTooltip = SpeedDialAction as unknown as React.ComponentType<{
  tooltipTitle: string;
  icon: React.ReactElement;
  onClick: () => void;
}>;

function ChatOptions(props: IChatBoxProps) {
  // SpeedDial Icon Constants
  const SPEED_DIAL_ICON = (<SpeedDialIcon openIcon={<Close />} icon={<Construction />} />);

  // is speed dial open
  const [isOpen, setIsOpen] = useState(false);

  // Speed Dial Icon
  const selectAuthorIcon = (
    <SpeedDialActionWithTooltip
      tooltipTitle="Choose Primary Author"
      icon={<Person />}
      onClick={props.onAuthor}
    />
  );

  // Download Icon
  const downloadIcon = (
    <SpeedDialActionWithTooltip
      tooltipTitle="Download Chat File"
      icon={<CloudDownload />}
      onClick={props.onDownload}
    />
  );

  // Share Icon
  const shareIcon = (
    <SpeedDialActionWithTooltip
      tooltipTitle="Copy Link for Chat"
      icon={<Share />}
      onClick={props.onShare}
    />
  );

  // Render Speed Dial
  return (
    <SpeedDial
      sx={{ position: 'fixed', bottom: 55, left: 20 }}
      onMouseLeave={() => setIsOpen(false)}
      onMouseEnter={() => setIsOpen(true)}
      ariaLabel="Chat Options"
      direction="up"
      icon={SPEED_DIAL_ICON}
      onClick={() => setIsOpen(!isOpen)}
      open={isOpen}
      openIcon={<Close />}
    >
      {props.canChangeAuthor && selectAuthorIcon}
      {props.shareable && shareIcon}
      {props.downloadable && downloadIcon}
    </SpeedDial>
  );
}

// Content Css Styles
const ContentWrapper = styled('div')`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  display: flex;
`;

// Chat Wrapper Css
const ChatWrapper = styled(Container)`
  margin-bottom: 110px;
  margin-top: 80px;
`;

// Message Component
export default function Viewchat() {
  // Is Author Selector Open or not to select Primary Author
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  // is share modal open
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  // is snackbar open
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);

  // primary author of the chat
  const [primaryAuthor, setPrimaryAuthor] = useState('');

  const driveDownload = useDownloadDriveChat();
  const { getToken } = useDriveAuth();

  // location state from the router to get data
  const locationState = useLocation().state as IViewchatState;

  // user details
  const user: IUser | null = useSelector(selectUser);

  // jwt token
  const jwt: string | null = useSelector(selectJwt);

  // Unique Chat id from the location state
  const chat = locationState?.header.chat;

  // The viewer requires a Drive-backed chat.
  if (!locationState || !chat?.driveFileId) {
    return <Navigate to="/" replace />;
  }

  // messages from the location state
  const messages = locationState.body.messages;

  // author list of chats
  const authors = Array.from(new Set(
    messages.map(m => m.author)
  ));

  // to component
  const chats = useMemo(() => messages.map((message) => (
    <Col xs={12} className="px-3">
      <ChatBox
        isPrimary={message.author === primaryAuthor}
        message={message}
      />
    </Col>
  )), [messages, primaryAuthor]);

  // handle download
  const handleDownload = async () => {
    // if no user is found or no jwt is found
    if (!user || !jwt) {
      throw new Error("Something Went Wrong: Can't Download the chat at the Moment");
    }

    const accessToken = await getToken(true, user.email);
    const blob = await driveDownload.mutateAsync({
      driveFileId: chat.driveFileId,
      accessToken,
    });
    saveAs(blob, chat.name || 'chat');
  }

  // handle author selection
  const handleAuthorSelection = (author: string) => {
    // change the primary author
    setPrimaryAuthor(author);

    // close the selector
    setIsSelectorOpen(false);
  }

  // Body
  const Body = () => (
    <ContentWrapper>
      <ChatOptions
        downloadable={user !== null}
        canChangeAuthor={true}
        shareable={chat.canShare === true && user !== null}
        onDownload={handleDownload}
        onShare={() => setIsShareModalOpen(true)}
        onAuthor={() => setIsSelectorOpen(true)}
      />
      <ShareModal
        driveFileId={chat.driveFileId}
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onSuccess={() => setIsSnackbarOpen(true)}
      />
      <Snackbar
        onClose={() => setIsSnackbarOpen(false)}
        open={isSnackbarOpen}
        autoHideDuration={6000}
      >
        <Alert
          onClose={() => setIsSnackbarOpen(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          Link Copied to Clipboard
        </Alert>
      </Snackbar>
      <Selector
        onClose={() => setIsSelectorOpen(false)}
        title="Select Primary Author"
        isOpen={isSelectorOpen}
        list={authors}
        onSelected={handleAuthorSelection}
      />
      <ChatWrapper fluid={true} >
        <Row> {chats} </Row>
      </ChatWrapper>
    </ContentWrapper>
  );

  // render
  return (
    <React.Fragment>
      <Header />
      <Body />
      <Footer />
    </React.Fragment>
  );
}
