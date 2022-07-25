/* eslint-disable @typescript-eslint/ban-ts-comment */
// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { HTMLAttributes, useState } from "react";
import { GOOGLE_CLIENT_ID } from "../constants";

import CloseImg from "../assets/images/close.svg";
import AppLogo from "../assets/images/logo.png";
import MenuImg from "../assets/images/menu.svg";

import styled from "styled-components";

import { useEffect } from "react";
import React from "react";

const NavigationDiv = styled.div`
  box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
  display: flex;
  width: 100vw;
  height: 80px;
  left: 0%;
  top: 0%;
  position: fixed;
  background-color: #fff;
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
  position: absolute;
  height: 100vh;
  display: flex;
  width: 300px;
  top: 0%;
  right: 0%;
  flex-direction: column;
  background-color: #4285F4;
  border-radius: 15px 0px 0px 15px;
  transition: all 0.5s linear;
`;

const CloseBtn = styled.img`
  margin-left: auto;
  cursor: pointer;
  height: 30px;
  width: 30px;
  padding: 15px;
  overflow: hidden;
`;

const SignOut = styled.div`
  height: 50px;
  width: 100px;
`;

// Navigation Props
interface IProps extends HTMLAttributes<HTMLDivElement> {
  onSignIn?: (token: string) => void;
  onSignOut?: () => void;
  isSignedIn: boolean;
}

// Navbar component
export default function Navigation({ onSignIn, onSignOut, isSignedIn }: IProps) {
  // Is the side bar hidden or not
  const [isHidden, setIsHidden] = useState<boolean>(true);

  // ref for the sign in sutton
  const signInRef = React.createRef<HTMLDivElement>();

  // dynamic right side component
  let RightSideComponent = (<SignIn ref={signInRef} />);

  // is signed in
  if (isSignedIn) {
    RightSideComponent = (<Menu src={MenuImg} onClick={() => setIsHidden(!isHidden)} />);
  }

  // attach the google sign in button
  // @ts-ignore
  google.accounts.id.initialize({client_id: GOOGLE_CLIENT_ID, callback: (res) => {
    onSignIn && onSignIn(res.credential)
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
    <NavigationDiv>
      <LogoImg src={AppLogo} alt="logo" />
      {RightSideComponent}
      <SideBar hidden={isHidden}>
        <CloseBtn src={CloseImg} onClick={() => setIsHidden(!isHidden)} />
      </SideBar>
    </NavigationDiv>
  );
}
