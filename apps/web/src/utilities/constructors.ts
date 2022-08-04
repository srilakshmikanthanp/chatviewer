// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { IMsg } from "../interfaces";
import { IViewerState } from "../interfaces/pages";

/**
 * This function is used to create a new IViewerState object.
 *
 * @param messages - messages to be displayed
 * @return - returns a viewer state
 */
export function createViewerState(messages: IMsg[]): IViewerState {
  return {
    body: { messages }
  };
}
