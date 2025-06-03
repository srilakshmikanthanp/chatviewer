// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import styled from "styled-components";

const StyledApp404 = styled(App404)`
  justify-content: center;
  align-items: center;
  flex-direction: column;
  display: flex;
  width: 100%;
  height: 100%;
`;

const Text404 = styled('h1')`
  font-size: 3rem;
  font-weight: bold;
`;

const Text = styled('h2')`
  font-size: 1.5rem;
  font-weight: bold;
`;

export default function App404() {
  return (
    <StyledApp404>
      <Text404>
        404
      </Text404>
      <Text>
        Page not found
      </Text>
    </StyledApp404>
  );
}
