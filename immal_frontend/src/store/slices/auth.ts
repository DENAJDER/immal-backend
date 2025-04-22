import { createSlice } from "@reduxjs/toolkit";
import { Account } from "../../types";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  account: Account | null;
}

const initialState: AuthState = {
  token: null,
  refreshToken: null,
  account: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthTokens: (state, action) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
    setAccount: (state, action) => {
      state.account = action.payload;
    },
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.account = null;
    },
  },
});

export default authSlice;
