// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { IViewchatState } from "../types/pagestates";
import { IChat, IMsg, IViewerChat } from "../types";

/**
 * This function is used to create a new IViewerState object.
 *
 * @param messages - messages to be displayed
 * @return - returns a viewer state
 */
export function createViewerState(
  chat: IChat | IViewerChat | null,
  messages: IMsg[],
): IViewchatState {
  const viewerChat = chat && 'chatId' in chat
    ? { ...chat, canShare: chat.chatId > 0 }
    : chat;

  return {
    header: { chat: viewerChat },
    body: { messages }
  };
}
