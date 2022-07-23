// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { IJwtPayload } from "./interfaces";

interface ILocals {
  user_payload: IJwtPayload;
}

declare module "Express" {
  export interface Response {
    locals: ILocals;
  }
}
