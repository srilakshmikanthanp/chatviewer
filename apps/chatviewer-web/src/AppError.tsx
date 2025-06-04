// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import React, { HTMLAttributes, ErrorInfo } from "react";
import { Typography, Button } from "@mui/material";
import Alert from '@mui/material/Alert';
import styled from "styled-components";

/**
 * Css for Error Component
 */
const ErrorContent = styled('div')`
  width: calc(100vw - 30px);
  height: 100vh;
  display: flex;
  margin: 0 15px;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`;

/**
 * Css for Actions
 */
const Actions = styled('div')`
  justify-content: center;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 10px;
`;

/**
 * A Class That Detects Error And Renders the Error Message
 */
export default class AppError extends React.Component<HTMLAttributes<HTMLDivElement>, {
  info: ErrorInfo | null;
  hasError: boolean;
  error: Error | null;
  isCopied: boolean;
}> {
  #issuePage = "https://github.com/srilakshmikanthanp/Chatviewer/issues/new";

  /**
   * Copy the Component Trace to clip board
   */
  copyErrorToClipBoard = () => {
    if (this.state.info && this.state.error?.stack) {
      const componentTrace = "\nComponent Trace:\n" + this.state.info.componentStack;
      const errorTrace = "\nError Trace:\n" + this.state.error?.stack;
      window.navigator.clipboard.writeText( componentTrace + errorTrace );
      this.setState({ isCopied: true });
    }
  }

  /**
   * Constructor for the Error Component
   * @param props Props
   */
  constructor(props: React.HTMLAttributes<HTMLDivElement>) {
    // Call Super Class Constructor
    super(props);

    // Initialize State
    this.state = {
      hasError: false,
      error: null,
      info: null,
      isCopied: false
    };
  }

  /**
   * Get the Updated State
   * @returns state
   */
  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  /**
   * Catch Method
   */
  override componentDidCatch(error: Error, info: ErrorInfo) {
    // Set the State
    this.setState({ hasError: true, error: error, info: info });

    // Log the Error
    console.log(error, info);
  }

  // Render
  override render() {
    // If did not catch any error
    if (!this.state.hasError) {
      return this.props.children;
    }

    // Return Error Message
    return (
      <ErrorContent>
        <Alert severity="error">
          Opps! Something went wrong. Please try again later.
        </Alert>
        <Typography align="center" mt={3} sx={{ maxWidth: "350px" }}>
          Sorry for the inconvenience. We are working on it.
          If you want to Inform us up, Please Issue a Bug
          Report at&nbsp;
          <a href={this.#issuePage} target="_blank" rel="noreferrer">
            Github
          </a>
          &nbsp;With the Trace. You Can copy the trace to
          clipboard by Clicking Button Below. Thank you
          for using our Application.
        </Typography>
        <Actions className="mt-3">
          <Button
            color={this.state.isCopied ? "success" : "primary"}
            size="small"
            variant="outlined"
            onClick={this.copyErrorToClipBoard}
          >
            {this.state.isCopied ? "Copied" : "Copy"}
          </Button>
        </Actions>
      </ErrorContent>
    );
  }
}
