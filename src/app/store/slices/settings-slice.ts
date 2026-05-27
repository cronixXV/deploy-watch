import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { STORAGE_KEYS } from '@/shared/consts/storage';

export type PollingInterval = 3000 | 5000 | 10000 | 30000;

export type SettingsState = {
  pollingInterval: PollingInterval;
  defaultProjectId: string | null;
  notificationsEnabled: boolean;
  compactTableMode: boolean;
};

const defaultSettings: SettingsState = {
  pollingInterval: 3000,
  defaultProjectId: null,
  notificationsEnabled: true,
  compactTableMode: false,
};

function isSettingsState(value: unknown): value is Partial<SettingsState> {
  return typeof value === 'object' && value !== null;
}

function loadSettings(): SettingsState {
  try {
    const rawSettings = localStorage.getItem(STORAGE_KEYS.settings);

    if (!rawSettings) {
      return defaultSettings;
    }

    const parsedSettings = JSON.parse(rawSettings);

    if (!isSettingsState(parsedSettings)) {
      return defaultSettings;
    }

    return {
      ...defaultSettings,
      ...parsedSettings,
    };
  } catch {
    return defaultSettings;
  }
}

function saveSettings(settings: SettingsState) {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
}

const initialState: SettingsState = loadSettings();

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    pollingIntervalChanged: (state, action: PayloadAction<PollingInterval>) => {
      state.pollingInterval = action.payload;
      saveSettings(state);
    },

    defaultProjectChanged: (state, action: PayloadAction<string | null>) => {
      state.defaultProjectId = action.payload;
      saveSettings(state);
    },

    notificationsToggled: (state, action: PayloadAction<boolean>) => {
      state.notificationsEnabled = action.payload;
      saveSettings(state);
    },

    settingsReset: () => {
      saveSettings(defaultSettings);

      return defaultSettings;
    },
  },
});

export const {
  pollingIntervalChanged,
  defaultProjectChanged,
  notificationsToggled,

  settingsReset,
} = settingsSlice.actions;

export const settingsReducer = settingsSlice.reducer;
