// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { IJwtAuthPayload } from "./interfaces";

interface ILocals {
  user_auth_payload?: IJwtAuthPayload;
}

declare module "Express" {
  export interface Response {
    locals: ILocals;
  }
}
