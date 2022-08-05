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
  onImport: (msgs: IMsg[]) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function ImportChat(props: IImportChatProps) {
  // is noe able to cancel the import
  const [isCancelable, setIsCancelable] = useState(true);

  // is now ready to import the chat
  const [isReady, setIsReady] = useState(false);

  // is File Valid State
  const [isValid, setIsValid] = useState(false);

  // Chats Data State
  const [chats, setChats] = useState<IMsg[]>([]);

  // on File Upload
  const handleFileUpload = async (evt: ChangeEvent<HTMLInputElement>) => {
    // set cancelable to false
    setIsCancelable(false);

    // set is valid to false
    setIsValid(false);

    // set is ready to false
    setIsReady(false);

    // get the File
    const inputFile = evt.target.files?.[0];

    // Check if the file is valid
    if (!inputFile) {
      throw new Error("No file selected");
    }

    // get the Whatsapp Parser
    const iterator = new WhatsappParser(
      inputFile.slice(0, inputFile.size, getMimeType(inputFile.name)
    ));

    // Clear the chats data
    setChats([]);

    // iterate over the file
    for await (const msg of iterator) {
      setChats(chats => [...chats, msg]);
    }

    // Stop the event propagation
    evt.stopPropagation();

    // set is ready to true
    setIsReady(true);

    // set is valid to true
    setIsValid(true);

    // set cancelable to true
    setIsCancelable(true);
  }

  // on Import
  const handleImport = () => {
    // set cancelable to false
    setIsCancelable(false);

    // set is ready to false
    setIsReady(false);

    // set is valid to false
    setIsValid(false);

    // call the onImport function
    props.onImport(chats);
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
              isValid={isValid}
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
          disabled={!isCancelable}
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
