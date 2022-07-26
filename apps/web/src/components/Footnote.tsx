// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import styled from "styled-components";

const FootnoteWrapper = styled.div`
  box-shadow: var(--shadow-color) 1.95px 1.95px 2.6px;
  height: fit-content;
  width: 100vw;
  margin: 0%;
  padding: 10px;
  color: var(--text-color);
  background-color: var(--background-color);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

const SocialLinks = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  flex-direction: row;
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
  font-size: medium;
  font-weight: bold;
`;

export default function Footnote() {
  return (
    <FootnoteWrapper>
      <SocialLinks>
        <SocialLink href="https://github.com/srilakshmikanthanp/chatviewer">
          <LinkImg src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png" />
        </SocialLink>
      </SocialLinks>
      <Copyright>
        Copyright &copy; {new Date().getFullYear()} Sri Lakshmi Kanthan P
      </Copyright>
    </FootnoteWrapper>
  );
}
