// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import {
  deleteChatByIdController, getTokenByIdController, getChatBlobController ,
  postChatController, getAllChatsController, getChatByIdController,
  patchChatByIdController,
} from "../../controllers";
import { postChatValidator, patchChatValidator } from "../../validators";
import { authenticator } from "../../middlewares";
import { Router } from "express";

// Create a new router for the chat API
const router = Router({ mergeParams: true });

// post a new chat
router.post("/", authenticator, postChatValidator, postChatController);

// delete a chat by id
router.delete("/:chat_id", authenticator, deleteChatByIdController);

// get all chats
router.get("/", authenticator, getAllChatsController);

// get a chat by id
router.get("/:chat_id", authenticator, getChatByIdController);

// patch a chat by id
router.patch("/:chat_id", authenticator, patchChatValidator, patchChatByIdController);

// get blob
router.get("/:chat_id/blob", authenticator, getChatBlobController);

// get share link
router.get("/:chat_id/token", authenticator, getTokenByIdController);

// export the router
export default router;
