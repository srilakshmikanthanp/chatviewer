// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React, { HTMLAttributes, useState } from "react";
import { useDeleteUser } from "../apiClients/userApi";
import { IUser } from "../types";
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
interface UserEditorProps extends HTMLAttributes<HTMLDivElement> {
  onDeleted: () => void;
  onClose: () => void;
  user: IUser;
  jwt: string;
  isOpen: boolean;
}

// Account Closer
export default function AccountCloser(props: UserEditorProps) {
  // is Ready to delete
  const [isReady, setIsReady] = useState(false);

  // user name state
  const [text, setText] = useState("");

  // delete user hook
  const deleteUser = useDeleteUser();

  // Handle Change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // set the text
    setText(event.target.value);

    // check valid
    setIsReady(event.target.value === "confirm");
  }

  // Handle Delete
  const handleDelete = async () => {
    // delete user
    await deleteUser.mutateAsync({
      jwt: props.jwt,
    });

    // event
    props.onDeleted && props.onDeleted();

    // close the dialog
    props.onClose();
  }

  // Render
  return (
    <Dialog open={props.isOpen} onClose={props.onClose}>
      <DialogTitle>Delete Account</DialogTitle>
      <DialogContent>
        <DialogContentText className="mb-3">
          Are you sure you want to delete your account?
          Deleting Account will remove all your data
          and cannot be undone. If you are sure,
          please enter confirm below.
        </DialogContentText>
        <Box display="flex" flexDirection="column">
          <TextField
            onChange={handleChange}
            label="Please enter confirm"
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
          I changed my mind
        </Button>
        <Button
          onClick={handleDelete}
          color="warning"
          disabled={!isReady}
        >
          Delete Account
        </Button>
      </DialogActions>
    </Dialog>
  );
}
