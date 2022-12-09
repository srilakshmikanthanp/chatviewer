/* eslint-disable @typescript-eslint/ban-ts-comment */
// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { setUser, selectUser, selectJwt } from "../redux/slices/userSlice";
import { MenuItem, Menu, Divider, CircularProgress } from "@mui/material";
import { createViewerState } from "../utilities/constructors";
import { useSelector, useDispatch } from "react-redux";
import { useCreateUser } from "../apiClients/userApi";
import React, { useState, useEffect } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import AppLogo from "../assets/images/logo.png";
import { GOOGLE_CLIENT_ID } from "../constants";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { IChat, IUser } from "../interfaces";
import { ImportChat } from "../modals";
import { IMsg } from "../interfaces";

const HeaderContent = styled.div`
  background-color: var(--bs-body-bg);
  color: var(--bs-body-color);
  display: flex;
  width: 100%;
  height: 80px;
  left: 0%;
  top: 0%;
  padding: 0px 10px;
  position: fixed;
  align-items: center;
  z-index: 1;
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

const Progress = styled(CircularProgress)`
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

  // is sign in progress
  const [isSignInProgress, setIsSignInProgress] = useState(false);

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

  // jwt token
  const jwt: string | null = useSelector(selectJwt);

  // Menu Icon
  const MenuBar = (
    <MenuIcon style={{ cursor: "pointer", margin: "0 10px 0 auto" }}
      onClick={() => setIsMenuHidden(!isMenuHidden)}
      ref={setMenuRef}
    />
  );

  // dynamic right side component
  const RightSideComponent = (() => {
    if (isSignInProgress) {
      return <Progress />;
    } else if (user !== null) {
      return MenuBar;
    } else {
      return <SignIn ref={signInRef} />;
    }
  })();

  // handle the Import Chat
  const handleImportChat = (msgs: IMsg[], chat: IChat | null) => {
    // Navigate to the chat view Page
    navigate("/viewchat", { state: createViewerState(chat, msgs) });

    // Hide the Import Chat modal
    SetIsImportModalVisible(false);
  }

  // handle the Dashboard
  const handleDashboard = () => {
    navigate("/dashboard");
  }

  // Sign Handler
  const signHandler = async (token: string) => {
    // set the sign in progress state
    setIsSignInProgress(true);

    // sign in the user
    const res = await createUser.mutateAsync({ token });
    const jwt = res.headers["auth-token"];
    const user = res.data;
    dispatch(setUser({ user, jwt }));

    // set the sign in progress state
    setIsSignInProgress(false);
  }

  // handle the Sign Out
  const handleSignOut = () => {
    // dispatch the sign out action
    dispatch(setUser({ user: null, jwt: null, }));

    // navigate to the sign in page
    navigate("/");
  }

  // render the sign in button
  useEffect(() => {
    // @ts-ignore
    signInRef.current && google.accounts.id.renderButton(
      signInRef.current, { theme: 'outline', size: "medium" }
    );
  });

  // attach the google sign in button
  // @ts-ignore
  google.accounts.id.initialize({
    callback: (res) => signHandler(res.credential),
    client_id: GOOGLE_CLIENT_ID,
  });

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
          Dashboard
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
        user={user}
        jwt={jwt}
        isOpen={isImportModalVisible}
        onImport={handleImportChat}
      />
    </HeaderContent>
  );
}
