// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export default interface IChat {
  createdAt: string;
  blobUrl: string;
  mimeType: string;
  name: string;
  chatId: number;
  userId: number;
  updatedAt: string;
}
