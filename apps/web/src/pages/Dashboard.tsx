// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import ChatBackGround from "../assets/images/chatbg.jpg";
import { Header, Clickable, Footer } from "../components";
import { Container, Row, Col } from "react-bootstrap";
import styled from "styled-components";

const UserDetailsWrapper = styled(Container)`
  background-image: url(${ChatBackGround});
  background-size: cover;
  padding: 15px;
  margin: 10px;
  color: white;
  display: flex;
  font-weight: bold;
  max-width: 90vw;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

function UserDetails() {
  return (
    <UserDetailsWrapper>
      <Row className="d-flex align-items-center justify-content-center">
        <Col xs={12} className="d-flex justify-content-center">
          <h3>{"Sri Lakshmi Kanthan P"}</h3>
        </Col>
        <Col xs={12} className="d-flex justify-content-center">
          <h6>{"srilakshmikanthanp@gmail.com"}</h6>
        </Col>
        <Col xs={6} className="d-flex justify-content-end">
          <Clickable onClick={() => null} isPrimary={true} >
            Edit
          </Clickable>
        </Col>
        <Col xs={6} className="d-flex justify-content-start">
          <Clickable onClick={() => null} isPrimary={true} >
            Delete
          </Clickable>
        </Col>
      </Row>
    </UserDetailsWrapper>
  );
}

const DashboardWrapper = styled.div`
  justify-content: center;
  height: 100%;
  width: 100%;
  margin-top: 100px;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export default function Dashboard() {
  return (
    <DashboardWrapper>
      <Header />
      <UserDetails />
      <Footer />
    </DashboardWrapper>
  );
}
