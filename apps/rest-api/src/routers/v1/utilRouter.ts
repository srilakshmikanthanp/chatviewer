// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { getChatWithJwtController, getBlobWithJwtController } from "../../controllers";
import { Router } from "express";

// create util Router
const router = Router({mergeParams: true});

// get blob with jwt
router.get('/chat/:token/blob', getBlobWithJwtController);

// get chat with jwt
router.get('/chat/:token', getChatWithJwtController);

// export router
export default router;
