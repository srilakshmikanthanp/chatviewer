// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { Container, Row, Col } from "react-bootstrap";
import ChatBG from "../assets/images/chatbg.jpg";
import styled from "styled-components";
import { Button } from "@mui/material";
import { IUser } from "../types";
import { HTMLAttributes } from "react";

interface IUserViewProps extends HTMLAttributes<HTMLDivElement> {
  onDelete?: (user: IUser) => void;
  user: IUser;
  onEdit?: (user: IUser) => void;
}

const UserViewWrapper = styled(Container)`

  background-image: url(${ChatBG});
  justify-content: center;
  background-size: cover;
  padding: 15px;
  margin: 10px;
  color: white;
  display: flex;
  font-weight: bold;
  max-width: 90vw;
  align-items: center;
  flex-direction: column;
`;

export default function UserView({ onDelete, user, onEdit, className }: IUserViewProps) {
  return (
    <UserViewWrapper className={className}>
      <Row className="d-flex align-items-center justify-content-center">
        <Col xs={12} className="d-flex justify-content-center">
          <h3>{user.name}</h3>
        </Col>
        <Col xs={12} className="d-flex justify-content-center">
          <h6>{user.email}</h6>
        </Col>
        <Col xs={6} className="d-flex justify-content-end">
          <Button
            onClick={() => onEdit && onEdit(user)}
            variant="contained"
          >
            Edit Details
          </Button>
        </Col>
        <Col xs={6} className="d-flex justify-content-start">
          <Button
            onClick={() => onDelete && onDelete(user)}
            variant="contained"
            color="warning"
          >
            Remove Me
          </Button>
        </Col>
      </Row>
    </UserViewWrapper>
  );
}
