// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { userPostController, userGetController, userPatchController, userDeleteController } from "../../controllers"
import { userPatchValidator, userPostValidator } from "../../validators";
import { authenticator } from "../../middlewares";
import { Router } from "express";

// create a router object
const router = Router({ mergeParams: true });

// login user, user to login or signup user
router.post("/", userPostValidator, userPostController);

// get the user details from the database
router.get("/me", authenticator, userGetController);

// update user details in the database
router.patch("/me", authenticator, userPatchValidator, userPatchController);

// delete user from the database
router.delete("/me", authenticator, userDeleteController);

// export the router object
export default router;
