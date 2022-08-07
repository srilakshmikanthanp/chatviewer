// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { IUser } from '../interfaces';

// To get the user details
export const useGetUser = ({
  userId,
  token
}: {
  userId: number;
  token: string;
}) => {
  // Query Key for the get user
  const queryKey = ['user', userId];

  // Response Type
  type ResponseType = {
    user: IUser;
  };

  // Query
  return useQuery(queryKey, async () => {
    const response = await axios.get(`/api/v1/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data as ResponseType;
  });
};

// To sign up or sign in a user
export const useCreateUser = () => {
  // Mutation Params
  type MutationParams = {
    token: string;
  };

  // Response Type
  type ResponseType = {
    token: string;
  };

  // Query
  return useMutation(async ({ token }: MutationParams) => {
    const response = await axios.post('/api/v1/users', { token });
    return response.data as ResponseType;
  });
};

// To patch the user details
export const usePatchUser = () => {
  /// client for the query
  const client = new QueryClient();

  // Mutation Params
  type MutationParams = {
    userId: number;
    token: string;
    options: {
      name?: string;
    };
  };

  // Response Type
  type ResponseType = {
    userId: number;
  };

  // Query
  return useMutation(
    async ({ userId, token, options }: MutationParams) => {
      const response = await axios.patch(
        `/api/v1/users/${userId}`,
        { name: options.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data as ResponseType;
    },
    {
      onSuccess: (data, variables) => {
        client.invalidateQueries(['user', variables.userId]);
      }
    }
  );
};

// To delete the user
export const useDeleteUser = () => {
  // Mutation Params
  type MutationParams = {
    userId: number;
    token: string;
  };

  // Response Type
  type ResponseType = {
    userId: number;
  };

  // Query
  return useMutation(async ({ userId, token }: MutationParams) => {
    const response = await axios.delete(`/api/v1/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data as ResponseType;
  });
};
