// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { PersistGate } from 'redux-persist/integration/react';
import { persistor, store } from "./redux/store";
import { BrowserRouter } from "react-router-dom";
import ReactLoading from 'react-loading';
import { Provider } from "react-redux";
import { BASE_URL } from "./constants";
import ReactDOM from "react-dom";
import AppError from "./AppError";
import App from "./App";
import axios from "axios";

// root element to render the application
const root = document.getElementById("root");

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
    <ReactLoading
      color="#0051ff"
    />
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

// react root
ReactDOM.render(Application, root);
