// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { HtmlHTMLAttributes } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import ReactPlayer from 'react-player/youtube';
import styled from 'styled-components';
import { linkify } from '../utilities';
import { IMsg } from '../interfaces';

const ChatBoxWrapper = styled('div') < { isPrimary: boolean } >`
  align-items: ${props => props.isPrimary ? "flex-end" : "flex-start"};
  justify-content: center;
  display: flex;
  flex-direction: column;
  padding: 10px 0px;
  margin: 5px 10px;
  background-color: transparent;
`;

const ChatBoxAuthor = styled('div')`
  color: var(--text-color);
  font-size: 102%;
  margin: 5px;
  font-weight: bold;
`;

const ChatBoxCover = styled('div') < { isPrimary: boolean } >`
  box-shadow: var(--bs-border-color) 0px 2px 8px 0px;
  background-color: ${props => props.isPrimary ? (
    "var(--pri-msg-bg-color)"
  ) : (
    "var(--sec-msg-bg-color)"
  )};
  color: ${props => props.isPrimary ? (
    "var(--pri-msg-fg-color)"
  ) : (
    "var(--sec-msg-fg-color)"
  )};
  border-radius: 10px;
  position: relative;
  font-weight: bold;
  font-size: 100%;
  margin: 10px;
  max-width: 350px;
  min-width: 20px;
  padding: 8px;
  &:before {
    filter: drop-shadow(0px 2px 1px rgb(var(--shadow-color)));
    border-top: 10px solid ${props => props.isPrimary ? (
      "var(--pri-msg-bg-color)"
    ) : (
      "var(--sec-msg-bg-color)"
    )};
    border-right: 10px solid transparent;
    border-left: 10px solid transparent;
    border-bottom: 10px solid transparent;
    content: "";
    width: 0px;
    height: 0px;
    top: -18px;
    position: absolute;
    transform: rotate(180deg);
    right: ${props => props.isPrimary ? "5px" : "initial"};
    left: ${props => !props.isPrimary ? "5px" : "initial"};
  }
`;

const ChatBoxImage = styled('img')`
  border-radius: 10px;
  max-width: 100%;
  max-height: 400px;
  object-fit: cover;
`;

const ChatBoxText = styled('div')`
  word-wrap: break-word;
  max-width: 350px;
  min-width: 20px;
  padding: 5px;
  font-size: 100%;
  font-weight: bold;
`;

const ChatBoxMedia = styled('a')`
  color: var(--bs-body-color);
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const ChatBoxTime = styled('div')`
  font-weight: bold;
  color: gray;
  margin: 5px;
  font-size: 60%;
`;

// component props
interface IChatBoxProps extends HtmlHTMLAttributes<HTMLDivElement> {
  onClicked?: (msgId: number) => void;
  message: IMsg;
  isPrimary: boolean;
}

// component
function ChatBox({ onClicked, message, isPrimary }: IChatBoxProps) {
  // media body of ChatBox component
  let mediaBodyComponent: JSX.Element | null = null;

  // switch on ChatBox type
  switch (message?.media?.type.split('/')[0]) {
    case 'image':
      mediaBodyComponent = (
        <ChatBoxImage
          src={URL.createObjectURL(message.media)}
        />
      );
      break;
    case 'audio':
      mediaBodyComponent = (
        <AudioPlayer
          style={{ minWidth: '320px' }}
          src={URL.createObjectURL(message.media)}
        />
      );
      break;
    case 'video':
      mediaBodyComponent = (
        <ReactPlayer
          url={URL.createObjectURL(message.media)}
          height = "200px"
          width = "100%"
          controls = {true}
        />
      );
      break;
    default:
      if(message.media) {
        mediaBodyComponent = (
          <ChatBoxMedia
            href={URL.createObjectURL(message.media)}
            target="_blank"
          />
        );
      }
      break;
  }

  // add text to body
  const ChatBoxBody = (
    <ChatBoxCover isPrimary={isPrimary}>
      {mediaBodyComponent}
      <ChatBoxText dangerouslySetInnerHTML={{
        __html: linkify(message.message)
      }} />
    </ChatBoxCover>
  );

  // render the component
  return (
    <ChatBoxWrapper isPrimary={isPrimary}>
      <ChatBoxAuthor>
        {message.author}
      </ChatBoxAuthor>
      {ChatBoxBody}
      <ChatBoxTime>
        {message.timestamp.toLocaleString()}
      </ChatBoxTime>
    </ChatBoxWrapper>
  );
}

export default ChatBox;
