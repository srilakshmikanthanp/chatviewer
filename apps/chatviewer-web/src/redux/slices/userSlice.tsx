// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../types"


/**********************
 * State Interface   *
 ********************/
export interface UserState {
  user: IUser | null;
  jwt: string | null;
}

/**********************
 *     Selectors      *
 *********************/
export const selectUser = (state: { user: UserState }) =>{
  return state.user.user;
}

export const selectJwt = (state: { user: UserState }) =>{
  return state.user.jwt;
}

/**********************
 *  Internal Actions  *
 *********************/
const _setUser = (state: UserState , action: PayloadAction<UserState>) => {
  state.user  =   action.payload.user;
  state.jwt   =   action.payload.jwt;
}

/**********************
 * Initial State      *
 * *******************/
const initialState: UserState = { user: null, jwt: null };

/**********************
 * Slice Definition   *
 *********************/
const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
      setUser: _setUser,
    }
});

/**********************
 * export actions     *
 * *******************/
export const { setUser } = userSlice.actions;

/**********************
 * export reducer     *
 * *******************/
export default userSlice.reducer;
