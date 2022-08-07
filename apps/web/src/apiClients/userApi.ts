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
  type ResponseType = IUser

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

  // MutationResult
  type MutationResult = {
    jwt: string;
    user: IUser;
  };

  // Query
  return useMutation(async ({ token }: MutationParams) => {
    const response = await axios.post('/api/v1/users', { token });
    const jwt = response.headers['authorization'][0].split(' ')[1];
    const user = response.data as IUser;
    return { user: user, jwt: jwt } as MutationResult;
  });
};

// To patch the user details
export const usePatchUser = () => {
  /// client for the query
  const client = new QueryClient();

  // Mutation Params
  type MutationParams = {
    userId: number;
    jwt: string;
    options: {
      name?: string;
    };
  };

  // MutationResult
  type MutationResult = IUser;

  // Query
  return useMutation(
    async ({ userId, jwt: token, options }: MutationParams) => {
      const response = await axios.patch(
        `/api/v1/users/${userId}`,
        { name: options.name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data as MutationResult;
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
    jwt: string;
  };

  // MutationResult
  type MutationResult = IUser;

  // Query
  return useMutation(async ({ userId, jwt: token }: MutationParams) => {
    const response = await axios.delete(`/api/v1/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data as MutationResult;
  });
};
