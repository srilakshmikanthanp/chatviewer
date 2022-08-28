// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Chatshared, Dashboard, Viewchat, Welcome } from "./pages"
import { Routes, Route } from 'react-router-dom';
import styled from "styled-components";
import './styles/global.module.css';
import App404 from "./App404";

const AppContainer = styled.main`
  max-width: 100%;
  height: 100vh;
  width: 100vw;
  margin: 0%;
  padding: 0%;
`;

// Application
export default function App() {
  return (
    <AppContainer>
      <Routes>
        <Route path="/chatshared/:token" element={<Chatshared />} />
        <Route path="/viewchat" element={<Viewchat />} />
        <Route path="/" element={<Welcome />} />
        <Route path="*" element={<App404 />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </AppContainer>
  );
}
