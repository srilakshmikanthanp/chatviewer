// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { IViewchatState } from "../interfaces/pagestates";
import { Container, Row, Col } from "react-bootstrap";
import React, { useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { Selector } from "../modals";
import { IUser } from "../interfaces";
import { saveAs } from 'file-saver';
import axios from "axios";
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
  authorable: boolean;
}

function ChatOptions(props: IChatBoxProps) {
  // SpeedDial Icon Constants
  const SPEED_DIAL_ICON = (<SpeedDialIcon openIcon={<Close />} icon={<Construction />} />);

  // is speed dial open
  const [isOpen, setIsOpen] = useState(false);

  // Render Speed Dial
  return (
    <SpeedDial
      sx={{ position: 'fixed', bottom: 70, right: 20 }}
      onMouseLeave={() => setIsOpen(false)}
      onMouseEnter={() => setIsOpen(true)}
      ariaLabel="Chat Options"
      direction="up"
      icon={SPEED_DIAL_ICON}
      onClick={() => setIsOpen(!isOpen)}
      open={isOpen}
      openIcon={<Close />}
    >
      {props.authorable && (
        <SpeedDialAction
          tooltipTitle="Choose Primary Author"
          icon={<Person />}
          onClick={props.onAuthor}
        />
      )}
      {props.downloadable && (
        <SpeedDialAction
          tooltipTitle="Download Chat File"
          icon={<CloudDownload />}
          onClick={props.onDownload}
        />
      )}
      {props.shareable && (
        <SpeedDialAction
          tooltipTitle="Copy Link for Chat"
          icon={<Share />}
          onClick={props.onShare}
        />
      )}
    </SpeedDial>
  );
}

// Content Css Styles
const ContentWrapper = styled.div`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  display: flex;
  width: 100%;
  margin-top: 90px;
  margin-bottom: 120px;
`;

// Message Component
export default function Viewchat() {
  // Is Author Selector Open or not to select Primary Author
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  // primary author of the chat
  const [primaryAuthor, setPrimaryAuthor] = useState('');

  // location state from the router to get data
  const locationState = useLocation().state as IViewchatState;

  // user details
  const user: IUser | null = useSelector(selectUser);

  // jwt token
  const jwt: string | null = useSelector(selectJwt);

  // if no data is found
  if (!locationState) {
    throw new Error("No Chats/Messages found");
  }

  // messages from the location state
  const messages = locationState.body.messages;

  // Unique Chat id from the location state
  const chat = locationState.header.chat;

  // author list of chats
  const authors = Array.from(new Set(
    messages.map(m => m.author)
  ));

  // to component
  const chats = useMemo(() => messages.map((message) => (
    <Col xs={12}>
      <ChatBox
        isPrimary={message.author === primaryAuthor}
        message={message}
      />
    </Col>
  )), [messages, primaryAuthor]);

  // handle download
  const handleDownload = async () => {
    // if no user is found or no jwt is found
    if (!user || !jwt || !chat) {
      throw new Error("Something Went Wrong: Can't Download the chat at the Moment");
    }

    // Query Url to get token
    const tokenUrl = `/api/v1/users/${user.userId}/chats/${chat.chatId}/token`;

    console.log(chat.createdAt);

    // axios request
    const resp = await axios.get(tokenUrl, {
      headers: { Authorization: `Bearer ${jwt}` },
      params: { expiresIn: "1h" },
    });

    // get the token
    const token = resp.headers["chat-token"];

    // download the chat
    const downloadUrl = (
      `${axios.defaults.baseURL}/api/v1/util/chats/${token}/blob`
    );

    // download the chat
    saveAs(downloadUrl, chat.name);
  }

  // handle share
  const handleShare = async () => {
    // if no user is found or no jwt is found
    if (!user || !jwt || !chat) {
      throw new Error("Something Went Wrong: Can't Share the chat at the Moment");
    }

    // Query Url to get token
    const QueryUrl = `/api/v1/users/${user.userId}/chats/${chat.chatId}/token`;

    // axios request
    const resp = await axios.get(QueryUrl, {
      headers: { Authorization: `Bearer ${jwt}` },
    });

    // token
    const token = resp.headers["chat-token"];

    // generate url
    const url = `${window.location.origin}/chatshared/${token}`;

    // copy to clipboard
    await navigator.clipboard.writeText(url);
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
      <Container fluid={true} >
        <Row> {chats} </Row>
      </Container>
      <Selector
        onClose={() => setIsSelectorOpen(false)}
        title="Select Primary Author"
        isOpen={isSelectorOpen}
        list={authors}
        onSelected={handleAuthorSelection}
      />
      <ChatOptions
        downloadable={chat !== null}
        authorable={true}
        shareable={chat !== null}
        onDownload={handleDownload}
        onShare={handleShare}
        onAuthor={() => setIsSelectorOpen(true)}
      />
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
