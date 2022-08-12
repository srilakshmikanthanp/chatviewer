// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

// create a user validator function
export async function userPostValidator(req: Request, res: Response, next: NextFunction) {
  // define the schema for the request body
  const objectSchema = yup.object({
    token: yup.string().required(),
  });

  // validate the request body
  try {
    await objectSchema.validate(req.body);
    next();
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
}

// update user validator function
export async function userPatchValidator(req: Request, res: Response, next: NextFunction) {
  // define the schema for the request body
  const objectSchema = yup.object({
    name: yup.string(),
  });

  // validate the request body
  try {
    await objectSchema.validate(req.body);
    next();
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
}
