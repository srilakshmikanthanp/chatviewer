// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

export default interface IJwtPayload {
  userId: number;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
};
