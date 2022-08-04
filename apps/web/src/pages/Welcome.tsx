// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { createViewerState } from "../utilities/constructors";
import styled, { keyframes } from "styled-components";
import { Header, Footer } from "../components";
import ImgLogo from "../assets/images/logo.png";
import React, { ChangeEvent, useState } from "react";
import WhatsappParser from "../utilities/whatsapp";
import { getMimeType } from "../utilities/functions";
import { useNavigate } from "react-router-dom";
import { IMsg } from "../interfaces";
import {
  Container,
  Row,
  Col,
  Form
} from "react-bootstrap";
import {
  DialogContentText,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from "@mui/material";

const ContentWrapper = styled.div`
  justify-content: center;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const ImgOscillator = keyframes`
  0% {
    transform: translateY(-10px);
  }
  25% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(10px);
  }
  75% {
    transform: translateY(0px);
  }
  100% {
    transform: translateY(-10px);
  }
`;

const LogoImage = styled.img`
  animation: ${ImgOscillator} 1s linear infinite;
  max-height: 300px;
  max-width: 300px;
  margin: 0 auto;
`;

const Paragraph = styled.p`
  font-size: larger;
  max-width: 600px;
  margin: 20px 10px;
  text-align: center;
  font-weight: 600;
`;

export default function Welcome() {
  // State for the dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Navigation Tool
  const navigate = useNavigate();

  // Chats Data from the file
  const chatsData: IMsg[] = [];

  // on File Upload
  const handleFileUpload = async (evt: ChangeEvent<HTMLInputElement>) => {
    // get the File
    const inputFile = evt.target.files?.[0];

    // Check if the file is valid
    if (!inputFile) {
      throw new Error("No file selected");
    }

    // get the Whatsapp Parser
    const iterator = new WhatsappParser(
      inputFile.slice(0, inputFile.size, getMimeType(inputFile.name)
    ));

    // Clear the chats data
    chatsData.length = 0;

    // iterate over the file
    for await (const msg of iterator) {
      chatsData.push(msg);
    }

    // Stop the event propagation
    evt.stopPropagation();
  }

  // handle Import
  const handleImport = () => {
    navigate("/viewer", { state: createViewerState(chatsData) });
  }

  // body component
  const Body = () => (
    <ContentWrapper>
      <Container fluid={true} style={{ margin: "80px 0px" }}>
        <Row className="d-flex flex-column-reverse flex-md-row align-items-center justify-content-center">
          <Col className="d-flex flex-column align-items-center justify-content-center">
            <Paragraph>
              Missing the feel while reading Exported chats don't
              worry chat viewer comes to rescue
            </Paragraph>
            <Button onClick={() => setIsDialogOpen(true)} variant="outlined">
              Import
            </Button>
          </Col>
          <Col className="d-flex flex-column align-items-center justify-content-center">
            <LogoImage alt="Chat Viewer" src={ImgLogo} />
          </Col>
        </Row>
      </Container>
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
        <DialogTitle>Import Chat From File</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Import your chat from a file it should be either .txt or .zip.
          </DialogContentText>
          <Form className="mt-3">
            <Form.Group controlId="formBasicFile">
              <Form.Control
                onChange={handleFileUpload}
                type="file"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid city.
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleImport} color="primary">
            Import
          </Button>
        </DialogActions>
      </Dialog>
    </ContentWrapper>
  );

  // renter
  return (
    <React.Fragment>
      <Header />
      <Body />
      <Footer />
    </React.Fragment>
  );
}
