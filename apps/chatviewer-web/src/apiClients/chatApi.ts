// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { IChat } from '../types';

// To get all the chats Details
export const useGetChats = ({
  jwt,
  params,
}: {
  jwt: string;
  params: {
    perPage: number;
    page: number;
    sortBy: string;
  };
}) => {
  // Query Key
  const queryKey = ['chats', params.perPage, params.page, params.sortBy];

  // Response
  type ResponseType = IChat[];

  // Fetcher
  const fetcher = async () => {
    const QueryUrl = `/api/v2/chats?perPage=${params.perPage}` +
    `&page=${params.page}&sortBy=${params.sortBy}`
    return await axios.get<ResponseType>(QueryUrl, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
  };

  // Query
  return useQuery({
    refetchOnWindowFocus: false,
    queryKey,
    queryFn: fetcher,
    placeholderData: (prev) => prev
  })
};

// To get the chat details
export const useGetChat = ({
  chatId,
  jwt,
}: {
  chatId: number;
  jwt: string;
}) => {
  // Query Key for the get chat
  const queryKey = ['chats', chatId];

  // Response Type
  type ResponseType = IChat;

  // Fetcher
  const fetcher = async () => {
    const QueryUrl = `/api/v2/chats/${chatId}`;
    return await axios.get<ResponseType>(QueryUrl, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
  };

  // Query
  return useQuery({
    refetchOnWindowFocus: false,
    queryKey,
    queryFn: fetcher,
    placeholderData: (prev) => prev
  });
};

// To create a new chat
export const useCreateChat = () => {
  // Query Client Hook
  const queryClient = useQueryClient();

  // MutationParams
  type MutationParams = {
    jwt: string;
    chat: {
      driveFileId: string;
      name: string;
    };
  };

  // MutationResult
  type MutationResult = IChat;

  // Mutator
  const mutator = async ({ jwt, chat }: MutationParams) => {
    const QueryUrl = `/api/v2/chats`;
    return await axios.post<MutationResult>(QueryUrl, { ...chat }, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
  };

  // Mutation
  return useMutation({
    mutationFn: mutator,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
    }
  })
};

// To patch the chat details
export const usePatchChat = () => {
  // client for the query
  const client = useQueryClient();

  // Mutation Params
  type MutationParams = {
    jwt: string;
    chatId: number;
    options: {
      name?: string;
    };
  };

  // MutationResult
  type MutationResult = IChat;

  // Mutator
  const mutator = async ({
    jwt,
    chatId,
    options
  }: MutationParams) => {
    const QueryUrl = `/api/v2/chats/${chatId}`;
    return await axios.patch<MutationResult>(QueryUrl, { ...options }, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
  }

  // Query
  return useMutation({
    mutationFn: mutator,
    onSuccess: (data, variables) => {
      client.invalidateQueries({ queryKey: ['chats'] });
      client.setQueryData(['chat', variables.chatId], data);
    }
  });
}

// To delete the chat
export const useDeleteChat = () => {
  // Query Client Hook
  const queryClient = useQueryClient();

  // Mutation Params
  type MutationParams = {
    jwt: string;
    chatId: number;
  };

  // Mutation Result
  type MutationResult = {
    message: string;
  }

  // Mutator
  const mutator = async ({ jwt, chatId }: MutationParams) => {
    const QueryUrl = `/api/v2/chats/${chatId}`;
    return await axios.delete<MutationResult>(QueryUrl, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
  }

  // Query
  return useMutation({
    mutationFn: mutator,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chats'] });
      queryClient.removeQueries({ queryKey: ['chat', variables.chatId] });
    }
  });
}
