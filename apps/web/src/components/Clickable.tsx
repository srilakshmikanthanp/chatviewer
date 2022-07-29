// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import styled from "styled-components";


const ClickableWrapper = styled("div") <{ isPrimary?: boolean }>`
  background-color: ${props => props.isPrimary ? "#4285F4" : "#FFF"};
  color: ${props => props.isPrimary ? "#FFF" : "#4285F4"};
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

interface IClickableProps {
  isPrimary: boolean;
  onClick?: () => void;
  children?: string;
}

export default function Clickable({ isPrimary, onClick, children }: IClickableProps) {
  return (
    <ClickableWrapper isPrimary={isPrimary} onClick={onClick}>
      {children}
    </ClickableWrapper>
  );
}
