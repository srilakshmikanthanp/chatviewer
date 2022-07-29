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

const ImageOscillate = keyframes`
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
  animation: ${ImageOscillate} 1s linear infinite;
  max-height: 300px;
  max-width: 300px;
`;

const Text = styled.p`
  font-size: larger;
  max-width: 600px;
  margin: 10px;
  text-align: center;
  font-weight: 600;
`;

const RowCenter = styled(Row)`
  justify-content: center;
  align-items: center;
  display: flex;
`;

const ColCenter = styled(Col)`
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

export default function Welcome() {
  // Message
  const message = (`
    Missing the feel while reading Exported chats
    don't worry chatviewer comes to rescue
  `);

  // render
  return (
    <WelcomeWrapper>
      <Header />
      <Container>
        <RowCenter>
          <ColCenter xs={12} lg={6}>
            <LogoImage src={ImgLogo} />
          </ColCenter>
          <ColCenter xs={12} lg={6}>
            <Text>{message}</Text>
            <Clickable
              onClick={() => null}
              isPrimary={true}
            >
              Import
            </Clickable>
          </ColCenter>
        </RowCenter>
      </Container>
      <Footer />
    </WelcomeWrapper>
  );
}
