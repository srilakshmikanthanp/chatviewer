// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { blobToMsg, getMimeType } from "../utilities/functions";
import { ChangeEvent, HTMLAttributes, useState } from "react";
import { IChat, IMsg, IUser } from "../interfaces";
import { Form } from "react-bootstrap";
import { useCreateChat } from "../apiClients/chatApi";
import { blobToBase64 } from "../utilities/functions";
import {
  DialogContentText,
  DialogActions,
  DialogContent,
  Button,
  Dialog,
  Box,
  DialogTitle,
  CircularProgress,
} from "@mui/material";

interface IImportChatProps extends HTMLAttributes<HTMLDivElement> {
  onImport: (msgs: IMsg[], chat: IChat | null) => void;
  isOpen: boolean;
  user: IUser | null;
  jwt: string | null;
  onClose: () => void;
}

export default function ImportChat(props: IImportChatProps) {
  // File Blob State
  const [selectedFile, setSelectedFile] = useState<File>();

  // can upload the file
  const [isUploadable, setIsUploadable] = useState(false);

  // is now importing the chat
  const [isImporting, setIsImporting] = useState(false);

  // is now ready to import the chat
  const [isImportable, setIsImportable] = useState(false);

  // create chat hook
  const createChat = useCreateChat();

  // on File Upload
  const handleFileUpload = async (evt: ChangeEvent<HTMLInputElement>) => {
    // set is ready to false
    setIsImportable(false);

    // get the File
    const file = evt.target.files?.[0];

    // Check if the file is valid
    if (!file) { return; }

    // set the file blob
    setSelectedFile(file);

    // Stop the event propagation
    evt.stopPropagation();

    // set is ready to true
    setIsImportable(true);
  }

  // on Import
  const handleImport = async () => {
    // Check if the file is valid
    if (!selectedFile) { return setIsImportable(false); }

    // get the file mime type
    const mimeType = getMimeType(selectedFile.name);

    // set is ready to false
    setIsImportable(false);

    // set is importing to true
    setIsImporting(true);

    // Check if the mime type is valid
    if (!mimeType) { return; }

    // create blob
    const chatBlob = selectedFile.slice(
      0, selectedFile.size, mimeType
    );

    // chats to be imported
    const chats: IMsg[] = await blobToMsg(chatBlob);

    // if there are no chats to import
    if (chats.length === 0) { return; }

    // if not uploadable
    if (!isUploadable || (!props.user || !props.jwt)) {
      // set the file blob to null
      setSelectedFile(undefined);

      // set is uploadable to true
      setIsUploadable(true);

      // set is importing to false
      setIsImporting(false);

      // set is ready to false
      setIsImportable(false);

      // return
      return props.onImport(chats, null);
    }

    // Check if the user is valid
    if ((!props.user || !props.jwt)) {
      throw new Error("Can't Upload: User is not valid");
    }

    // get the base64 encoded file
    const base64 = await blobToBase64(chatBlob);

    // chat Data
    const chat = {
      name: selectedFile.name,
      base64: base64,
    };

    // create the chat
    const response = await createChat.mutateAsync({
      userId: props.user.userId,
      jwt: props.jwt,
      chat: chat,
    });

    // set the file blob to null
    setSelectedFile(undefined);

    // set is uploadable to true
    setIsUploadable(true);

    // set is importing to false
    setIsImporting(false);

    // set is ready to false
    setIsImportable(false);

    // import the chat
    return props.onImport(chats, response.data);
  }

  // on Close
  const handleClose = () => {
    // set the file blob to null
    setSelectedFile(undefined);

    // set is uploadable to true
    setIsUploadable(true);

    // set is importing to false
    setIsImporting(false);

    // set is ready to false
    setIsImportable(false);

    // call the onClose function
    props.onClose();
  }

  // progress component
  const progress = isImporting ? (
    <CircularProgress
      size={24}
      sx={{
        position: 'absolute',
        top: '20%',
        left: '30%',
      }}
    />
  ) : null;

  // import button
  const Import = () => (
    <Box sx={{ m: 1, position: 'relative' }}>
      <Button
        onClick={handleImport}
        disabled={!isImportable}
        color="primary"
      >
        Import
      </Button>
      {progress}
    </Box>
  );

  // Render
  return (
    <Dialog open={props.isOpen} onClose={props.onClose}>
      <DialogTitle>Import Chat From File</DialogTitle>
      <DialogContent sx={{ paddingBottom: 0 }}>
        <DialogContentText>
          Import your chat from a file Here.
          it should be either .txt or .zip.
        </DialogContentText>
        <Form className="mt-3">
          <Form.Group controlId="formChatFile" className="mb-3">
            <Form.Control
              onChange={handleFileUpload}
              accept=".txt, .zip"
              type="file"
            />
            <Form.Control.Feedback type="invalid" >
              Please provide a valid File.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="uploadChat">
            <Form.Check
              onChange={() => setIsUploadable(!isUploadable)}
              checked={isUploadable}
              type="checkbox"
              label="Upload the Chat"
              disabled={!props.user && !props.jwt}
            />
          </Form.Group>
        </Form>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Import />
      </DialogActions>
    </Dialog>
  );
}
