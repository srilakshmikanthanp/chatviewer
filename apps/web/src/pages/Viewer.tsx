// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { useLocation, useNavigate } from "react-router-dom";
import { Header, ChatBox, Footer } from "../components";
import { Container, Row, Col } from "react-bootstrap";
import { IViewerState } from "../interfaces/pages";
import styled from "styled-components";
import React, { useEffect } from "react";

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
  // location state from the router
  const locationState = useLocation().state as IViewerState;

  // list of message data
  const messages = locationState.body.messages;

  console.log(messages);

  // to component
  const chats = messages.map((message) => (
    <Col xs={12}>
      <ChatBox isPrimary={message.author === ''} message={message} />
    </Col>
  ));

  // Body
  const Body = () => (
    <ContentWrapper>
      <Container fluid={true} >
        <Row> {chats} </Row>
      </Container>
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
