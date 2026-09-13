// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { setUser, selectUser, selectJwt } from "../redux/slices/userSlice";
import { MenuItem, Menu, Divider, CircularProgress } from "@mui/material";
import { createViewerState } from "../utilities/constructors";
import { useSelector, useDispatch } from "react-redux";
import { useCreateUser } from "../apiClients/userApi";
import { CredentialResponse, googleLogout, GoogleLogin } from '@react-oauth/google';
import { useDriveAuth } from "../apiClients/DriveAuthProvider";
import { useState } from "react";
import MenuIcon from '@mui/icons-material/Menu';
import AppLogo from "../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { IChat, IUser } from "../types";
import { ImportChat } from "../modals";
import { IMsg } from "../types";

const HeaderContent = styled('div')`
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

const LogoImg = styled('img')`
  max-height: 70px;
  max-width: 70px;
  margin-right: auto;
  padding: 10px;
`;

const Progress = styled(CircularProgress)`
  margin-left: auto;
  padding: 10px;
`;

const HeaderActions = styled('div')`
  margin-left: auto;
  display: flex;
  align-items: center;
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
  const { clearToken } = useDriveAuth();

  const signHandler = async (response: CredentialResponse) => {
    if (!response.credential) {
      throw new Error('Google sign-in did not return an ID token');
    }

    try {
      setIsSignInProgress(true);
      const res = await createUser.mutateAsync({ token: response.credential });
      const jwt = res.headers["auth-token"];
      const user = res.data;
      dispatch(setUser({ user, jwt }));
    } finally {
      setIsSignInProgress(false);
    }
  };

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
      return <GoogleLogin onSuccess={signHandler} onError={() => undefined} />;
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

  // handle the Sign Out
  const handleSignOut = () => {
    dispatch(setUser({ user: null, jwt: null, }));
    clearToken();
    googleLogout();
    navigate("/");
  }

  // render the component
  return (
    <HeaderContent>
      <Link to="/"><LogoImg src={AppLogo} alt="logo" /></Link>
    <HeaderActions>{RightSideComponent}</HeaderActions>
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
        jwt={jwt}
        isOpen={isImportModalVisible}
        onImport={handleImportChat}
      />
    </HeaderContent>
  );
}
