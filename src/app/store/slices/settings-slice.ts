import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type Theme = 'light' | 'dark';

type SettingsState = {
  theme: Theme;
  pollingIntervalMs: number;
  compactMode: boolean;
};

const initialState: SettingsState = {
  theme: 'dark',
  pollingIntervalMs: 3000,
  compactMode: false,
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },

    setPollingIntervalMs: (state, action: PayloadAction<number>) => {
      state.pollingIntervalMs = action.payload;
    },

    setCompactMode: (state, action: PayloadAction<boolean>) => {
      state.compactMode = action.payload;
    },
  },
});

export const { setTheme, setPollingIntervalMs, setCompactMode } =
  settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;
