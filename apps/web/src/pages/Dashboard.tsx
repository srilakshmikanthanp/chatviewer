// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Header, Footer, UserView, ChatView } from "../components";
import { AccountCloser, UserEditor, ChatEditor } from "../modals";
import { selectUser, selectJwt } from "../redux/slices/userSlice";
import { createViewerState } from "../utilities/constructors";
import { useDeleteChat } from "../apiClients/chatApi";
import { useGetChats } from "../apiClients/chatApi";
import { blobToMsg } from "../utilities/functions";
import { setUser } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IUser, IChat } from "../interfaces";
import { useSelector } from "react-redux";
import styled from "styled-components";
import React, { useState } from "react";
import axios from "axios";

// Dashboard Wrapper
const DashboardWrapper = styled.div`
  min-height: 100%;
  width: 100%;
  margin: 0 auto;
  flex-direction: column;
  display: flex;
`;

// user view wrapper
const UserViewWrapper = styled.div`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  display: flex;
  margin-top: 100px;
`;

// Chat View Wrapper
const ChatViewWrapper = styled.div`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  display: flex;
  flex-grow: 1;
  margin-bottom: 60px;
`;

export default function Dashboard() {
  // sort by state selector
  const [sortBy, setSortBy] = useState<"name" | "createdAt" | "updatedAt">("name");

  // account closer open
  const [isAccountCloserOpen, setISAccountCloserOpen] = useState<boolean>(false);

  // user editor open
  const [isUserEditorOpen, setIsUserEditorOpen] = useState<boolean>(false);

  // chat editor open
  const [isChatEditorOpen, setIsChatEditorOpen] = useState<boolean>(false);

  // is in progress
  const [isInProgress, setIsInProgress] = useState<boolean>(false);

  // Editing chat
  const [editingChat, setEditingChat] = useState<IChat | null>(null);

  // page number
  const [pageNumber, setPageNumber] = useState<number>(1);

  // Chat Delete hook
  const chatDelete = useDeleteChat();

  // user details
  const user: IUser | null = useSelector(selectUser);

  // jwt token
  const jwt: string | null = useSelector(selectJwt);

  // navigate hook
  const navigate = useNavigate();

  // dispatch hook
  const dispatch = useDispatch();

  // if no user throw
  if (!user || !jwt) {
    throw new Error("No User found");
  }

  // chats for the dashboard
  const {
    isPreviousData: isPrevData,
    isError,
    data,
    error,
    isFetching,
  } = useGetChats({
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

  /***********************
   *   User Handlers     *
   **********************/

  // on Delete User
  const onUserDeleted = () => {
    // Set new state
    dispatch(setUser({ user: null, jwt: null }));

    // navigate
    navigate("/");
  }

  // onClose Edit
  const onUserEdited = (user: IUser) => {
    // dispatch user details
    dispatch(setUser({
      user: user,
      jwt: jwt
    }));

    // close user editor
    setIsUserEditorOpen(false);
  }

  /***********************
   *   Chat Handlers     *
   **********************/

  // on next handler
  const onNextChat = () => {
    if (!isPrevData && link?.includes("next")) {
      setPageNumber(pageNumber + 1);
    }
  };

  // on prev handler
  const onPrevChat = () => {
    setPageNumber(Math.max(pageNumber - 1, 0));
  }

  // on Open Handler
  const onOpenChat = async (chat: IChat) => {
    // set the progress to indicate loading
    setIsInProgress(true);

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

  // on Delete Handler
  const onDeleteChat = async (chat: IChat) => {
    // Create a Alert to User
    if (!window.confirm("Are you sure you want to delete this chat?")) {
      return;
    }

    // delete the chat
    await chatDelete.mutateAsync({
      chatId: chat.chatId,
      jwt: jwt,
    });
  }

  // on Edit Handler
  const onEditChat = (chat: IChat) => {
    // set the editing chat
    setEditingChat(chat);

    // open the chat editor
    setIsChatEditorOpen(true);
  }

  // body
  const Body = () => (
    <DashboardWrapper>
      <UserViewWrapper>
        <UserView
          onDelete={() => setISAccountCloserOpen(true)}
          onEdit={() => setIsUserEditorOpen(true)}
          user={user}
        />
      </UserViewWrapper>
      <ChatViewWrapper>
        <ChatView
          hasNext={!isPrevData && link?.includes("next") || false}
          isFetching={isFetching}
          isProgress={isInProgress}
          setSortBy={setSortBy}
          sortBy={sortBy}
          onPrev={onPrevChat}
          onNext={onNextChat}
          hasPrev={pageNumber > 1}
          chats={data?.data || null}
          onOpen={onOpenChat}
          onEdit={onEditChat}
          onDelete={onDeleteChat}
        />
      </ChatViewWrapper>
      <AccountCloser
        onClose={() => setISAccountCloserOpen(false)}
        onDeleted={onUserDeleted}
        user={user}
        jwt={jwt}
        isOpen={isAccountCloserOpen}
      />
      <UserEditor
        onClose={() => setIsUserEditorOpen(false)}
        onEdited={onUserEdited}
        user={user}
        jwt={jwt}
        isOpen={isUserEditorOpen}
      />
      {editingChat && <ChatEditor
        onClose={() => setIsChatEditorOpen(false)}
        user={user}
        chat={editingChat}
        jwt={jwt}
        isOpen={isChatEditorOpen}
      />}
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
