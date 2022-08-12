// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./userSlice";

// Combine all reducers into one root reducer
const rootReducer = combineReducers({
  user: userReducer,
});

// Export the root reducer
export default rootReducer;
