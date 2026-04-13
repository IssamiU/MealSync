import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/user";

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
};

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    signOut: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    updatePreferences: (state, action: PayloadAction<User["preferences"]>) => {
      if (state.user) {
        state.user.preferences = action.payload;
      }
    },
  },
});

export const { signIn, signOut, updatePreferences } = authSlice.actions;
export default authSlice.reducer;