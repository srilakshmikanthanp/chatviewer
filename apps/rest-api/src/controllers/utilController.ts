// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { IJwtChatPayload } from '../interfaces';
import { Request, Response } from "express";
import { Chat } from '../models';
import * as jwt from 'jsonwebtoken';
import { sequelize } from '../database';
import { QueryTypes } from 'sequelize';

// get chat with the jwt token controller
export async function getChatWithJwtController(req: Request, res: Response) {
  // secret key to verify the token
  const JwtSecret = process.env.JWT_SECRET;

  // get the token from the request
  const JwtToken = req.params.token;

  // verify the token
  try {
    // constants
    const decoded: IJwtChatPayload = jwt.verify(JwtToken, JwtSecret) as IJwtChatPayload;

    // query string
    const query = 'SELECT chatId, userId, mimeType, createdAt FROM chats WHERE chatId = ?';

    // chat id
    const chatId = decoded.chatId;

    // get chat with raw query
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const chat = <any[]>await sequelize.query(query, {
      replacements: [chatId],
      type: QueryTypes.SELECT,
    });

    // if chat is not found
    if (!chat.length) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // send the success response
    res.status(200).json({
      blobUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}/blob`,
      mimeType: chat[0].mimeType,
      chatId: chat[0].chatId,
      userId: chat[0].userId,
      createdAt: chat[0].createdAt,
    });
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}

// get blob with the jwt token controller
export async function getBlobWithJwtController(req: Request, res: Response) {
  // secret key to verify the token
  const JwtSecret = process.env.JWT_SECRET;

  // get the token from the request
  const JwtToken = req.params.token;

  // verify the token
  try {
    const decoded: IJwtChatPayload = jwt.verify(JwtToken, JwtSecret) as IJwtChatPayload;
    const chat = await Chat.findByPk(decoded.chatId);
    res.set('Content-Type', chat.mimeType);
    res.send(chat.data);
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
}
