// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import styled from "styled-components";


const ClickableWrapper = styled("div") <{ isPrimary?: boolean }>`
  background-color: ${props => props.isPrimary ? "#4285F4" : "#FFF"};
  color: ${props => props.isPrimary ? "#FFF" : "#4285F4"};
  text-align: center;
  margin-top: 10px;
  cursor: pointer;
  padding: 10px;
  width: 200px;
  max-width: 100%;
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
