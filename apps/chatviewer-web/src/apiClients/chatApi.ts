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
      base64: string;
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

// Get blob of the chat
export const useGetChatBlob = ({
  chatId,
  jwt
}: {
  chatId: number;
  jwt: string;
}) => {
  // Query Key for the get chat
  const queryKey = ['chat', chatId, 'blob'];

  // Response Type
  type ResponseType = Blob;

  // Fetcher
  const fetcher = async () => {
    const QueryUrl = `/api/v2/chats/${chatId}/blob`;
    return await axios.get<ResponseType>(QueryUrl, {
      headers: { Authorization: `Bearer ${jwt}` },
      responseType: 'blob',
    });
  }

  // Query
  return useQuery({
    refetchOnWindowFocus: false,
    queryKey,
    queryFn: fetcher,
    placeholderData: (prev) => prev
  });
}

// To get the token for the chat
export const useGetChatToken = ({
  chatId,
  jwt,
  expiresIn,
}: {
  chatId: number;
  jwt: string;
  expiresIn: string;
}) => {
  // Query Key for the get chat
  const queryKey = ['chat', chatId, 'token'];

  // Fetcher
  const fetcher = async () => {
    const QueryUrl = `/api/v2/chats/${chatId}/token`;
    return await axios.get<ResponseType>(QueryUrl, {
      headers: { Authorization: `Bearer ${jwt}` },
      params: { expiresIn },
    });
  }

  // Query
  return useQuery({
    refetchOnWindowFocus: false,
    queryKey,
    queryFn: fetcher,
    placeholderData: (prev) => prev
  });
}


// To get the chat with token
export const useChatWithToken = ({ token }: { token: string }) => {
  // Query Key for the get chat
  const queryKey = ['chats', 'shared', token];

  // Response Type
  type ResponseType = IChat;

  // Fetcher
  const fetcher = async () => {
    const QueryUrl = `/api/v2/chats/shared/${token}`;
    return await axios.get<ResponseType>(QueryUrl, {
      headers: { Authorization: `Bearer ${token}` }
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

// To get Blob with token
export const useBlobWithToken = ({ token }: { token: string }) => {
  // Query Key for the get chat
  const queryKey = ['chats', 'shared', token, 'blob'];

  // Response Type
  type ResponseType = Blob;

  // Fetcher
  const fetcher = async () => {
    const QueryUrl = `/api/v2/chats/shared/${token}/blob`;
    return await axios.get<ResponseType>(QueryUrl, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: 'blob'
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
