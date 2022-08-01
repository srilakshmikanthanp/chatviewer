// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Header, Footer, UserView } from "../components";
import { Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";
import { IUser } from "../interfaces";

const ChatDetailsWrapper = styled(Container)`
  justify-content: center;
  align-items: center;
  padding: 15px;
  margin: 10px;
  display: flex;
  max-width: 90vw;
  flex-direction: column;
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
  // type of the row
  type TableCols = { name: string; date: Date; }

  // list of chats
  const chatList = [
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
  ].map((chat, index) => {
    return {
      name: chat.name,
      date: chat.createdAt,
    }
  });

  // render
  return (
    <ChatDetailsWrapper>
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
  // User Details for the dashboard
  const user: IUser = {
    email: "srilakshmikanthanp@gmail.com",
    name: "Sri Lakshmi Kanthan P",
    userId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  return (
    <DashboardWrapper>
      <Header />
      <UserView user={user} />
      <ChatDetails />
      <Footer />
    </DashboardWrapper>
  );
}
