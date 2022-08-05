// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Header, ChatBox, Footer } from "../components";
import { Container, Row, Col } from "react-bootstrap";
import { IViewerState } from "../interfaces/pages";
import { useLocation } from "react-router-dom";
import React, { useState } from "react";
import styled from "styled-components";
import { Selector } from "../modals";
import {
  SpeedDialAction,
  SpeedDial
} from "@mui/material";
import {
  CloudDownload,
  Person,
  Share,
  Construction,
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
  // is speed dial open
  const [isOpen, setIsOpen] = useState(false);

  // Render Speed Dial
  return (
    <SpeedDial
      sx={{ position: 'fixed', bottom: 70, right: 20 }}
      ariaLabel="Chat Options"
      direction="up"
      icon={<Construction />}
      onClick={() => setIsOpen(!isOpen)}
      open={isOpen}
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
  height: 100%;
  width: 100%;
  margin-top: 100px;
  margin-bottom: 60px;
`;

// Message Component
export default function Viewer() {
  // location state from the router to get data
  const locationState = useLocation().state as IViewerState;

  // Unique Chat id from the location state
  const chatId = locationState.header.chatId;

  // messages from the location state
  const messages = locationState.body.messages;

  // author list of chats
  const authors = Array.from(new Set(
    messages.map(m => m.author)
  ));

  // if the message is undefined
  if (!messages) {
    throw new Error("Message data is undefined");
  }

  // primary author of the chat
  const [primaryAuthor, setPrimaryAuthor] = useState('');

  // to component
  const chats = messages.map((message) => (
    <Col xs={12}>
      <ChatBox
        isPrimary={message.author === primaryAuthor}
        message={message}
      />
    </Col>
  ));

  // Is Author Selector Open
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  // handle author selection
  const handleAuthorSelection = (author: string) => {
    setPrimaryAuthor(author);
    setIsSelectorOpen(false);
  }

  // handle download
  const handleDownload = () => {
    console.log("Downloading...");
  }

  // handle share
  const handleShare = () => {
    console.log("Sharing...");
  }

  // handle author
  const handleAuthor = () => {
    setIsSelectorOpen(true);
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
        onAuthor={handleAuthor}
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
