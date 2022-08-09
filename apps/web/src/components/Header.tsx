/* eslint-disable @typescript-eslint/ban-ts-comment */
// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { setUser, selectUser } from "../redux/slices/userSlice";
import { createViewerState } from "../utilities/constructors";
import { MenuItem, Menu, Divider } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { useCreateUser } from "../apiClients/userApi";
import React, { useState, useEffect } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import AppLogo from "../assets/images/logo.png";
import { GOOGLE_CLIENT_ID } from "../constants";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { IUser } from "../interfaces";
import { ImportChat } from "../modals";
import { IMsg } from "../interfaces";

const HeaderContent = styled.div`
  background-color: var(--bs-body-bg);
  color: var(--bs-body-color);
  display: flex;
  width: 100vw;
  height: 80px;
  left: 0%;
  top: 0%;
  padding: 0px 10px;
  position: fixed;
  align-items: center;
`;

const LogoImg = styled.img`
  max-height: 70px;
  max-width: 70px;
  margin-right: auto;
  padding: 10px;
`;

const SignIn = styled.div`
  margin-left: auto;
  padding: 10px;
`;

// Navbar component
export default function Header() {
  // is Import model is in view or not state
  const [isImportModalVisible, SetIsImportModalVisible] = useState(false);

  // ref for Menu Button to open the menu
  const [menuRef, setMenuRef] = useState<SVGSVGElement | null>(null);

  // Is the side bar hidden or not
  const [isMenuHidden, setIsMenuHidden] = useState(true);

  // ref for the sign in sutton
  const signInRef = React.createRef<HTMLDivElement>();

  // create use mutation hook for creating a user
  const createUser = useCreateUser();

  // use Dispatch to dispatch actions
  const dispatch = useDispatch();

  // navigate hook
  const navigate = useNavigate();

  // user details
  const user: IUser | null = useSelector(selectUser);

  // Sign Handler
  const signHandler = async (token: string) => {
    const response = await createUser.mutateAsync({ token });
    const jwt = response.headers["auth-token"];
    const user = response.data;
    dispatch(setUser({ userDetails: { user, jwt } }));
  }

  // dynamic right side component
  const RightSideComponent = user ? (
    <MenuIcon
      style={{ cursor: "pointer", margin: "0 10px 0 auto" }}
      onClick={() => setIsMenuHidden(!isMenuHidden)}
      ref={setMenuRef}
    />
  ) : (
    <SignIn ref={signInRef} />
  );

  // attach the google sign in button
  // @ts-ignore
  google.accounts.id.initialize({
    callback: (res) => signHandler(res.credential),
    client_id: GOOGLE_CLIENT_ID,
  });

  // render the sign in button
  useEffect(() => {
    // @ts-ignore
    signInRef.current && google.accounts.id.renderButton(
      signInRef.current, { theme: 'outline', size: "medium" }
    );
  });

  // handle the Import Chat
  const handleImportChat = (msgs: IMsg[], chatId: number | null) => {
    // Navigate to the chat view Page
    navigate("/viewchat", { state: createViewerState(chatId, msgs) });

    // Hide the Import Chat modal
    SetIsImportModalVisible(false);
  }

  // handle the Dashboard
  const handleDashboard = () => {
    navigate("/dashboard");
  }

  // handle the Sign Out
  const handleSignOut = () => {
    dispatch(setUser({userDetails: null}));
  }

  // render the component
  return (
    <HeaderContent>
      <Link to="/"><LogoImg src={AppLogo} alt="logo" /></Link>
      {RightSideComponent}
      {user && <Menu anchorEl={menuRef} open={!isMenuHidden} onClose={() => setIsMenuHidden(true)} >
        <MenuItem
          sx={{ justifyContent: "center" }}
          onClick={() => SetIsImportModalVisible(true)}
        >
          Import Chat
        </MenuItem>
        <MenuItem
          sx={{ justifyContent: "center" }}
          onClick={handleDashboard}
        >
          My account
        </MenuItem>
        <Divider />
        <MenuItem
          sx={{ justifyContent: "center" }}
          onClick={handleSignOut}
        >
          Sign Out
        </MenuItem>
      </Menu>}
      <ImportChat
        onClose={() => SetIsImportModalVisible(false)}
        isOpen={isImportModalVisible}
        onImport={handleImportChat}
      />
    </HeaderContent>
  );
}
