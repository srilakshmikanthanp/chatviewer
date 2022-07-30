// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Header, ChatBox, Footer } from "../components";
import { Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import { IMsg } from "../interfaces";

const MessageWrapper = styled.div`
  justify-content: center;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export default function Message() {
  // primary author of the messages
  const primaryAuthor = "Sri Lakshmi Kanthan P";

  // list of message data
  const messages: IMsg[] = [
    {
      message: "Hello, I am Sri Lakshmi Kanthan P",
      author: "Sri Lakshmi Kanthan P",
      timestamp: new Date(),
      msgId: 1,
    },
    {
      message: "How are you?",
      author: "John Doe",
      timestamp: new Date(),
      msgId: 2,
    },
    {
      message: "I am fine, thank you",
      author: "Sri Lakshmi Kanthan P",
      timestamp: new Date(),
      msgId: 3,
    },
    {
      message: "See this video",
      author: "John Doe",
      timestamp: new Date(),
      msgId: 4,
      media: {
        mimeType: "video/mp4",
        url: "https://www.youtube.com/watch?v=U3aXWizDbQ4",
      }
    },
    {
      message: "Hey, Nice",
      author: "Sri Lakshmi Kanthan P",
      timestamp: new Date(),
      msgId: 5
    },
    {
      message: "See this Image",
      author: "Sri Lakshmi Kanthan P",
      timestamp: new Date(),
      msgId: 6,
      media: {
        mimeType: "image/jpeg",
        url: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
      }
    },
    {
      message: "See this Audio",
      author: "Sri Lakshmi Kanthan P",
      timestamp: new Date(),
      msgId: 7,
      media: {
        mimeType: "audio/mpeg",
        url: "https://file-examples.com/storage/fe52cb0c4862dc676a1b341/2017/11/file_example_MP3_700KB.mp3",
      }
    }
  ];

  // to component
  const chats = messages.map((message) => {
    return (
      <Col xs={12}>
        <ChatBox
          isPrimary={message.author === primaryAuthor}
          message={message}
          key={message.msgId}
        />
      </Col>
    );
  });

  // render
  return (
    <MessageWrapper>
      <Header />
      <Container fluid={true} style={{ margin: "80px 0px" }}>
        <Row> {chats} </Row>
      </Container>
      <Footer />
    </MessageWrapper>
  );
}
