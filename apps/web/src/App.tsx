// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { Chatshared, Dashboard, Viewchat, Welcome } from './pages';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import './styles/global.module.css';
import App404 from './App404';
import { useState } from 'react';

const AppContainer = styled.main`
  max-width: 100%;
  height: 100vh;
  width: 100vw;
  margin: 0%;
  padding: 0%;
`;

function Notice({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        Need a new Database Platform to continue service
      </DialogTitle>
      <DialogContent>
        <p>
          Thanks for using chatviewer, PlanetScale recently announced the&nbsp;
          <a href="https://planetscale.com/docs/concepts/hobby-plan-deprecation-faq">
            deprecation of the Hobby plan
          </a>,
          and unfortunately, I'm unable to afford monthly fees at the moment. If
          you know of any alternative solutions, I'd greatly appreciate your
          advice to know the latest status or want to give your comment visit&nbsp;
          <a href="https://github.com/srilakshmikanthanp/chatviewer/issues/23">
            github issue page
          </a>
        </p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

// Application
export default function App() {
  const [noticeShowing, setNoticeShowing] = useState(true);

  const handleClose = () => {
    setNoticeShowing(false)
  };

  return (
    <AppContainer>
      <Routes>
        <Route path="/chatshared/:token" element={<Chatshared />} />
        <Route path="/viewchat" element={<Viewchat />} />
        <Route path="/" element={<Welcome />} />
        <Route path="*" element={<App404 />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Notice open={noticeShowing} onClose={handleClose} />
    </AppContainer>
  );
}
