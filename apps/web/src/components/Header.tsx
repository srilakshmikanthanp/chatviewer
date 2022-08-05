/* eslint-disable @typescript-eslint/ban-ts-comment */
// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import MenuIcon from '@mui/icons-material/Menu';
import AppLogo from "../assets/images/logo.png";
import { GOOGLE_CLIENT_ID } from "../constants";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { IUser } from "../interfaces";
import React, { useState, useEffect } from "react";
import {
  MenuItem,
  Menu,
  Divider,
} from "@mui/material";

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
  // ref for Menu Button to open the menu
  const [menuRef, setMenuRef] = useState<SVGSVGElement | null>(null);

  // Is the side bar hidden or not
  const [isHidden, setIsHidden] = useState<boolean>(true);

  // ref for the sign in sutton
  const signInRef = React.createRef<HTMLDivElement>();

  // user details
  const user : IUser | null = null;

  // dynamic right side component
  let RightSideComponent = (<SignIn ref={signInRef} />);

  // is signed in
  if (user) {
    RightSideComponent = (
      <MenuIcon
        style={{ cursor: "pointer", marginLeft: "auto" }}
        onClick={() => setIsHidden(!isHidden)}
        ref={setMenuRef}
      />
    );
  }

  // attach the google sign in button
  // @ts-ignore
  google.accounts.id.initialize({
    client_id: GOOGLE_CLIENT_ID, callback: (res) => {
      console.log(res);
    }
  });

  // render the sign in button
  useEffect(() => {
    // @ts-ignore
    signInRef.current && google.accounts.id.renderButton(
      signInRef.current, { theme: 'outline', size: "medium" }
    );
  });

  // handle the Import Chat
  const handleImportChat = () => {
    console.log("Import Chat");
  }

  // handle the Dashboard
  const handleDashboard = () => {
    console.log("Dashboard");
  }

  // handle the Sign Out
  const handleSignOut = () => {
    console.log("Sign Out");
  }


  // render the component
  return (
    <HeaderContent>
      <Link to="/"><LogoImg src={AppLogo} alt="logo" /></Link>
      {RightSideComponent}
      {user && <Menu
        anchorEl={menuRef}
        open={!isHidden}
        onClose={() => setIsHidden(true)}
      >
        <MenuItem
          sx={{ justifyContent: "center" }}
          onClick={handleImportChat}
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
    </HeaderContent>
  );
}
