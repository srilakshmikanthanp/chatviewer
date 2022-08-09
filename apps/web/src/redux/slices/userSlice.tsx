// Copyright (c) 2022 Sri Lakshmi Kanthan P
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../interfaces"


/**********************
 * State Interface   *
 ********************/
interface UserState {
  userDetails: {
    user: IUser;
    jwt: string;
  } | null;
}

/**********************
 *     Selectors      *
 *********************/
export const selectUser = (state: { user: UserState }) =>{
  return state.user.userDetails?.user ?? null;
}

export const selectJwt = (state: { user: UserState }) =>{
  return state.user.userDetails?.jwt ?? null;
}

/**********************
 *  Internal Actions  *
 *********************/
const _setUser = (state: UserState , action: PayloadAction<UserState>) => {
  state.userDetails = action.payload.userDetails;
}

/**********************
 * Initial State      *
 * *******************/
const initialState: UserState = { userDetails: null };

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
