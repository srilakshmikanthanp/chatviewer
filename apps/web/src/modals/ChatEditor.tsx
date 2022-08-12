// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React, { HTMLAttributes, useState } from "react";
import { usePatchChat } from "../apiClients/chatApi";
import { IChat, IUser } from "../interfaces";
import {
  DialogContentText,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Box,
  TextField,
} from "@mui/material";

// User Editor Props
interface UserEditorProps extends HTMLAttributes<HTMLDivElement> {
  onEdited?: (chat: IChat) => void;
  onClose: () => void;
  user: IUser;
  chat: IChat;
  jwt: string;
  isOpen: boolean;
}

// User Editor
export default function ChatEditor(props: UserEditorProps) {
  // user name state
  const [chatName, setChatName] = useState(props.chat.name.split(".")[0]);

  // is Ready
  const [isReady, setIsReady] = useState(false);

  // editor hook
  const patchChat = usePatchChat();

  // File Ext
  const fileExt = props.chat.name.split(".")[1];

  // Handle Change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Set user name
    setChatName(event.target.value);

    // check valid
    if (event.target.value.length > 0) {
      setIsReady(true);
    } else {
      setIsReady(false);
    }
  }

  // Handle save
  const handleSave = async () => {
    // patch user details
    const resp = await patchChat.mutateAsync({
      userId: props.user.userId,
      chatId: props.chat.chatId,
      jwt: props.jwt,
      options: {
        name: chatName + "." + fileExt,
      }
    });

    // set is ready false
    setIsReady(false);

    // Event
    props.onEdited && props.onEdited(resp.data);

    // close modal
    props.onClose();
  }

  // Render
  return (
    <Dialog open={props.isOpen} onClose={props.onClose}>
      <DialogTitle>Edit Chat</DialogTitle>
      <DialogContent>
        <DialogContentText className="mb-3">
          Edit the Chat details and click save to Proceed.
        </DialogContentText>
        <Box display="flex" flexDirection="column">
          <TextField
            onChange={handleChange}
            label="Chat Name"
            value={chatName}
            required={true}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={props.onClose}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          color="primary"
          disabled={!isReady}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
