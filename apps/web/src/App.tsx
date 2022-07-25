// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import Navigation from "./components/Navigation";

export default function App() {
  return (
    <Navigation isSignedIn={true} onSignIn={(token) => console.log("Token" + token)}/>
  );
}
