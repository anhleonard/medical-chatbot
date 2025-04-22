// Redux slice cho ConfirmModal
import { ConfirmModalState } from "@/types/system";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: ConfirmModalState = {
  isOpen: false,
  title: "",
  subtitle: "",
  onConfirm: () => {},
};

const confirmModalSlice = createSlice({
  name: "confirmModal",
  initialState,
  reducers: {
    openConfirmModal: (state, action: PayloadAction<Omit<ConfirmModalState, "isOpen">>) => {
      state.isOpen = true;
      state.title = action.payload.title;
      state.subtitle = action.payload.subtitle;
      state.onConfirm = action.payload.onConfirm;
    },
    closeConfirmModal: (state) => {
      state.isOpen = false;
    },
  },
});

export const { openConfirmModal, closeConfirmModal } = confirmModalSlice.actions;
export const confirmModalReducer = confirmModalSlice.reducer;
