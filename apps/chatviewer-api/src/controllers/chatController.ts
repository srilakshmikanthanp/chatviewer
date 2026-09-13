// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Request, Response } from 'express';
import { sequelize } from '../database';
import { User, Chat } from '../models';
import { QueryTypes } from 'sequelize';

// post chat controller function
export async function postChatController(req: Request, res: Response) {
  // get the user id and validate it
  const userID = +res.locals.user_auth_payload?.userId

  // id from the url should be same as the id from the jwt
  if (!userID) {
    return res.status(403).json({ message: 'Not a valid token' });
  }

  // get the user data from the database
  const user = await User.findOne({ where: { userId: userID } });

  // if user is not found
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // set the chat in the database
  const chat = await user.createChat({
    name: req.body.name,
    driveFileId: req.body.driveFileId,
  });

  // send the success response
  return res.status(200).json({
    chatId: chat.chatId,
    userId: chat.userId,
    name: chat.name,
    driveFileId: chat.driveFileId,
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt
  });
}

// get all chats controller function
export async function getAllChatsController(req: Request, res: Response) {
  // get the user id and validate it
  const userID = +res.locals.user_auth_payload?.userId

  // id from the url should be same as the id from the jwt
  if (!userID) {
    return res.status(403).json({ message: 'Not a valid token' });
  }

  // get the user data from the database
  const user = await User.findOne({ where: { userId: userID } });

  // if user is not found
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // get the per-page from query
  const perPage = req.query['perPage'] ? +req.query['perPage'] : 10;

  // get the page from query
  const page = req.query['page'] ? +req.query['page'] : 1;

  // get the sort-by
  const sortBy = req.query['sortBy'];

  // if per page, page are not a number
  if (!perPage || !page) {
    return res.status(400).json({ message: 'Invalid perPage or page' });
  }

  // if it is not a string
  if (typeof sortBy !== 'string' || !['createdAt', "name" , 'updatedAt'].includes(sortBy)) {
    return res.status(400).json({
      message: 'shortBy Should be name, createdAt or updatedAt'
    });
  }

  // query string
  let ChatQuery = `
    SELECT "chatId", "userId", "name", "driveFileId", "createdAt", "updatedAt"
    FROM "${Chat.tableName}" WHERE "userId" = ?
  `;

  // if has short by then add it to the query string
  if (sortBy) {
    ChatQuery += ` ORDER BY "${sortBy == "updatedAt" ? sortBy  + " DESC" : sortBy}" `;
  }

  // if per_page is present and page is present
  if (perPage && page) {
    ChatQuery += ` LIMIT ${perPage} OFFSET ${perPage * (page - 1)}`;
  }

  // get chats with raw query
  const results = (await sequelize.query(ChatQuery, {
    type: QueryTypes.SELECT,
    replacements: [userID]
  })) as [
    {
      chatId: number;
      userId: number;
      name: string;
      driveFileId: string;
      createdAt: Date;
      updatedAt: Date;
    }
  ];

  // format response
  const chats = results.map((chat) => {
    return {
      chatId: chat.chatId,
      userId: chat.userId,
      name: chat.name,
      driveFileId: chat.driveFileId,
      createdAt: chat.createdAt,
      updatedAt: chat.updatedAt
    };
  });

  // query to count the total number of chats
  const countQuery = `SELECT COUNT(*) as total FROM "${Chat.tableName}" WHERE "userId" = ?`;

  // get the total number of chats
  const total = +(
    (await sequelize.query(countQuery, {
      type: QueryTypes.SELECT,
      replacements: [userID],
      plain: true
    })) as {
      total: number;
    }
  ).total;

  // construct the link header
  if (perPage && page) {
    const topMostUrl  =   `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const totalPages  =   Math.ceil(total / perPage);
    const links       =   [];

    if (page > 1) {
      links.push(`<${topMostUrl}?page=${page - 1}&per_page=${perPage}>; rel="prev"`);
    }

    if (page < totalPages) {
      links.push(`<${topMostUrl}?page=${page + 1}&per_page=${perPage}>; rel="next"`);
    }

    res.setHeader('Link', links.join(', '));
  }

  // send the success response
  return res.status(200).json(chats);
}

// get chat by id controller function
export async function getChatByIdController(req: Request, res: Response) {
  // get the user id and validate it
  const userID = +res.locals.user_auth_payload?.userId

  // id from the url should be same as the id from the jwt
  if (!userID) {
    return res.status(403).json({ message: 'Not a valid token' });
  }

  // get the user data from the database
  const user = await User.findOne({ where: { userId: userID } });

  // if user is not found
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // chat id
  const chatId = +req.params.chat_id;

  // get chat with raw query
  const chat = await Chat.findOne({ where: { chatId: chatId, userId: userID } });

  // if chat is not found
  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }

  // send the success response
  return res.status(200).json({
    chatId: chat.chatId,
    userId: chat.userId,
    name: chat.name,
    driveFileId: chat.driveFileId,
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt
  });
}

// patch chat by id controller function
export async function patchChatByIdController(req: Request, res: Response) {
  // get the user id from JWt and url and validate it
  const userID = +res.locals.user_auth_payload?.userId

  // id from the url should be same as the id from the jwt
  if (!userID) {
    return res.status(403).json({ message: 'Not a valid token' });
  }

  // get the user data from the database
  const user = await User.findOne({ where: { userId: userID } });

  // if user is not found
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // chat id
  const chatId = +req.params.chat_id;

  // get the chat name from the request body
  const name = req.body.name;

  // update the chat name with raw query
  const result = await Chat.update({ name: name }, { where: { userId: userID, chatId: chatId } });

  // if chat is not found
  if (result[0] != 1) {
    return res.status(404).json({ message: 'Chat not found' });
  }

  // get the chat with raw query
  const chat = await Chat.findOne({ where: { userId: userID, chatId: chatId } });

  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }

  // send the success response
  return res.status(200).json({
    chatId: chat.chatId,
    userId: chat.userId,
    name: chat.name,
    driveFileId: chat.driveFileId,
    createdAt: chat.createdAt,
    updatedAt: chat.updatedAt
  });
}

// delete chat by id controller function
export async function deleteChatByIdController(req: Request, res: Response) {
  // get the user id and validate it
  const userID = +res.locals.user_auth_payload?.userId

  // id from the url should be same as the id from the jwt
  if (!userID) {
    return res.status(403).json({ message: 'Not a valid token' });
  }

  // get the user data from the database
  const user = await User.findOne({ where: { userId: userID } });

  // if user is not found
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // chat id
  const chatId = +req.params.chat_id;

  // get the chat data from the database
  const chat = await Chat.findOne({ where: { chatId: chatId, userId: userID } });

  // if chat is not found
  if (!chat) {
    return res.status(404).json({ message: 'Chat not found' });
  }

  // delete the chat
  await chat.destroy();

  // send the success response
  return res.status(200).json({ message: 'ok' });
}
