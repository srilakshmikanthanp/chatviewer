// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT


import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { PersistGate } from 'redux-persist/integration/react';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { createRoot } from "react-dom/client";
import axios from "axios";

import { setUser } from "./redux/slices/userSlice";
import { persistor, store } from "./redux/store";
import { BASE_URL } from "./constants";
import AppError from "./AppError";
import App from "./App";
import { CircularProgress } from "@mui/material";

// Jwt token expired
axios.interceptors.response.use(undefined, (error) => {
  if (error.response.status !== 401) {
    return Promise.reject(error.response.data.message || error);
  }
  store.dispatch(setUser({user: null, jwt: null}));
  window.location.replace("/");
  return Promise.resolve();
});

// Unhandled Rejection
window.addEventListener("unhandledrejection", (event) => {
  window.alert(event.reason);
  event.preventDefault();
  event.stopPropagation();
  console.log(event.reason);
});

// Window Error
window.addEventListener("error", (event) => {
  window.alert(event.message);
  event.preventDefault();
  event.stopPropagation();
  console.log(event.error);
});

// set the base url for the axios requests
axios.defaults.baseURL = BASE_URL;

// new query client for the application
const queryClient = new QueryClient();

// Loading Component while the loading
const Loading = (
  <div style={{
    justifyContent: "center",
    display: "flex",
    height: "100vh",
    width: "100vw",
    alignItems: "center"
  }}>
    <CircularProgress size={50} thickness={5} />
  </div>
);

// Application Wrapper
const Application = (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={Loading} >
        <BrowserRouter>
          <AppError><App /></AppError>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  </QueryClientProvider>
);

// root element to render the application
const root = document.getElementById("root");

if (!root) {
  throw new Error('Root element with id "root" not found');
}

// react root
const reactRoot = createRoot(root);

// render the application
reactRoot.render(
  Application
);

