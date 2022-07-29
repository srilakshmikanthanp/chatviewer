// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import styled from "styled-components";

const FooterWrapper = styled.div`
  background-color: var(--bs-body-bg);
  color: var(--bs-body-color);
  height: fit-content;
  padding: 10px 10px;
  position: fixed;
  width: 100vw;
  bottom: 0;
  left: 0;
  margin: 0px;
  display: flex;
  flex-direction: row;
  z-index: 1000000000;
`;

const SocialLinks = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: row;
  margin-right: auto;
  padding: 0px 10px;
`;

const SocialLink = styled.a`
  text-decoration: none;
`;

const LinkImg = styled.img`
  height: 30px;
  width: 30px;
  cursor: pointer;
`;

const Copyright = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  color: gray;
  padding: 0px 10px;
  font-weight: 400;
  font-size: 0.8rem;
  margin-left: auto;
`;

export default function Footer() {
  return (
    <FooterWrapper>
      <SocialLinks>
        <SocialLink href="https://github.com/srilakshmikanthanp/chatviewer">
          <LinkImg src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" />
        </SocialLink>
      </SocialLinks>
      <Copyright>
        Copyright &copy; {new Date().getFullYear()} Sri Lakshmi Kanthan P
      </Copyright>
    </FooterWrapper>
  );
}
