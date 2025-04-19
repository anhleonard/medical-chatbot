import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
};

export const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    closeLoading: (state) => {
      state.isLoading = false;
    },
    openLoading: (state) => {
      state.isLoading = true;
    },
  },
});

export const { closeLoading, openLoading } = loadingSlice.actions;

export const loadingReducer = loadingSlice.reducer;