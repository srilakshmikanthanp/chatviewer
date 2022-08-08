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
  type ResponseType = IUser;

  // Fetcher
  const fetcher = async () => {
    const QueryUrl = `/api/v1/users/${userId}`;
    return await axios.get<ResponseType>(QueryUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  // Query
  return useQuery(queryKey, fetcher);
};

// To sign up or sign in a user
export const useCreateUser = () => {
  // Mutation Params
  type MutationParams = {
    token: string;
  };

  // MutationResult
  type MutationResult = IUser;

  // Mutator
  const mutator = async ({ token }: MutationParams) => {
    const QueryUrl = '/api/v1/users';
    return await axios.post<MutationResult>(QueryUrl, { token });
  };

  // Query
  return useMutation(mutator);
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

  // Mutator
  const mutator = async ({ userId, jwt: token, options }: MutationParams) => {
    const mutationUrl = `/api/v1/users/${userId}`;
    return await axios.patch<MutationResult>(mutationUrl,{
        name: options.name
      }, {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  };

  // Query
  return useMutation(mutator, {
    onSuccess: (data, variables) => {
      client.invalidateQueries(['user', variables.userId]);
    }
  });
};

// To delete the user
export const useDeleteUser = () => {
  // Mutation Params
  type MutationParams = {
    userId: number;
    jwt: string;
  };

  // MutationResult
  type MutationResult = {
    message: string;
  };

  // Query Function
  const mutator = async ({ userId, jwt: token }: MutationParams) => {
    const mutationUrl = `/api/v1/users/${userId}`;
    return await axios.delete<MutationResult>(mutationUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  // Query
  return useMutation(mutator);
};
