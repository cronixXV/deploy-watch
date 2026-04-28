import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'viewer' | 'developer' | 'release_manager';

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
};

const isDev = import.meta.env.DEV;

const initialState: AuthState = {
  user: isDev
    ? {
        id: 'user-1',
        name: 'Alex Morgan',
        email: 'alex@deploywatch.dev',
        role: 'release_manager',
      }
    : null,
  token: isDev ? 'mock-token' : null,
  isAuthenticated: isDev,
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
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { loginSucceeded, logout } = authSlice.actions;

export const authReducer = authSlice.reducer;
