// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { useChatWithToken, useBlobWithToken } from "../apiClients/utilApi";
import CloudDownloadIcon from '@mui/icons-material/CloudDownload';
import { createViewerState } from "../utilities/constructors";
import WhatsappParser from "../utilities/whatsapp";
import { LinearProgress } from "@mui/material";
import { Header, Footer } from "../components";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { IChat, IMsg } from "../interfaces";
import styled from "styled-components";
import React from "react";

const ChatSharedContainer = styled.div`
  height: calc(100vh - 200px);
  width: 250px;
  margin: 100px auto;
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

/**
 * ChatShared is a component that is used to view the shared chat.
 */
export default function Chatshared() {
  // Get the chat token from the url
  const token = useParams()["token"] as string;

  // Get the chat data from the api
  const chat = useChatWithToken({ token });

  // Get the blob data from the api
  const blob = useBlobWithToken({ token });

  // create the navigate hook
  const navigate = useNavigate();

  // on Fetched Handle the fetched data
  const onFetched = async (chat: IChat, blob: Blob) => {
    // create a new whatsapp parser
    const iterator = new WhatsappParser(blob);

    // message array
    const messages : IMsg[] = [];

    // Iterate through the messages
    for await (const msg of iterator) {
      messages.push(msg);
    }

    // navigate to the view chat page
    return navigate('/viewchat', { state: createViewerState(chat, messages) });
  }

  // if error in fetching the chat
  if (chat.error || blob.error) {
    throw new Error("Please get new token");
  }

  // if data is fetched
  if (chat.isSuccess && blob.isSuccess) {
    onFetched(chat.data.data, blob.data.data);
  }

  // Body
  const Body = () => (
    <ChatSharedContainer>
      <CloudDownloadIcon sx={{width: "50px", height: "50px",}}/>
      <LinearProgress sx={{ width: "100%" }} />
    </ChatSharedContainer>
  );

  // get the token from params
  return (
    <React.Fragment>
      <Header />
      <Body />
      <Footer />
    </React.Fragment>
  );
}
