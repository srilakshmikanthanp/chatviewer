// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Header, Footer, Clickable } from "../components";
import styled, { keyframes } from "styled-components";
import ImgLogo from "../assets/images/logo.png";
import { Container, Row, Col } from "react-bootstrap";

const WelcomeWrapper = styled.div`
  justify-content: center;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const ImgOscillator = keyframes`
  0% {
    transform: translateY(0px);
  }
  25% {
    transform: translateY(10px);
  }
  50% {
    transform: translateY(0px);
  }
  75% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0px);
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
  margin: 10px;
  text-align: center;
  font-weight: 600;
`;

export default function Welcome() {
  return (
    <WelcomeWrapper>
      <Header />
      <Container fluid={true} style={{ margin: "80px 0px" }}>
        <Row className="d-flex align-items-center justify-content-center">
          <Col xs={12} lg={6} className="d-flex flex-column align-items-center justify-content-center">
            <Paragraph>
              Missing the feel while reading Exported chats don't
              worry chat viewer comes to rescue
            </Paragraph>
            <Clickable onClick={() => null} isPrimary={true} >
              Import
            </Clickable>
          </Col>
          <Col xs={12} lg={6} className="d-flex flex-column align-items-center justify-content-center">
            <LogoImage alt="Chat Viewer" src={ImgLogo} />
          </Col>
        </Row>
      </Container>
      <Footer />
    </WelcomeWrapper>
  );
}
