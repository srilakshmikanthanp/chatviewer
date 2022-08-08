// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { IChat } from '../interfaces';

// To get all the chats Details
export const useGetChats = ({
  userId,
  jwt,
  params,
}: {
  userId: string;
  jwt: string;
  params: {
    per_page: number;
    page: number;
  };
}) => {
  // Query Key
  const queryKey = ['users', userId, 'chats'];

  // Response
  type ResponseType = IChat[];

  // Fetcher
  const fetcher = async () => {
    const QueryUrl = `/api/v1/users/${userId}/chats?per_page=${params.per_page}?page=${params.page}`;
    return await axios.get<ResponseType>(QueryUrl, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
  };

  // Query
  return useQuery(queryKey, fetcher);
};

// To get the chat details
export const useGetChat = ({
  userId,
  chatId,
  jwt,
}: {
  userId: string;
  chatId: number;
  jwt: string;
}) => {
  // Query Key for the get chat
  const queryKey = ['users', userId, 'chat', chatId];

  // Response Type
  type ResponseType = IChat;

  // Fetcher
  const fetcher = async () => {
    const QueryUrl = `/api/v1/users/${userId}/chats/${chatId}`;
    return await axios.get<ResponseType>(QueryUrl, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
  };

  // Query
  return useQuery(queryKey, fetcher);
};

// To create a new chat
export const useCreateChat = () => {
  // MutationParams
  type MutationParams = {
    userId: number;
    jwt: string;
    chat: IChat;
  };

  // MutationResult
  type MutationResult = IChat;

  // Mutator
  const mutator = async ({ userId, jwt, chat }: MutationParams) => {
    const QueryUrl = `/api/v1/users/${userId}/chats`;
    return await axios.post<MutationResult>(QueryUrl, { chat }, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
  };

  // Mutation
  return useMutation(mutator);
};

// To patch the chat details
export const usePatchChat = () => {
  // client for the query
  const client = new QueryClient();

  // Mutation Params
  type MutationParams = {
    userId: number;
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
    userId,
    jwt,
    chatId,
    options
  }: MutationParams) => {
    const QueryUrl = `/api/v1/users/${userId}/chats/${chatId}`;
    return await axios.patch<MutationResult>(QueryUrl, { options }, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
  }

  // Query
  return useMutation(mutator, {
    onSuccess: (data, params) => {
      client.invalidateQueries(['users', params.userId, 'chat', params.chatId]);
    }
  });
}

// To delete the chat
export const useDeleteChat = () => {
  // Mutation Params
  type MutationParams = {
    userId: number;
    jwt: string;
    chatId: number;
  };

  // Mutation Result
  type MutationResult = {
    message: string;
  }

  // Mutator
  const mutator = async ({ userId, jwt, chatId }: MutationParams) => {
    const QueryUrl = `/api/v1/users/${userId}/chats/${chatId}`;
    return await axios.delete<MutationResult>(QueryUrl, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
  }

  // Query
  return useMutation(mutator);
}

// Get blob of the chat
export const useGetChatBlob = ({
  userId,
  chatId,
  jwt
}: {
  userId: number;
  chatId: number;
  jwt: string;
}) => {
  // Query Key for the get chat
  const queryKey = ['users', userId, 'chat', chatId, 'blob'];

  // Response Type
  type ResponseType = Blob;

  // Fetcher
  const fetcher = async () => {
    const QueryUrl = `/api/v1/users/${userId}/chats/${chatId}/blob`;
    return await axios.get<ResponseType>(QueryUrl, {
      headers: { Authorization: `Bearer ${jwt}` },
      responseType: 'blob',
    });
  }

  // Query
  return useQuery(queryKey, fetcher);
}

// To get the token for the chat
export const useGetChatToken = ({
  userId,
  chatId,
  jwt,
  expiresIn,
}: {
  userId: number;
  chatId: number;
  jwt: string;
  expiresIn: string;
}) => {
  // Query Key for the get chat
  const queryKey = ['users', userId, 'chat', chatId, 'token'];

  // Fetcher
  const fetcher = async () => {
    const QueryUrl = `/api/v1/users/${userId}/chats/${chatId}/token`;
    return await axios.get<ResponseType>(QueryUrl, {
      headers: { Authorization: `Bearer ${jwt}` },
      params: { expiresIn },
    });
  }

  // Query
  return useQuery(queryKey, fetcher);
}
