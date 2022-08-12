// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

// Google Client ID for web application
export const GOOGLE_CLIENT_ID = "956872187563-rj6j961c7ri7u6adb3v97gk5othp01dv.apps.googleusercontent.com"

// Base URL for the API
export const BASE_URL = process.env["NODE_ENV"] === "production" ?
"https://api-chatviewer.herokuapp.com/" :
"http://localhost:8000";
