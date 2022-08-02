// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";
import App from "./App";

// root element
const root = document.getElementById("root");

// Application
const Main = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);

// react root
ReactDOM.render(Main, root);
