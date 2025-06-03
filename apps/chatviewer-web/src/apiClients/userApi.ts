// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { IUser } from '../types';

// To get the user details
export const useGetUser = ({
  token
}: {
  userId: number;
  token: string;
}) => {
  // Query Key for the get user
  const queryKey = ['users', 'me'];

  // Response Type
  type ResponseType = IUser;

  // Fetcher
  const fetcher = async () => {
    const QueryUrl = `/api/v2/users/me`;
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
    const QueryUrl = '/api/v2/users';
    return await axios.post<MutationResult>(QueryUrl, { token });
  };

  // Query
  return useMutation({
    mutationFn: mutator,
  })
};

// To patch the user details
export const usePatchUser = () => {
  /// client for the query
  const client = useQueryClient();

  // Mutation Params
  type MutationParams = {
    jwt: string;
    options: {
      name?: string;
    };
  };

  // MutationResult
  type MutationResult = IUser;

  // Mutator
  const mutator = async ({ jwt: token, options }: MutationParams) => {
    const mutationUrl = `/api/v2/users/me`;
    return await axios.patch<MutationResult>(mutationUrl,{
        name: options.name
      }, {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  };

  // Query
  return useMutation({
    mutationFn: mutator,
    onSuccess: (data, variables) => {
      client.invalidateQueries({ queryKey: ['users', 'me'] });
    }
  });
};

// To delete the user
export const useDeleteUser = () => {
  // Mutation Params
  type MutationParams = {
    jwt: string;
  };

  // MutationResult
  type MutationResult = {
    message: string;
  };

  // Query Function
  const mutator = async ({ jwt: token }: MutationParams) => {
    const mutationUrl = `/api/v2/users/me`;
    return await axios.delete<MutationResult>(mutationUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

  // Query
  return useMutation({
    mutationFn: mutator,
  });
};
