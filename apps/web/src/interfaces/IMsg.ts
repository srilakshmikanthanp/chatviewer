// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export default interface IMsg {
  message: string;
  author: string;
  timestamp: string;
  msgId: number;
  media?: {
    mimeType: string;
    url: string;
  }
}
