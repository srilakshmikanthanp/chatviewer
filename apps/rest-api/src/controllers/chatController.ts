// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { IJwtChatPayload } from "../interfaces";
import { Request, Response } from "express";
import { sequelize } from "../database";
import { User, Chat } from "../models";
import { QueryTypes } from "sequelize";
import * as jwt from "jsonwebtoken";

// post chat controller function
export async function postChatController(req: Request, res: Response) {
  // get the user id and validate it
  const userID = res.locals.user_auth_payload?.userId === +req.params.user_id ? +req.params.user_id : null;

  // id from the url should be same as the id from the jwt
  if (!userID) {
    return res.status(401).json({ message: "Not a valid token" });
  }

  // get the user data from the database
  const user = await User.findOne({ where: { userId: userID } });

  // if user is not found
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // get the chat data from the request body
  const data = Buffer.from(req.body.data, "base64");

  // set the chat id in the user data
  const chat = await user.createChat({mimeType: req.body.mimeType, data: data, name: req.body.name});

  // send the success response
  res.status(200).json( chat );
}

// get all chats controller function
export async function getAllChatsController(req: Request, res: Response) {
  // get the user id and validate it
  const userID = res.locals.user_auth_payload?.userId === +req.params.user_id ? +req.params.user_id : null;

  // id from the url should be same as the id from the jwt
  if (!userID) {
    return res.status(401).json({ message: "Not a valid token" });
  }

  // get the user data from the database
  const user = await User.findOne({ where: { userId: userID } });

  // if user is not found
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // get the per_page from query
  const per_page = +req.query.per_page;

  // get the page from query
  const page = +req.query.page;

  // query string
  let ChatQuery = 'SELECT chatId, userId, name, createdAt, updatedAt FROM Chats WHERE userId = ?';

  // if per_page is not null and page is not null
  if (per_page && page) {
    ChatQuery += ` LIMIT ${per_page} OFFSET ${per_page * (page - 1)}`;
  }

  // get chats with raw query
  const results = await sequelize.query(ChatQuery, {
    type: QueryTypes.SELECT,
    replacements: [userID],
  }) as [{
    chatId: number;
    userId: number;
    name: number;
    createdAt: Date;
    updatedAt: Date;
  }];

  // add the blob url
  const chats = results.map(chat => {
    return {
      blobUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}${chat.chatId}/blob`,
      chatId: chat.chatId,
      userId: chat.userId,
      name: chat.name,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt,
    }
  });

  // query to count the total number of chats
  const countQuery = 'SELECT COUNT(*) as total FROM Chats WHERE userId = ?';

  // get the total number of chats
  const total = +(await sequelize.query(countQuery, {
    type: QueryTypes.SELECT,
    replacements: [userID],
    plain: true,
  }) as {
    total: number
  }).total;

  // construct the link header
  if (per_page && page) {
    const topMostUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const totalPages = Math.ceil(total / per_page);
    const links = [];

    if (page > 1) {
      links.push(`<${topMostUrl}?page=${page - 1}&per_page=${per_page}>; rel="prev"`);
    }

    if (page < totalPages) {
      links.push(`<${topMostUrl}?page=${page + 1}&per_page=${per_page}>; rel="next"`);
    }

    res.set('Link', links.join(', '));
  }

  // send the success response
  res.status(200).json(chats);
}

// get chat by id controller function
export async function getChatByIdController(req: Request, res: Response) {
  // get the user id and validate it
  const userID = res.locals.user_auth_payload?.userId === +req.params.user_id ? +req.params.user_id : null;

  // id from the url should be same as the id from the jwt
  if (!userID) {
    return res.status(401).json({ message: "Not a valid token" });
  }

  // get the user data from the database
  const user = await User.findOne({ where: { userId: userID } });

  // if user is not found
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // query string
  const query = 'SELECT chatId, userId, name, createdAt, updatedAt FROM chats WHERE userId = ? AND chatId = ?';

  // chat id
  const chatId = +req.params.chat_id;

  // get chat with raw query
  const chat = await sequelize.query(query, {
    replacements: [userID, chatId],
    type: QueryTypes.SELECT,
  }) as [{
    chatId    : number;
    userId    : number;
    name      : string;
    createdAt : Date;
    updatedAt : Date;
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
    name: chat[0].name,
    createdAt: chat[0].createdAt,
    updatedAt: chat[0].updatedAt,
  });
}

// patch chat by id controller function
export async function patchChatByIdController(req: Request, res: Response) {
  // get the user id from JWt and url and validate it
  const userID = res.locals.user_auth_payload?.userId === +req.params.user_id ? +req.params.user_id : null;

  // id from the url should be same as the id from the jwt
  if (!userID) {
    return res.status(401).json({ message: "Not a valid token" });
  }

  // get the user data from the database
  const user = await User.findOne({ where: { userId: userID } });

  // if user is not found
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // chat id
  const chatId = +req.params.chat_id;

  // get the chat name from the request body
  const name = req.body.name;

  // query string
  const updateQuery = 'UPDATE chats SET name = ? WHERE userId = ? AND chatId = ?';

  // update the chat name with raw query
  const result = await sequelize.query(updateQuery, {
    replacements: [name, userID, chatId],
    type: QueryTypes.UPDATE,
  });

  // if chat is not found
  if (!result.length) {
    return res.status(404).json({ message: "Chat not found" });
  }

  // get the chat with raw query
  const getQuery = 'SELECT chatId, userId, name, createdAt, updatedAt FROM chats WHERE userId = ? AND chatId = ?';

  // get the chat with raw query
  const chat = await sequelize.query(getQuery, {
    replacements: [userID, chatId],
    type: QueryTypes.SELECT,
  }) as [{
    chatId    : number;
    userId    : number;
    name      : string;
    createdAt : Date;
    updatedAt : Date;
  }];

  // send the success response
  res.status(200).json(chat[0]);
}

// delete chat by id controller function
export async function deleteChatByIdController(req: Request, res: Response) {
  // get the user id and validate it
  const userID = res.locals.user_auth_payload?.userId === +req.params.user_id ? +req.params.user_id : null;

  // id from the url should be same as the id from the jwt
  if (!userID) {
    return res.status(401).json({ message: "Not a valid token" });
  }

  // get the user data from the database
  const user = await User.findOne({ where: { userId: userID } });

  // if user is not found
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // chat id
  const chatId = +req.params.chat_id;

  // get the chat data from the database
  const chat = await Chat.findOne({ where: { chatId: chatId } });

  // if chat is not found
  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  // delete the chat
  await chat.destroy();

  // send the success response
  res.status(200).json({ message: "ok" });
}

// get the chat blob controller function
export async function getChatBlobController(req: Request, res: Response) {
  // get the user id and validate it
  const userID = res.locals.user_auth_payload?.userId === +req.params.user_id ? +req.params.user_id : null;

  // id from the url should be same as the id from the jwt
  if (!userID) {
    return res.status(401).json({ message: "Not a valid token" });
  }

  // get the user data from the database
  const user = await User.findOne({ where: { userId: userID } });

  // if user is not found
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // chat id
  const chatId = +req.params.chat_id;

  // get the chat data from the database
  const chat = await Chat.findOne({ where: { chatId: chatId } });

  // if chat is not found
  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  // get the blob
  const blob = chat.data;

  // set the content type
  res.setHeader('Content-Type', chat.mimeType);

  // send the success response
  res.status(200).send(blob);
}

// share chat by id controller function
export async function getTokenByIdController(req: Request, res: Response) {
  // get the user id and validate it
  const userID = res.locals.user_auth_payload?.userId === +req.params.user_id ? +req.params.user_id : null;

  // id from the url should be same as the id from the jwt
  if (!userID) {
    return res.status(401).json({ message: "Not a valid token" });
  }

  // get the user data from the database
  const user = await User.findOne({ where: { userId: userID } });

  // if user is not found
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // chat id
  const chatId = +req.params.chat_id;

  // if chat is not found
  if (!user.hasChat(chatId)) {
    return res.status(404).json({ message: "Chat not found" });
  }

  // payload
  const payload: IJwtChatPayload = { chatId: chatId };

  // get the expiry
  const expiry = req.body.expiresIn;

  // generate a jwt
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiry
  });

  // set the header
  res.setHeader('Authorization', `Bearer ${token}`);

  // send the success response
  res.status(200);
}
