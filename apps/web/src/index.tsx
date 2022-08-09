// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { BASE_URL } from "./constants";
import store from "./redux/store";
import ReactDOM from "react-dom";
import App from "./App";
import axios from "axios";

// set the base url for the axios requests
axios.defaults.baseURL = BASE_URL;

// new query client for the app
const queryClient = new QueryClient();

// root element
const root = document.getElementById("root");

// Application
const Main = (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </QueryClientProvider>
);

// react root
ReactDOM.render(Main, root);
