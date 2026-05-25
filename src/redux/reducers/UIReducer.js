import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: true,
};

const UISlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
  },
});

export const { toggleSidebar, setSidebarOpen } = UISlice.actions;
export default UISlice.reducer;
