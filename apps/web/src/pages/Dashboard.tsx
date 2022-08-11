// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Header, Footer, UserView, ChatView } from "../components";
import { selectUser, selectJwt } from "../redux/slices/userSlice";
import { useGetChats } from "../apiClients/chatApi";
import { blobToMsg } from "../utilities/functions";
import { useNavigate } from "react-router-dom";
import { IUser, IChat } from "../interfaces";
import { useSelector } from "react-redux";
import styled from "styled-components";
import React, { useState } from "react";
import axios from "axios";
import { createViewerState } from "../utilities/constructors";

// Dashboard Wrapper
const DashboardWrapper = styled.div`
  justify-content: space-between;
  min-height: calc(100vh - 200px);
  width: 100%;
  margin-top: 100px;
  margin-bottom: 60px;
  display: flex;
  gap: 20px;
  align-items: center;
  flex-direction: column;
`;

// user view wrapper
const UserViewWrapper = styled(UserView)`
  margin-bottom: auto;
`;

// Chat View Wrapper
const ChatViewWrapper = styled(ChatView)`
  margin-top: auto;
  margin-bottom: auto;
`;

export default function Dashboard() {
  // sort by state
  const [sortBy, setSortBy] = useState<"name" | "createdAt" | "updatedAt">("name");

  // page number
  const [pageNumber, setPageNumber] = useState<number>(1);

  // user details
  const user: IUser | null = useSelector(selectUser);

  // jwt token
  const jwt: string | null = useSelector(selectJwt);

  // navigate hook
  const navigate = useNavigate();

  // if no user throw
  if (!user || !jwt) {
    throw new Error("No User found");
  }

  // chats for the dashboard
  const {
    isPreviousData : isPrevData,
    isError,
    data,
    error,
    isFetching,
  } = useGetChats({
    userId: user.userId,
    jwt: jwt,
    params: {
      page: pageNumber,
      perPage: 5, // it is a constant
      sortBy: sortBy,
    },
  });

  // if error throw
  if (isError) {
    throw new Error("Error in getting chats: " + error);
  }

  // Header Link
  const link = data ? data.headers["link"] : undefined;

  // on prev handler
  const onPrev = () => {
    setPageNumber(Math.max(pageNumber - 1, 0));
  }

  // on next handler
  const onNext = () => {
    if (!isPrevData && link?.includes("next")) {
      setPageNumber(pageNumber + 1);
    }
  };

  // on Open Handler
  const onOpen = async (chat: IChat) => {
    // get the blob from the server
    const blob = await axios.get(chat.blobUrl, {
      headers: { Authorization: "Bearer " + jwt },
      responseType: "blob"
    });

    // convert the blob to msg
    const msgs = await blobToMsg(blob.data);

    // Navigate to the chat view page
    navigate("/viewchat", {
      state: createViewerState(chat, msgs)
    });
  }

  // body
  const Body = () => (
    <DashboardWrapper>
      <UserViewWrapper
        onDelete={() => null}
        onEdit={() => null}
        user={user}
      />
      <ChatViewWrapper
        hasNext={!isPrevData && link?.includes("next") || false}
        isFetching={isFetching}
        setSortBy={setSortBy}
        sortBy={sortBy}
        onPrev={onPrev}
        onNext={onNext}
        hasPrev={pageNumber > 1}
        chats={data?.data || null}
        onDelete={() => null}
        onOpen={onOpen}
        onEdit={() => null}
      />
    </DashboardWrapper>
  );

  return (
    <React.Fragment>
      <Header />
      <Body />
      <Footer />
    </React.Fragment>
  );
}
