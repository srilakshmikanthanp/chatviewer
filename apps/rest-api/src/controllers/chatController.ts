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
  const mimeType = req.body.mimeType;

  // set the chat id in the user data
  await user.createChat({
    mimeType: mimeType,
    data: data,
    name: req.body.name,
  });

  // send the success response
  res.status(200).json({ message: "Chat created" });
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
  let query = 'SELECT chatId, userId, mimeType, createdAt FROM Chats WHERE userId = ?';

  // if per_page is not null and page is not null
  if (per_page && page) {
    query += ` LIMIT ${per_page} OFFSET ${per_page * (page - 1)}`;
  }

  // get chats with raw query
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const results = <any[]>await sequelize.query(query, {
    type: QueryTypes.SELECT,
    replacements: [userID],
  });

  // add the blob url
  const chats = results.map(chat => {
    return {
      blobUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}${chat.chatId}/blob`,
      mimeType: chat.mimeType,
      chatId: chat.chatId,
      userId: chat.userId,
      name: chat.name,
      createdAt: chat.createdAt,
    }
  });

  // query to count the total number of chats
  const countQuery = 'SELECT COUNT(*) as total FROM Chats WHERE userId = ?';

  // get the total number of chats
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const total = +(<any>await sequelize.query(countQuery, {
    type: QueryTypes.SELECT,
    replacements: [userID],
  })).total;

  // construct the link header
  if (per_page && page) {
    const topMostUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const totalPages = Math.ceil(total / per_page);
    const links = [];

    if (page < totalPages) {
      links.push(`<${topMostUrl}?page=${page + 1}&per_page=${per_page}>; rel="next"`);
    }

    if (page > 1) {
      links.push(`<${topMostUrl}?page=${page - 1}&per_page=${per_page}>; rel="prev"`);
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
  const query = 'SELECT chatId, userId, mimeType, createdAt FROM chats WHERE userId = ? AND chatId = ?';

  // chat id
  const chatId = +req.params.chat_id;

  // get chat with raw query
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chat = <any[]>await sequelize.query(query, {
    replacements: [userID, chatId],
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
    name: chat[0].name,
    createdAt: chat[0].createdAt,
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
  const query = 'UPDATE chats SET name = ? WHERE userId = ? AND chatId = ?';

  // update the chat name with raw query
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = <any[]>await sequelize.query(query, {
    replacements: [name, userID, chatId],
    type: QueryTypes.UPDATE,
  });

  // if chat is not found
  if (!result.length) {
    return res.status(404).json({ message: "Chat not found" });
  }

  // send the success response
  res.status(200).json({ message: "Chat updated" });
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
  res.status(200).json({ message: "Chat deleted" });
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
  const expiry = req.body.expiry;

  // generate a jwt
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: expiry
  });

  // send the success response
  res.status(200).json({ token });
}
