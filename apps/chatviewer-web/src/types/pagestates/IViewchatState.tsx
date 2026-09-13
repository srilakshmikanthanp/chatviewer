// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import IViewerChat from "../IViewerChat";
import IMsg from "../IMsg";

export default interface IViewchatState {
  header: {
    chat: IViewerChat | null;
  },
  body: {
    messages: IMsg[];
  }
}
