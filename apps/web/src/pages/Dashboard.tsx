// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Header, Footer, UserView, ChatView } from "../components";
import styled from "styled-components";
import { IUser, IChat } from "../interfaces";
import React from "react";

// Dashboard Wrapper
const DashboardWrapper = styled.div`
  justify-content: center;
  height: 100%;
  width: 100%;
  margin-top: 100px;
  margin-bottom: 60px;
  display: flex;
  gap: 20px;
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

  // chats for the dashboard
  const chats: IChat[] = [
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
      name: "Chat With John Deo",
      chatId: 1,
      userId: 1
    },
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
      name: "Chat With John Deo",
      chatId: 1,
      userId: 1
    },
    {
      createdAt: new Date(),
      blobUrl: "http://localhost:3000",
      mimeType: "text/plain",
      name: "Chat With John Deo",
      chatId: 1,
      userId: 1
    },
  ];

  return (
    <React.Fragment>
      <Header />
      <DashboardWrapper>
        <UserView
          onDelete={() => null}
          onEdit={() => null}
          user={user}
        />
        <ChatView
          onDelete={() => null}
          onOpen={() => null}
          onEdit={() => null}
          onShare={() => null}
          hasPrev={false}
          chats={chats}
          hasNext={false}
        />
      </DashboardWrapper>
      <Footer />
    </React.Fragment>
  );
}
