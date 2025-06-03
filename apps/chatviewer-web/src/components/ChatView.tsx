// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { HTMLAttributes, MouseEvent } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import styled, { css } from 'styled-components';
import { IChat } from "../types";
import React from 'react';
import {
  CircularProgress,
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  LinearProgress,
  SelectChangeEvent
} from "@mui/material";

// Horizontal Bar Props
interface IHorizontalBarProps extends HTMLAttributes<HTMLDivElement> {
  chat: IChat;
  onDelete?: (chat: IChat) => void;
  onOpen?: (chat: IChat) => void;
  onEdit?: (chat: IChat) => void;
}

// Horizontal Bar Wrapper
const HorizontalBarWrapper = styled('div')`
  box-shadow: rgba(17, 17, 26, 0.1) 0px 1px 0px;
  justify-content: space-between;
  padding: 10px;
  width: 100%;
  display: flex;
  flex-direction: row;
  position: relative;
  border-radius: 5px;
  &:hover {
    backdrop-filter: brightness(95%);
    cursor: pointer;
  }
`;

// File Details
const FileDetails = styled('div')`
  margin-right: auto;
  display: flex;
  width: 100%;
`;

// chat icon css
const FileIcon = styled(FileOpenIcon)`
  height: 20px;
  width: 20px;
  margin-right: 10px;
`;

// Chat Name Css
const ChatName = styled('div')`
  font-size: 1.0rem;
  max-width: 70%;
  overflow-y: hidden;
`;

// Chat Icons
const Options = styled('div')`
  justify-content: space-between;
  flex-direction: row;
  display: flex;
  align-items: center;
  margin-left: auto;
`;

// Icon Styles
const ImgIcon = css`
  margin-right: 10px;
  height: 20px;
  width: 20px;
  cursor: pointer;
  &:hover {
    transform: scale(1.2);
  }
`;

const DelIcon = styled(DeleteIcon)`
  ${ImgIcon}
`;

const PenIcon = styled(EditIcon)`
  ${ImgIcon}
`;

// Horizontal Bar
function HorizontalBar({ onDelete, onOpen, chat, onEdit }: IHorizontalBarProps) {
  // Click Handler o=for the Horizontal Bar
  const handleBarClick = (event: MouseEvent<HTMLDivElement>) => {
    // stop the event from propagating
    event.stopPropagation();

    // if onOpen is defined
    onOpen && onOpen(chat);
  }

  // Click Handler for the Delete Icon
  const handleDelete = (event: MouseEvent<SVGSVGElement>) => {
    // stop the event from propagating
    event.stopPropagation();

    // call the onDelete function
    onDelete && onDelete(chat);
  }

  // Click Handler for the Edit Icon
  const handleEdit = (event: MouseEvent<SVGSVGElement>) => {
    // stop the event from propagating
    event.stopPropagation();

    // call the onEdit function
    onEdit && onEdit(chat);
  }

  // render
  return (
    <HorizontalBarWrapper onClick={handleBarClick}>
      <FileDetails>
        <FileIcon />
        <ChatName>
          {chat.name}
        </ChatName>
      </FileDetails>
      <Options>
        <PenIcon onClick={handleEdit} />
        <DelIcon onClick={handleDelete} />
      </Options>
    </HorizontalBarWrapper>
  );
}

// Chat View Props
interface IChatViewProps extends HTMLAttributes<HTMLDivElement> {
  setSortBy: (shortBy: "name" | "createdAt" | "updatedAt") => void;
  sortBy: "name" | "createdAt" | "updatedAt";
  isFetching: boolean;
  isProgress: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  chats: IChat[] | null;
  onDelete?: (chat: IChat) => void;
  onOpen?: (chat: IChat) => void;
  onEdit?: (chat: IChat) => void;
}

// Chat View Wrapper
const ChatViewWrapper = styled('div')`
  flex-direction: column;
  display: flex;
  width: 90%;
  justify-content: center;
  border-radius: 10px;
`;

// header css
const Header = styled('div')`
  justify-content: space-between;
  display: flex;
  flex-direction: row;
  margin: 10px 10px;
  font-size: 1.2rem;
  font-weight: bold;
`;

// Title Css
const Title = styled('div')`
  font-size: 1.2rem;
`;

// Sort Css
const Sort = styled('div')`
`;

// Body css
const Body = styled('div')`
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
const NoChats = styled('div')`
  font-size: 1.2rem;
  font-weight: bold;
  margin-top: 10px;
  margin-bottom: 10px;
  text-align: center;
  color: #9e9e9e;
`;

// Footer Css
const Footer = styled('div')`
  flex-direction: row;
  align-items: center;
  display: flex;
  gap: 10px;
  margin: 5px 0px;
  justify-content: center;
`;

// Chat View
export default function ChatView({
  isFetching,
  isProgress,
  setSortBy,
  sortBy,
  hasPrev,
  hasNext,
  chats,
  onPrev,
  onNext,
  onDelete,
  onOpen,
  onEdit,
  className,
}: IChatViewProps) {
  // sort change handler
  const handleSortChange = (event: SelectChangeEvent<"name" | "createdAt" | "updatedAt">) => {
    setSortBy(event.target.value as typeof sortBy);
  }

  // if chats are loading
  if (chats === null) {
    return <CircularProgress sx={{ margin: "auto" }} />;
  }

  // select Component for the sortBy
  const SelectSort = (
    <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
      <InputLabel id="sort-by-label">Sort By</InputLabel>
      <Select
        onChange={handleSortChange}
        labelId="sort-by-label"
        value={sortBy}
        label="Sort By"
        id="sort-by-select"
      >
        <MenuItem value={"createdAt" as typeof sortBy}>
          Created At
        </MenuItem>
        <MenuItem value={"name" as typeof sortBy}>
          Name
        </MenuItem>
        <MenuItem value={"updatedAt" as typeof sortBy}>
          Updated At
        </MenuItem>
      </Select>
    </FormControl>
  )

  // chats component to render
  const UserChats = chats.map((chat: IChat) => {
    return (
      <React.Fragment>
        <HorizontalBar
          onDelete={onDelete}
          onOpen={onOpen}
          chat={chat}
          onEdit={onEdit}
        />
        <ChatDivider />
      </React.Fragment>
    );
  });

  // fetching status
  const Fetching = isFetching ? (
    <CircularProgress
      sx={{ margin: "8px auto 0 7px" }}
      size={"1rem"}
    />
  ) : (
    null
  );

  // progress bar
  const ProgressBar = isProgress ? (
    <LinearProgress
      sx={{ margin: "0 10px 0 10px" }}
    />
  ) : (
    null
  );

  // render
  return (
    <ChatViewWrapper className={className}>
      <Header>
        <Title>Your Chats List</Title>
        {Fetching}
        <Sort>{SelectSort}</Sort>
      </Header>
      {ProgressBar}
      <Body>
        {UserChats.length === 0 ? (
          <NoChats>No Chats</NoChats>
        ) : (
          UserChats
        )}
      </Body>
      <Footer>
        <Button disabled={!hasPrev || isFetching}
          variant="outlined"
          onClick={onPrev}
        >
          Prev
        </Button>
        <Button disabled={!hasNext || isFetching}
          variant="outlined"
          onClick={onNext}
        >
          Next
        </Button>
      </Footer>
    </ChatViewWrapper>
  );
}
