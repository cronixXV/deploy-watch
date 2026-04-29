import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import type { UserRole } from '@/shared/api/mocks/model/types/types';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
};

type AuthState = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isSessionRestored: boolean;
};

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isSessionRestored: false,
};

type LoginPayload = {
  user: AuthUser;
  token: string;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSucceeded: (state, action: PayloadAction<LoginPayload>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.isSessionRestored = true;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isSessionRestored = true;
    },

    sessionRestoreFinished: (state) => {
      state.isSessionRestored = true;
    },
  },
});

export const { loginSucceeded, logout, sessionRestoreFinished } =
  authSlice.actions;

export const authReducer = authSlice.reducer;
