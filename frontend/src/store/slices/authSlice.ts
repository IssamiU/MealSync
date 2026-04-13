import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/user";

type AuthPayload = User & {
  accessToken: string;
  refreshToken: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  refreshToken: string | null;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<AuthPayload>) => {
      state.user = {
        id: action.payload.id,
        name: action.payload.name,
        email: action.payload.email,
        preferences: action.payload.preferences,
      };
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    signOut: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
    },
  },
});

export const { signIn, signOut } = authSlice.actions;
export default authSlice.reducer;