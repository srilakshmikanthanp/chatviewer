// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { IChat } from '../interfaces';

// To get the chat with token
export const useChatWithToken = ({ token }: { token: string }) => {
  // Query Key for the get chat
  const queryKey = ['chats', token];

  // Response Type
  type ResponseType = IChat;

  // Fetcher
  const fetcher = async () => {
    const QueryUrl = `/api/v1/util/chats/${token}`;
    return await axios.get<ResponseType>(QueryUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  // Query
  return useQuery(queryKey, fetcher);
};

// To get Blob with token
export const useBlobWithToken = ({ token }: { token: string }) => {
  // Query Key for the get chat
  const queryKey = ['chats', token, 'blob'];

  // Response Type
  type ResponseType = Blob;

  // Fetcher
  const fetcher = async () => {
    const QueryUrl = `/api/v1/util/chats/${token}/blob`;
    return await axios.get<ResponseType>(QueryUrl, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
    });
  };

  // Query
  return useQuery(queryKey, fetcher);
};
