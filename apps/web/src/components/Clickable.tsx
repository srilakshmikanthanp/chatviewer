// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import styled from "styled-components";

interface ButtonWrapperProps {
  backgroundColor?: string;
  color?: string;
}

const ButtonWrapper = styled("div")<ButtonWrapperProps>`
  background-color: ${props => props.backgroundColor || "#fff"};
  color: ${props => props.color || "#4285F4"};
  height: 13px;
  width: 200px;
  padding: 10px;
  text-align: center;
  margin-right: auto;
  margin-top: 10px;
  margin-left: auto;
  cursor: pointer;
  font-size: 15px;
  font-weight: bold;
  border-radius: 10px;
`;

interface IButtonProps {
  backgroundColor?: string;
  onClick?: () => void;
  color?: string;
  children?: string;
}

export default function Clickable({backgroundColor, onClick, color, children }: IButtonProps) {
  return (
    <ButtonWrapper color={color} backgroundColor={backgroundColor} onClick={onClick}>
      {children}
    </ButtonWrapper>
  );
}
