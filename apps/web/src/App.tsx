// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Routes, Route } from 'react-router-dom';
import './styles/global.module.css';
import {
  Dashboard,
  Viewer,
  Welcome
} from "./pages"

// Application
export default function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/" element={<Welcome />} />
      <Route path="/viewer" element={<Viewer />} />
    </Routes>
  );
}
