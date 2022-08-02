// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import IMsg from "../IMsg";

export default interface IMsgState {
  header: {
    primaryAuthor: string;
  },
  body: {
    messages: IMsg[];
  }
}
