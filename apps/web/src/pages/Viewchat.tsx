// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { selectUser, selectJwt } from "../redux/slices/userSlice";
import { IViewchatState } from "../interfaces/pagestates";
import { Header, ChatBox, Footer } from "../components";
import { Container, Row, Col } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import React, { useState } from "react";
import styled from "styled-components";
import { Selector } from "../modals";
import { IUser } from "../interfaces";
import axios from "axios";
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
  const SPEED_DIAL_ICON = (<SpeedDialIcon openIcon={<Close />} icon={<Construction />}/>);

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
      {props.downloadable && (
        <SpeedDialAction
          onClick={props.onDownload}
          icon={<CloudDownload />}
          tooltipTitle="Download"
        />
      )}
      {props.shareable && (
        <SpeedDialAction
          onClick={props.onShare}
          icon={<Share />}
          tooltipTitle="Share"
        />
      )}
      {props.authorable && (
        <SpeedDialAction
          onClick={props.onAuthor}
          icon={<Person />}
          tooltipTitle="Author"
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
  const chatId = locationState.header.chatId;

  // author list of chats
  const authors = Array.from(new Set(
    messages.map(m => m.author)
  ));

  // to component
  const chats = messages.map((message) => (
    <Col xs={12}>
      <ChatBox
        isPrimary={message.author === primaryAuthor}
        message={message}
      />
    </Col>
  ));

  // handle download
  const handleDownload = async () => {
    // if no user is found or no jwt is found
    if (!user || !jwt) {
      throw new Error("Something Went Wrong: Can't Download the chat at the Moment");
    }

    // Query Url
    const QueryUrl = `/api/v1/users/${user.userId}/chats/${chatId}/blob`;

    // axios request
    const resp = await axios.get<Blob>(QueryUrl, {
      headers: { Authorization: `Bearer ${jwt}`},
      responseType: "blob",
    });

    // Blob Url
    const url = window.URL.createObjectURL(resp.data);

    // Download Link
    window.open(url, "_blank");
  }

  // handle share
  const handleShare = async () => {
    // if no user is found or no jwt is found
    if (!user || !jwt) {
      throw new Error("Something Went Wrong: Can't Share the chat at the Moment");
    }

    // Query Url
    const QueryUrl = `/api/v1/users/${user.userId}/chats/${chatId}/token`;

    // axios request
    const resp = await axios.get(QueryUrl, {
      headers: { Authorization: `Bearer ${jwt}`},
    });

    // token
    const token = resp.headers["chat-token"];
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
        downloadable={chatId !== null}
        authorable={true}
        shareable={chatId !== null}
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
