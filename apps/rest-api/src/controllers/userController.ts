// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Request, Response, NextFunction } from "express";
import { OAuth2Client } from "google-auth-library";
import { IUser } from "../interfaces/models";
import { IJwtPayload } from "../interfaces";
import sequelize from "../database";
import * as bcrypt from "bcrypt";

// create a user controller function
export async function userPostController(req: Request, res: Response, next: NextFunction) {
  // get the google client id from the environment variables
  const googleClientId = process.env.GOOGLE_CLIENT_ID;

  // create new google oauth2 client
  const oauth2Client = new OAuth2Client(googleClientId);

  // get the user id from the locals
  const token = req.body.token;

  // verify the token
  try {
    const google_ticket = await oauth2Client.verifyIdToken({ idToken: token, audience: googleClientId });
    const payload = google_ticket.getPayload();
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token",
    });
  }
}
