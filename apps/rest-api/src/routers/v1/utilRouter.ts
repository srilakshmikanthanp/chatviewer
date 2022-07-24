// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { getChatWithJwtController } from "../../controllers";
import { getChatWithJwtValidator } from "../../validators";
import { Router } from "express";

// create util Router
const router = Router({mergeParams: true});

// get chat with jwt
router.get('/chat', getChatWithJwtValidator, getChatWithJwtController);

// export router
export default router;
