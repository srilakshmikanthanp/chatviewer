// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Request, Response, NextFunction } from "express";
import * as yup from "yup";

// post chat validation function
export async function postChatValidator (req: Request, res: Response, next: NextFunction) {
  // create a schema for the post chat request
  const schema = yup.object().shape({
    mimeType: yup.string().required(),
    data: yup.string().required(),
  });

  // validate the request body
  try {
    await schema.validate(req.body);
    next();
  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
}

// share link validation function
export async function getTokenByIdValidator (req: Request, res: Response, next: NextFunction) {
  // create a schema for the share link request
  const schema = yup.object().shape({
    expiry: yup.string().required(),
  });

  // validate the request body
  try {
    await schema.validate(req.body);
    next();
  } catch (err) {
    res.status(400).json({
      error: err.message
    });
  }
}
