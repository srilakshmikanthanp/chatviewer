// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Container, Row, Col, Table } from "react-bootstrap";
import ChatBackGround from "../assets/images/chatbg.jpg";
import MinusIcon from "../assets/images/minus.svg";
import ShareIcon from "../assets/images/share.svg";
import { Header, Clickable, Footer } from "../components";
import styled from "styled-components";
import { IChat } from "../interfaces";

const UserDetailsWrapper = styled(Container)`
  background-image: url(${ChatBackGround});
  background-size: cover;
  padding: 15px;
  margin: 10px;
  color: white;
  display: flex;
  font-weight: bold;
  max-width: 90vw;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

function UserDetails() {
  return (
    <UserDetailsWrapper>
      <Row className="d-flex align-items-center justify-content-center">
        <Col xs={12} className="d-flex justify-content-center">
          <h3>{"Sri Lakshmi Kanthan P"}</h3>
        </Col>
        <Col xs={12} className="d-flex justify-content-center">
          <h6>{"srilakshmikanthanp@gmail.com"}</h6>
        </Col>
        <Col xs={6} className="d-flex justify-content-end">
          <Clickable onClick={() => null} isPrimary={true} >
            Edit
          </Clickable>
        </Col>
        <Col xs={6} className="d-flex justify-content-start">
          <Clickable onClick={() => null} isPrimary={true} >
            Delete
          </Clickable>
        </Col>
      </Row>
    </UserDetailsWrapper>
  );
}

const ChatDetailsWrapper = styled(Container)`
  justify-content: center;
  align-items: center;
  padding: 15px;
  margin: 10px;
  display: flex;
  max-width: 90vw;
  flex-direction: column;
`;

const ClickableRow = styled.tr`
  cursor: pointer;
`;

const ImgIcon = styled.img`
  max-height: 20px;
  margin: 0 auto;
  max-width: 20px;
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
  }
`;

function ChatDetails() {
  // list of chats
  const chatList: IChat[] = [
    {
      createdAt: new Date(),
      blobUrl: "http://localhost:3000",
      mimeType: "text/plain",
      name: "Chat With John Deo",
      chatId: 1,
      userId: 1
    },
    {
      createdAt: new Date(),
      blobUrl: "http://localhost:3000",
      mimeType: "text/plain",
      name: "Chat With Peter",
      chatId: 1,
      userId: 1
    },
    {
      createdAt: new Date(),
      blobUrl: "http://localhost:3000",
      mimeType: "text/plain",
      name: "Chat With Surya",
      chatId: 1,
      userId: 1
    },
    {
      createdAt: new Date(),
      blobUrl: "http://localhost:3000",
      mimeType: "text/plain",
      name: "Chat With Akash",
      chatId: 1,
      userId: 1
    },
    {
      createdAt: new Date(),
      blobUrl: "http://localhost:3000",
      mimeType: "text/plain",
      name: "Chat With Mohan",
      chatId: 1,
      userId: 1
    },
    {
      createdAt: new Date(),
      blobUrl: "http://localhost:3000",
      mimeType: "text/plain",
      name: "Chat With Akash",
      chatId: 1,
      userId: 1
    },
    {
      createdAt: new Date(),
      blobUrl: "http://localhost:3000",
      mimeType: "text/plain",
      name: "Chat With Mohan",
      chatId: 1,
      userId: 1
    },
    {
      createdAt: new Date(),
      blobUrl: "http://localhost:3000",
      mimeType: "text/plain",
      name: "Chat With Akash",
      chatId: 1,
      userId: 1
    },
    {
      createdAt: new Date(),
      blobUrl: "http://localhost:3000",
      mimeType: "text/plain",
      name: "Chat With Mohan",
      chatId: 1,
      userId: 1
    },
    {
      createdAt: new Date(),
      blobUrl: "http://localhost:3000",
      mimeType: "text/plain",
      name: "Chat With Akash",
      chatId: 1,
      userId: 1
    },
    {
      createdAt: new Date(),
      blobUrl: "http://localhost:3000",
      mimeType: "text/plain",
      name: "Chat With Mohan",
      chatId: 1,
      userId: 1
    },
    {
      createdAt: new Date(),
      blobUrl: "http://localhost:3000",
      mimeType: "text/plain",
      name: "Chat With Akash",
      chatId: 1,
      userId: 1
    },
    {
      createdAt: new Date(),
      blobUrl: "http://localhost:3000",
      mimeType: "text/plain",
      name: "Chat With Mohan",
      chatId: 1,
      userId: 1
    },
  ];

  // components
  const components = chatList.map((value, index) => {
    return (
      <ClickableRow onClick={() => undefined}>
        <td>{value.name}</td>
        <td>{value.createdAt.toLocaleString()}</td>
        <td onClick={() => undefined}>
          <ImgIcon src={MinusIcon} alt="Minus" />
        </td>
        <td onClick={() => undefined}>
          <ImgIcon src={ShareIcon} alt="Share" />
        </td>
      </ClickableRow>
    )
  });

  return (
    <ChatDetailsWrapper>
      <Table striped={true} hover={true}>
        <thead>
          <tr>
            <th onClick={() => null}>Name</th>
            <th onClick={() => null}>Date</th>
          </tr>
        </thead>
        <tbody>
          {components}
        </tbody>
      </Table>
    </ChatDetailsWrapper>
  );
}

const DashboardWrapper = styled.div`
  justify-content: center;
  height: 100%;
  width: 100%;
  margin-top: 100px;
  margin-bottom: 60px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export default function Dashboard() {
  return (
    <DashboardWrapper>
      <Header />
      <UserDetails />
      <ChatDetails />
      <Footer />
    </DashboardWrapper>
  );
}
