// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { useQuery, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { IUser } from '../interfaces';

// To sign up or sign in a user
export const useSignUpOrSignIn = ({ token }: { token: string }) => {
  // Query Key for the sign up or sign in
  const queryKey = ['users', 'post'];

  // Response Type
  type ResponseType = {
    token: string;
  };

  // Query
  return useMutation(queryKey, async () => {
    const response = await axios.post('/api/v1/users', { token });
    return response.data as ResponseType;
  });
};

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

// To patch the user details
export const usePatchUser = ({
  userId,
  token,
  name
}: {
  userId: number;
  token: string;
  name: string;
}) => {
  // Query Key for the patch user
  const queryKey = ['user', userId];

  // Response Type
  type ResponseType = {
    userId: number;
  };

  // Query
  return useMutation(queryKey, async () => {
    const response = await axios.patch(
      `/api/v1/users/${userId}`,
      { name },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data as ResponseType;
  });
};

// To delete the user
export const useDeleteUser = ({
  userId,
  token
}: {
  userId: number;
  token: string;
}) => {
  // Query Key for the delete user
  const queryKey = ['user', userId];

  // Response Type
  type ResponseType = {
    userId: number;
  };

  // Query
  return useMutation(queryKey, async () => {
    const response = await axios.delete(`/api/v1/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data as ResponseType;
  });
};
