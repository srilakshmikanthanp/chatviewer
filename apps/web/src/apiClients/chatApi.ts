// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { useQuery, useMutation, QueryClient, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { IChat } from '../interfaces';

// To get all the chats Details
export const useGetChats = ({
  userId,
  jwt,
  params,
}: {
  userId: number;
  jwt: string;
  params: {
    perPage: number;
    page: number;
    sortBy: string;
  };
}) => {
  // Query Key
  const queryKey = ['users', userId, 'chats', params.perPage, params.page, params.sortBy];

  // Response
  type ResponseType = IChat[];

  // Fetcher
  const fetcher = async () => {
    const QueryUrl = `/api/v1/users/${userId}/chats?perPage=${params.perPage}` +
    `&page=${params.page}&sortBy=${params.sortBy}`
    return await axios.get<ResponseType>(QueryUrl, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
  };

  // Query
  return useQuery(queryKey, fetcher, { keepPreviousData: true });
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
  const queryKey = ['users', userId, 'chats', chatId];

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
  // Query Client Hook
  const queryClient = useQueryClient();

  // MutationParams
  type MutationParams = {
    userId: number;
    jwt: string;
    chat: {
      base64: string;
      name: string;
    };
  };

  // MutationResult
  type MutationResult = IChat;

  // Mutator
  const mutator = async ({ userId, jwt, chat }: MutationParams) => {
    const QueryUrl = `/api/v1/users/${userId}/chats`;
    return await axios.post<MutationResult>(QueryUrl, { ...chat }, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
  };

  // Mutation
  return useMutation(mutator, {
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries([
        'users', variables.userId, 'chats'
      ]);
    }
  });
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
    return await axios.patch<MutationResult>(QueryUrl, { ...options }, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
  }

  // Query
  return useMutation(mutator, {
    onSuccess: (data, params) => {
      client.invalidateQueries([
        'users', params.userId, 'chats'
      ]);
    }
  });
}

// To delete the chat
export const useDeleteChat = () => {
  // Query Client Hook
  const queryClient = useQueryClient();

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
  return useMutation(mutator, {
    onSuccess: (data, params) => {
      queryClient.invalidateQueries([
        'users', params.userId, 'chats'
      ]);
    }
  });
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
