// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import IChat from "../IChat";
import IMsg from "../IMsg";

export default interface IViewchatState {
  header: {
    chat: IChat | null;
  },
  body: {
    messages: IMsg[];
  }
}
