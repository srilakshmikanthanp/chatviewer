// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Button, Divider, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { HTMLAttributes, MouseEvent } from 'react';
import Minus from "../assets/images/minus.svg";
import Share from "../assets/images/share.svg";
import styled from 'styled-components';
import { IChat } from "../interfaces";
import React from 'react';

// Horizontal Bar Props
interface IHorizontalBarProps extends HTMLAttributes<HTMLDivElement> {
  chat: IChat;
  onDelete?: (chat: IChat) => void;
  onOpen?: (chat: IChat) => void;
  onEdit?: (chat: IChat) => void;
  onShare?: (chat: IChat) => void;
}

// Horizontal Bar Wrapper
const HorizontalBarWrapper = styled.div`
  justify-content: space-between;
  padding: 10px;
  width: 100%;
  display: flex;
  flex-direction: row;
  &:hover {
    backdrop-filter: brightness(95%);
    cursor: pointer;
  }
`;

// Chat Name Css
const ChatName = styled.div`
  margin-right: auto;
  font-size: 1.0rem;
  max-width: 70%;
  overflow-y: hidden;
`;

// Chat Icons
const Options = styled.div`
  justify-content: space-between;
  flex-direction: row;
  display: flex;
  align-items: center;
  margin-left: auto;
`;

const ImgIcon = styled.img`
  max-height: 20px;
  margin: 0 auto;
  max-width: 20px;
  width: 20px;
  height: 20px;
  margin: 0px 10px;
  cursor: pointer;
  &:hover {
    transform: scale(1.1);
  }
`;

// Horizontal Bar
function HorizontalBar({
  onDelete,
  onOpen,
  chat,
  onEdit,
  onShare
}: IHorizontalBarProps) {
  // Click Handler o=for the Horizontal Bar
  const handleBarClick = (event: MouseEvent<HTMLDivElement>) => {
    // stop the event from propagating
    event.stopPropagation();

    // if single click
    if (event.detail === 1) {
      onEdit && onEdit(chat);
    }

    // if double click
    if (event.detail === 2) {
      onOpen && onOpen(chat);
    }
  }

  // Click Handler for the Delete Icon
  const handleDelete = (event: MouseEvent<HTMLDivElement>) => {
    // stop the event from propagating
    event.stopPropagation();

    // call the onDelete function
    onDelete && onDelete(chat);
  }

  // Click Handler for the Share Icon
  const handleShare = (event: MouseEvent<HTMLDivElement>) => {
    // stop the event from propagating
    event.stopPropagation();

    // call the onShare function
    onShare && onShare(chat);
  }

  // render
  return (
    <HorizontalBarWrapper onClick={handleBarClick}>
      <ChatName>{chat.name}</ChatName>
      <Options>
        <ImgIcon src={Share} onClick={handleShare} />
        <ImgIcon src={Minus} onClick={handleDelete} />
      </Options>
    </HorizontalBarWrapper>
  );
}

// Chat View Props
interface IChatViewProps extends HTMLAttributes<HTMLDivElement> {
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  chats: IChat[];
  onDelete?: (chat: IChat) => void;
  onOpen?: (chat: IChat) => void;
  onEdit?: (chat: IChat) => void;
  onShare?: (chat: IChat) => void;
}

// Chat View Wrapper
const ChatViewWrapper = styled.div`
  flex-direction: column;
  display: flex;
  width: 90%;
  padding: 15px;
  justify-content: center;
  border-radius: 10px;
`;

// header css
const Header = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: row;
  margin: 10px 10px;
  font-size: 1.2rem;
  font-weight: bold;
`;

// Title Css
const Title = styled.div`
  margin-right: auto;
  font-size: 1.2rem;
`;

// Sort Css
const Sort = styled.div`
  margin-left: auto;
`;

// Body css
const Body = styled.div`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  display: flex;
  overflow-y: auto;
  margin: 5px 0px;
`;

// Chat Divider
const ChatDivider = styled(Divider)`
  width: 100%;
  height: 3px;
`;

// No Chats css
const NoChats = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
  color: #9e9e9e;
`;

// Footer Css
const Footer = styled.div`
  flex-direction: row;
  align-items: center;
  display: flex;
  gap: 10px;
  margin: 5px 0px;
  justify-content: center;
`;

// Chat View
export default function ChatView({
  hasPrev,
  hasNext,
  chats,
  onPrev,
  onNext,
  onDelete,
  onOpen,
  onEdit,
  onShare
}: IChatViewProps) {
  // short by state to sort the chats
  const [sortBy, setSortBy] = React.useState('name');

  // sort the chats
  const sortedChats = chats.sort((a, b) => {
    if (sortBy === 'date') {
      return a.createdAt.getTime() - a.createdAt.getTime();
    }

    return a.name.localeCompare(b.name);
  });

  // select Component for the sortBy
  const SelectSort = (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="sort-by-label">Sort By</InputLabel>
      <Select
        onChange={e => setSortBy(e.target.value)}
        labelId="sort-by-label"
        value={sortBy}
        label="Sort By"
        id="sort-by-select"
      >
        <MenuItem value="name">Name</MenuItem>
        <MenuItem value="date">Date</MenuItem>
      </Select>
    </FormControl>
  )


  // chats component to render
  const UserChats = sortedChats.map((chat: IChat) => {
    return (
      <React.Fragment>
        <HorizontalBar
          onDelete={onDelete}
          onOpen={onOpen}
          chat={chat}
          onEdit={onEdit}
          onShare={onShare}
        />
        <ChatDivider />
      </React.Fragment>
    );
  });

  // render
  return (
    <ChatViewWrapper>
      <Header>
        <Title>Your Chats List</Title>
        <Sort>{SelectSort}</Sort>
      </Header>
      <Body>
        {UserChats.length === 0 ? (
          <NoChats>No Chats</NoChats>
        ) : (
          UserChats
        )}
      </Body>
      <Footer>
        <Button disabled={!hasPrev}
          variant="outlined"
          onClick={onPrev}
        >
          Prev
        </Button>
        <Button disabled={!hasNext}
          variant="outlined"
          onClick={onNext}
        >
          Next
        </Button>
      </Footer>
    </ChatViewWrapper>
  );
}
