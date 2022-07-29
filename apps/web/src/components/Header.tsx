/* eslint-disable @typescript-eslint/ban-ts-comment */
// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import CloseImg from "../assets/images/close.svg";
import AppLogo from "../assets/images/logo.png";
import MenuImg from "../assets/images/menu.svg";
import { GOOGLE_CLIENT_ID } from "../constants";
import styled from "styled-components";
import { IUser } from "../interfaces";
import { useEffect } from "react";
import { useState } from "react";
import Clickable from "./Clickable";
import React from "react";

const HeaderWrapper = styled.div`
  background-color: var(--background-color);
  color: var(--text-color);
  display: flex;
  width: 100vw;
  height: 80px;
  left: 0%;
  top: 0%;
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

const Menu = styled.img`
  margin-left: auto;
  cursor: pointer;
  height: 30px;
  width: 30px;
  padding: 15px;
`;

const SideBar = styled.div`
  transform: translateX(${props => props.hidden ? "300px" : "0px"});
  justify-content: center;
  flex-direction: column;
  position: absolute;
  height: 100vh;
  display: flex;
  width: 300px;
  top: 0%;
  right: 0%;
  align-items: center;
  background-color: #4285F4;
  border-radius: 15px 0px 0px 15px;
  transition: all 0.5s ease-in-out;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const CloseBtn = styled.img`
  position: absolute;
  margin-left: auto;
  cursor: pointer;
  height: 30px;
  width: 30px;
  right: 15px;
  top: 15px;
  padding: 15px;
  overflow: hidden;
`;

const UserDetails = styled.div`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  display: flex;
  margin-top: 10px;
  margin-bottom: 70px;
`;

const FullName = styled.div`
  font-weight: bold;
  font-size: 23px;
  margin: auto;
  color: #fff;
`;

const Email = styled.div`
  font-size: 15px;
  margin: auto;
  color: #fff;
`;

// Navbar component
export default function Header() {
  // Is the side bar hidden or not
  const [isHidden, setIsHidden] = useState<boolean>(true);

  // ref for the sign in sutton
  const signInRef = React.createRef<HTMLDivElement>();

  // user details
  const user = undefined as IUser | undefined;

  // dynamic right side component
  let RightSideComponent = (<SignIn ref={signInRef} />);

  // is signed in
  if (user) {
    RightSideComponent = (<Menu src={MenuImg} onClick={() => setIsHidden(!isHidden)} />);
  }

  // attach the google sign in button
  // @ts-ignore
  google.accounts.id.initialize({client_id: GOOGLE_CLIENT_ID, callback: (res) => {
    console.log(res);
  }});

  // render the sign in button
  useEffect(() => {
    // @ts-ignore
    signInRef.current && google.accounts.id.renderButton(signInRef.current, {
      theme: 'outline', size: "large"
    });
  });

  // render the component
  return (
    <HeaderWrapper>
      <LogoImg src={AppLogo} alt="logo" />
      {RightSideComponent}
      <SideBar hidden={isHidden}>
        <CloseBtn src={CloseImg} onClick={() => setIsHidden(!isHidden)} />
        <ContentWrapper>
          <UserDetails>
            <FullName>{user?.name}</FullName>
            <Email>{user?.email}</Email>
          </UserDetails>
          <Clickable
            isPrimary={false}
            onClick={() => null}
          >
            View Profile
          </Clickable>
          <Clickable
            isPrimary={false}
            onClick={() => null}
          >
            Upload Chat
          </Clickable>
          <Clickable
            isPrimary={false}
            onClick={() => null}
          >
            Sign Out
          </Clickable>
        </ContentWrapper>
      </SideBar>
    </HeaderWrapper>
  );
}
