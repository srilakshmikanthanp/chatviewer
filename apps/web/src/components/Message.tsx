// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React, { HtmlHTMLAttributes } from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import ReactPlayer from 'react-player/youtube';
import styled from 'styled-components';
import { linkify } from '../utilities';
import { IMsg } from '../interfaces';

const MessageWrapper = styled('div') < { isPrimary: boolean } >`
  align-items: ${props => props.isPrimary ? "flex-end" : "flex-start"};
  justify-content: center;
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin: 10px;
  background-color: transparent;
`;

const MessageAuthor = styled('div')`
  color: var(--text-color);
  font-size: 102%;
  margin: 10px;
  font-weight: bold;
`;

const MessageCover = styled('div') < { isPrimary: boolean } >`
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
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

const MessageImage = styled('img')`
  border-radius: 10px;
  max-width: 100%;
  max-height: 400px;
  object-fit: cover;
`;

const MessageText = styled('div')`
  word-wrap: break-word;
  max-width: 350px;
  min-width: 20px;
  padding: 5px;
  font-size: 100%;
  font-weight: bold;
`;

const MessageMedia = styled('a')`
  color: var(--text-color);
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const MessageTime = styled('div')`
  font-weight: bold;
  color: gray;
  margin: 10px;
  font-size: 80%;
`;

// component props
interface IMessageProps extends HtmlHTMLAttributes<HTMLDivElement> {
  onClicked?: (msgId: number) => void;
  message: IMsg;
  isPrimary: boolean;
}

// component
function Message({ onClicked, message, isPrimary }: IMessageProps) {
  // media body of message component
  let mediaBodyComponent: JSX.Element | null = null;

  // switch on message type
  switch (message?.media?.mimeType.split('/')[0]) {
    case 'image':
      mediaBodyComponent = (
        <MessageImage
          src={message.media.url}
        />
      );
      break;
    case 'audio':
      mediaBodyComponent = (
        <AudioPlayer
          src={message.media.url}
        />
      );
      break;
    case 'video':
      mediaBodyComponent = (
        <ReactPlayer
          url={message.media.url}
          height = "100%"
          width = "100%"
          controls = {true}
        />
      );
      break;
    default:
      if(message.media) {
        mediaBodyComponent = (
          <MessageMedia
            href={message.media.url}
            target="_blank"
          />
        );
      }
      break;
  }

  // add text to body
  const messageBody = (
    <MessageCover isPrimary={isPrimary}>
      {mediaBodyComponent}
      <MessageText dangerouslySetInnerHTML={{ __html: linkify(message.message) }} />
    </MessageCover>
  );

  // render the component
  return (
    <MessageWrapper isPrimary={isPrimary}>
      <MessageAuthor>
        {message.author}
      </MessageAuthor>
      {messageBody}
      <MessageTime>
        {message.timestamp}
      </MessageTime>
    </MessageWrapper>
  );
}

export default Message;
