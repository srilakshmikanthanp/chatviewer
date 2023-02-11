// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React, { HTMLAttributes, useState } from "react";
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

// Account Closer Props
interface InputProps extends HTMLAttributes<HTMLDivElement> {
  onEntered: (input: string) => void;
  onClose: () => void;
  isOpen: boolean;
  title: string;
  description: string;
}

// Account Closer
export default function Input(props: InputProps) {
  // user name state
  const [text, setText] = useState("");

  // Handle Change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // set the text
    setText(event.target.value);
  }

  // Handle Delete
  const handleEnter = async () => {
    // call on entered
    props.onEntered(text);

    // close the dialog
    props.onClose();
  }

  // Render
  return (
    <Dialog open={props.isOpen} onClose={props.onClose}>
      <DialogTitle>{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText className="mb-3">
          {props.description}
        </DialogContentText>
        <Box display="flex" flexDirection="column">
          <TextField
            onChange={handleChange}
            value={text}
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
          onClick={handleEnter}
          color="primary"
        >
          Enter
        </Button>
      </DialogActions>
    </Dialog>
  );
}
