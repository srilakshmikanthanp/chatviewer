// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { IChat } from '../interfaces';

// To get all the chats Details
export const useGetChats = ({
  userId,
  token
}: {
  userId: string;
  token: string;
}) => {
  // Query Key
  const queryKey = ['users', userId, 'chats'];

  // Response
  type ResponseType = IChat[];

  // Query
  return useQuery(queryKey, async () => {
    const response = await axios.get(`/api/v1/users/${userId}chats`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data as ResponseType;
  });
};

// To get the chat details
export const useGetChat = ({
  userId,
  chatId,
  token
}: {
  userId: string;
  chatId: number;
  token: string;
}) => {
  // Query Key for the get chat
  const queryKey = ['users', userId, 'chat', chatId];

  // Response Type
  type ResponseType = IChat;

  // Query
  return useQuery(queryKey, async () => {
    const response = await axios.get(`/api/v1/users/${userId}chats/${chatId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data as ResponseType;
  });
};

// To create a new chat
export const useCreateChat = () => {
  // MutationParams
  type MutationParams = {
    userId: number;
    token: string;
    chat: IChat;
  };

  // MutationResult
  type MutationResult = IChat;

  // Mutation
  return useMutation(async ({ userId, token, chat }: MutationParams) => {
    const response = await axios.post(
      `/api/v1/users/${userId}/chats`,
      { chat },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data as MutationResult;
  });
};
