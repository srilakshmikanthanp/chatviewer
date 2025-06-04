// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { OAuth2Client } from 'google-auth-library';
import { Request, Response } from 'express';
import { User, Chat } from '../models';

// create a user controller function
export async function userPostController(req: Request, res: Response) {
  // get the client secret from the environment variables
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

  // get the google client id from the environment variables
  const googleClientId = process.env.GOOGLE_CLIENT_ID;

  // create new google oauth2 client
  const oauth2Client = new OAuth2Client(googleClientId, googleClientSecret);

  // get the user id from the locals
  const googleToken = req.body.token;

  // verify the token
  try {
    // get the required data from the token
    const google_ticket = await oauth2Client.verifyIdToken({
      audience: googleClientId,
      idToken: googleToken
    });
    const payload = google_ticket.getPayload();

    if (!payload) {
      return res.status(500).json({ message: 'Cannot get user details from the token' });
    }

    const email = payload.email;
    const name = payload.name;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // store the user data in the database
    let user = await User.findOne({ where: { email } });

    // if user is not found
    if (!user) {
      user = await User.create({ name, email });
    }

    // create a jwt token
    const token = await user.createAuthJwtToken();

    // set the token in the response
    res.setHeader('auth-token', token);

    // send the token
    return res.status(200).json(user);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// get the user details from the database
export async function userGetController(req: Request, res: Response) {
  // get the user id and validate it
  const userID = +res.locals.user_auth_payload?.userId

  // id from the url should be same as the id from the jwt
  if (!userID) {
    return res.status(403).json({ message: 'Not a valid token' });
  }

  // get the user details from the database
  const user = await User.findOne({ where: { userId: userID } });

  // if user is not found
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // send the user details
  return res.status(200).json(user);
}

// update the user details in the database
export async function userPatchController(req: Request, res: Response) {
  // get the user id and validate it
  const userID = +res.locals.user_auth_payload?.userId

  // id from the url should be same as the id from the jwt
  if (!userID) {
    return res.status(403).json({ message: 'Not a valid token' });
  }

  // get the user details from the database
  const user = await User.findOne({ where: { userId: userID } });

  // if user is not found
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // get the new name
  const name = req.body.name || user.name;

  // update the user details in the database
  await user.update({ name });

  // send the user details
  return res.status(200).json(user);
}

// delete the user details from the database
export async function userDeleteController(req: Request, res: Response) {
  // get the user id and validate it
  const userID = +res.locals.user_auth_payload?.userId

  // id from the url should be same as the id from the jwt
  if (!userID) {
    return res.status(403).json({ message: 'Not a valid token' });
  }

  // get the user details from the database
  const user = await User.findOne({ where: { userId: userID } });

  // if user is not found
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // delete all chats for the user
  await Chat.destroy({ where: { userId: userID } });

  // delete the user details from the database
  await user.destroy();

  // send the user details
  return res.status(200).json({ message: 'User deleted'})
}
