// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { configureStore } from "@reduxjs/toolkit";
import  rootReducer from "../slices";

// Create the store
const store = configureStore({
  reducer: rootReducer,
});

// Export the store
export default store;
