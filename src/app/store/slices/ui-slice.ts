import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type AppModal =
  | null
  | 'approve-deployment'
  | 'reject-deployment'
  | 'rollback-deployment';

type AppDrawer =
  | null
  | 'build-logs'
  | 'pipeline-details'
  | 'deployment-details';

type UiState = {
  sidebarCollapsed: boolean;
  openedModal: AppModal;
  openedDrawer: AppDrawer;
};

const initialState: UiState = {
  sidebarCollapsed: false,
  openedModal: null,
  openedDrawer: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },

    setSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.sidebarCollapsed = action.payload;
    },

    openModal: (state, action: PayloadAction<Exclude<AppModal, null>>) => {
      state.openedModal = action.payload;
    },

    closeModal: (state) => {
      state.openedModal = null;
    },

    openDrawer: (state, action: PayloadAction<Exclude<AppDrawer, null>>) => {
      state.openedDrawer = action.payload;
    },

    closeDrawer: (state) => {
      state.openedDrawer = null;
    },
  },
});

export const {
  toggleSidebar,
  setSidebarCollapsed,
  openModal,
  closeModal,
  openDrawer,
  closeDrawer,
} = uiSlice.actions;

export const uiReducer = uiSlice.reducer;
