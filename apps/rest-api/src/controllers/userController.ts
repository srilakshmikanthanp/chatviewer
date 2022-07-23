// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Request, Response, NextFunction } from "express";
import { IUser } from "../interfaces/models";
import { IJwtPayload } from "../interfaces";
import sequelize from "../database";
import * as bcrypt from "bcrypt";

// create a user controller function
export async function userPostController(req: Request, res: Response, next: NextFunction) {
  // get the user id from the locals
  const userId = req.body.token;
}

