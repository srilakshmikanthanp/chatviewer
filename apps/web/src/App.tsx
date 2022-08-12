// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Chatshared, Dashboard, Viewchat, Welcome } from "./pages"
import { Routes, Route } from 'react-router-dom';
import './styles/global.module.css';

// Application
export default function App() {
  return (
    <Routes>
      <Route path="/chatshared/:token" element={<Chatshared />} />
      <Route path="/viewchat" element={<Viewchat />} />
      <Route path="/" element={<Welcome />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
