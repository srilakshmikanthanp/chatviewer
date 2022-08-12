// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { persistStore, persistReducer } from 'redux-persist'
import { configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage'
import  rootReducer from "../slices";

// config for redux persist
const persistConfig = {
  key: 'ReduxPersist',
  storage,
}

// create the redux store
const persistedReducer = persistReducer(
  persistConfig, rootReducer
);

// Create the store
const store = configureStore({
  reducer: persistedReducer,
});

// create the persistor
const persistor = persistStore(store);

// Export the store
export { persistor, store };
