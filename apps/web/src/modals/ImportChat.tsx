// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { ChangeEvent, HTMLAttributes, useState } from "react";
import { getMimeType } from "../utilities/functions";
import WhatsappParser from "../utilities/whatsapp";
import { IMsg } from "../interfaces";
import { Form } from "react-bootstrap";
import {
  DialogContentText,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";

interface IImportChatProps extends HTMLAttributes<HTMLDivElement> {
  onImport: (msgs: IMsg[], chatId: number | null) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportChat(props: IImportChatProps) {
  // File Blob State
  const [fileBlob, setFileBlob] = useState<Blob>();

  // is now ready to import the chat
  const [isReady, setIsReady] = useState(false);

  // on File Upload
  const handleFileUpload = async (evt: ChangeEvent<HTMLInputElement>) => {
    // set is ready to false
    setIsReady(false);

    // get the File
    const file = evt.target.files?.[0];

    // Check if the file is valid
    if (!file) {
      return;
    }

    // set the file blob
    setFileBlob(file.slice(0, file.size, getMimeType(file.name)));

    // Stop the event propagation
    evt.stopPropagation();

    // set is ready to true
    setIsReady(true);
  }

  // on Import
  const handleImport = async () => {
    // if no file is selected
    if (!fileBlob) { return; }

    // get the Whatsapp Parser
    const iterator = new WhatsappParser(fileBlob);

    // chats to be imported
    const chats: IMsg[] = [];

    // iterate over the file
    for await (const msg of iterator) {
      chats.push(msg);
    }

    // set is ready to false
    setIsReady(false);

    // call the onImport function
    props.onImport(chats, null);
  }

  // Render
  return (
    <Dialog open={props.isOpen} onClose={props.onClose}>
      <DialogTitle>Import Chat From File</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Import your chat from a file Here.
          it should be either .txt or .zip.
        </DialogContentText>
        <Form className="mt-3">
          <Form.Group controlId="formBasicFile">
            <Form.Control
              onChange={handleFileUpload}
              accept=".txt, .zip"
              type="file"
            />
            <Form.Control.Feedback
              type="invalid"
            >
              Please provide a valid File.
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={props.onClose}
          color="primary"
        >
          Cancel
        </Button>
        <Button
          onClick={handleImport}
          disabled={!isReady}
          color="primary">
          Import
        </Button>
      </DialogActions>
    </Dialog>
  );
}
