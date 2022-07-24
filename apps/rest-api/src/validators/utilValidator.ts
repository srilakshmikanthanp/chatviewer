// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { NextFunction, Request, Response } from "express";
import * as yup from "yup";

// get chat with the jwt token validator
export async function getChatWithJwtValidator(req: Request, res: Response, next: NextFunction) {
  // validator scheme object
  const objectSchema = yup.object({
    token: yup.string().required()
  });

  // validate
  try {
    await objectSchema.validate(req.body);
    next();
  } catch(error) {
    res.status(401).json({
      message: "Invalid Token"
    });
  }
}
