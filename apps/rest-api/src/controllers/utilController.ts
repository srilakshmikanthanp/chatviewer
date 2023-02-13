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
    const query = `
      SELECT chatId, userId, createdAt, updatedAt
      FROM ${Chat.tableName} WHERE chatId = ?
    `;

    // chat id
    const chatId = decoded.chatId;

    // get chat with raw query
    const chat = await sequelize.query(query, {
      replacements: [chatId],
      type: QueryTypes.SELECT,
    }) as [{
      chatId    : number,
      userId    : number,
      createdAt : Date,
      updatedAt : Date,
    }];

    // if chat is not found
    if (!chat.length) {
      return res.status(404).json({ message: "Chat not found" });
    }

    // send the success response
    res.status(200).json({
      blobUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}/blob`,
      chatId: chat[0].chatId,
      userId: chat[0].userId,
      createdAt: chat[0].createdAt,
      updatedAt: chat[0].updatedAt,
    });
  } catch (error) {
    res.status(410).json({ message: error.message });
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
    res.status(410).json({ message: error.message });
  }
}
