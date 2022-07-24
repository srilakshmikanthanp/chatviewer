// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { IJwtChatPayload } from '../interfaces';
import { Request, Response } from "express";
import { Chat } from '../models';
import * as jwt from 'jsonwebtoken';

// get chat with the jwt token controller
export async function getChatWithJwtController(req: Request, res: Response) {
  // secret key to verify the token
  const JwtSecret = process.env.JWT_SECRET;

  // get the token from the request
  const JwtToken = req.params.token;

  // verify the token
  try {
    const decoded: IJwtChatPayload = jwt.verify(JwtToken, JwtSecret) as IJwtChatPayload;
    const chat = await Chat.findByPk(decoded.chatId);
    res.send(Object.assign({}, chat.toJSON(), { data: chat.data.toString('base64') }));
  } catch (error) {
    res.status(401).send('Unauthorized');
  }
}
