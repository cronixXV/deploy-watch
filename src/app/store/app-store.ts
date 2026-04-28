import { configureStore } from '@reduxjs/toolkit';

import { authReducer } from './slices/auth-slice';
import { settingsReducer } from './slices/settings-slice';
import { uiReducer } from './slices/ui-slice.ts';

export const appStore = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof appStore.getState>;
export type AppDispatch = typeof appStore.dispatch;
