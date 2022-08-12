// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React, { HTMLAttributes, useState } from "react";
import { setUser } from "../redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { usePatchUser } from "../apiClients/userApi";
import { IUser } from "../interfaces";
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
  onClose: () => void;
  user: IUser;
  jwt: string;
  isOpen: boolean;
}

// User Editor
export default function UserEditor(props: UserEditorProps) {
  // user name state
  const [userName, setUserName] = useState(props.user.name);

  // is Ready
  const [isReady, setIsReady] = useState(false);

  // editor hook
  const patchUser = usePatchUser();

  // dispatch hook
  const dispatch = useDispatch();

  // Handle Change
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Set is ready false
    setIsReady(false);

    // Set user name
    setUserName(event.target.value);

    // check valid
    if (userName.length > 0 && userName !== props.user.name) {
      setIsReady(true);
    }
  }

  // Handle save
  const handleSave = async () => {
    // patch user details
    const resp = await patchUser.mutateAsync({
      userId: props.user.userId,
      jwt: props.jwt,
      options: {
        name: userName
      }
    });

    // dispatch user
    dispatch(setUser({
      userDetails: {
        user: resp.data,
        jwt: props.jwt
      }
    }));

    // set is ready false
    setIsReady(false);

    // close modal
    props.onClose();
  }

  // Render
  return (
    <Dialog open={props.isOpen} onClose={props.onClose}>
      <DialogTitle>Edit User</DialogTitle>
      <DialogContent>
        <DialogContentText className="mb-3">
          Edit the user details and click save to Proceed.
        </DialogContentText>
        <Box display="flex" flexDirection="column">
          <TextField
            onChange={handleChange}
            label="User Name"
            value={userName}
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
